import { EventEmitter } from "node:events";
import type { Config } from "../config.js";
import type {
  Action,
  Memory,
  Needs,
  NpcId,
  NpcState,
  Persona,
  Place,
  PlaceId,
  Snapshot,
  TownEvent,
  TownEventType,
  TownSpec,
} from "../types.js";
import { Clock, within } from "./clock.js";
import { MemoryStream } from "../npc/memory.js";
import { compilePersonaPrompt, loadTown } from "../npc/persona.js";
import type { ActionOut } from "../npc/schema.js";
import type { DialogueSituation, DialogueTurn, Mind, Situation } from "../mind/types.js";
import { ScriptedMind } from "../mind/scripted.js";
import { MythosMind, RefusalError, type CallRecord } from "../mind/mythos.js";
import { Journal } from "../store/journal.js";

export interface TownOptions {
  config: Config;
  townDir: string;
  /** Replace the live mind, mostly for tests. */
  mind?: Mind;
  journal?: boolean;
  seed?: number;
}

/** How long each action keeps a townsperson busy, in simulated minutes. */
const DURATION: Record<Action["kind"], number> = {
  move: 10,
  work: 60,
  talk: 20,
  eat: 30,
  rest: 60,
  wander: 20,
  idle: 20,
};

/** Need drift per tick while awake, per 10 simulated minutes. */
const DRIFT: Needs = { energy: -0.008, hunger: -0.012, social: -0.007, purpose: -0.005 };

const REFLECTION_THRESHOLD = 30;
const MAX_DIALOGUE_LINES = 6;
const RETRIEVE_K = 8;

interface NpcRuntime {
  persona: Persona;
  state: NpcState;
  memory: MemoryStream;
  prompt: string;
  lastReflectionAt: number;
  inDialogue: boolean;
}

/**
 * The town is the loop. It owns the clock, every townsperson's state and
 * memory, the journal, and the choice of which mind answers for whom.
 * Minds make choices; the town makes them true.
 */
export class Town extends EventEmitter {
  readonly spec: TownSpec;
  readonly clock: Clock;
  readonly placesById: Map<PlaceId, Place>;
  readonly config: Config;
  private readonly npcs = new Map<NpcId, NpcRuntime>();
  private readonly names = new Map<NpcId, string>();
  private readonly scripted: ScriptedMind;
  private readonly live: Mind | null;
  private readonly journal: Journal;
  readonly calls = { today: 0, total: 0 };
  private budgetWarned = false;
  private readonly recentEvents: TownEvent[] = [];

  constructor(opts: TownOptions) {
    super();
    this.config = opts.config;
    const loaded = loadTown(opts.townDir);
    this.spec = loaded.spec;
    this.placesById = loaded.placesById;
    this.clock = new Clock(this.spec.clock);
    this.scripted = new ScriptedMind(opts.seed ?? 7);
    this.journal = new Journal(this.config.varDir, opts.journal ?? true);

    for (const p of loaded.personas) this.names.set(p.id, p.name);
    for (const p of loaded.personas) {
      const prompt = compilePersonaPrompt(p, this.spec, this.placesById, this.names);
      const block = p.routine.find((b) => within(this.clock.minuteOfDay, b.start, b.end));
      this.npcs.set(p.id, {
        persona: structuredClone(p),
        state: {
          id: p.id,
          place: p.home,
          needs: { energy: 0.9, hunger: 0.7, social: 0.6, purpose: 0.6 },
          mood: "even",
          dayPlan: [],
          currentAction: null,
          busyUntil: 0,
          asleep: block ? /sleep/i.test(block.activity) : false,
          reflectionPressure: 0,
        },
        memory: new MemoryStream(p.id),
        prompt,
        lastReflectionAt: this.clock.minute,
        inDialogue: false,
      });
    }

    if (opts.mind) {
      this.live = opts.mind;
    } else if (this.config.offline) {
      this.live = null;
    } else {
      this.live = new MythosMind({
        model: this.config.model,
        effort: this.config.effort,
        deepEffort: this.config.deepEffort,
        systemPromptFor: (persona) => this.npcs.get(persona.id)?.prompt ?? "",
        onCall: (r) => this.onCall(r),
      });
    }
  }

  get offline(): boolean {
    return this.live === null;
  }

  get personas(): Persona[] {
    return [...this.npcs.values()].map((n) => n.persona);
  }

  state(id: NpcId): NpcState | undefined {
    return this.npcs.get(id)?.state;
  }

  memories(id: NpcId): readonly Memory[] {
    return this.npcs.get(id)?.memory.all() ?? [];
  }

  prompt(id: NpcId): string | undefined {
    return this.npcs.get(id)?.prompt;
  }

  /** The last `n` events, newest last. */
  tail(n = 50): TownEvent[] {
    return this.recentEvents.slice(-n);
  }

  snapshot(): Snapshot {
    return {
      town: this.spec.name,
      day: this.clock.day,
      time: this.clock.time,
      minute: this.clock.minute,
      tick: this.clock.tick,
      npcs: [...this.npcs.values()].map((n) => ({
        ...n.state,
        name: n.persona.name,
        role: n.persona.role,
      })),
      places: this.spec.places,
      offline: this.offline,
      calls: { today: this.calls.today, budget: this.config.dailyCallBudget, total: this.calls.total },
    };
  }

  /**
   * Drop a fact into the town. Everyone at `place` (or everyone, when omitted)
   * remembers it. This is the operator's hand on the world: a storm, a letter,
   * a stranger at the gate.
   */
  async announce(text: string, place?: PlaceId, importance?: number): Promise<void> {
    const hearers = [...this.npcs.values()].filter((n) => !place || n.state.place === place);
    for (const n of hearers) {
      const imp = importance ?? (await this.withMind(n, (m) => m.rateImportance(n.persona, text), 5)) ?? 5;
      n.memory.add("observation", text, imp, this.clock.minute, ["announce"]);
    }
    this.record("memory", text, { place, data: { hearers: hearers.map((h) => h.persona.id) } });
  }

  /** Run `ticks` ticks with `delayMs` wall-clock pause between them. */
  async run(ticks: number, delayMs = 0, signal?: AbortSignal): Promise<void> {
    for (let i = 0; i < ticks; i += 1) {
      if (signal?.aborted) return;
      await this.step();
      if (delayMs > 0) await sleep(delayMs);
    }
  }

  /** Advance the town by one tick. */
  async step(): Promise<void> {
    const crossedMidnight = this.clock.advance();
    if (crossedMidnight) {
      this.calls.today = 0;
      this.budgetWarned = false;
      this.record("day", `Day ${this.clock.day} begins in ${this.spec.name}.`);
    }
    if (this.clock.minuteOfDay % 60 === 0) {
      this.record("tick", `${this.clock.time}, ${this.clock.phase}.`);
    }

    for (const n of this.npcs.values()) {
      try {
        await this.stepNpc(n);
      } catch (err) {
        this.record("error", `${n.persona.name}: ${(err as Error).message}`, { npc: n.persona.id });
      }
    }

    for (const n of this.npcs.values()) {
      if (n.state.asleep || n.inDialogue) continue;
      n.state.reflectionPressure = n.memory.pressureSince(n.lastReflectionAt);
      if (n.state.reflectionPressure >= REFLECTION_THRESHOLD) {
        try {
          await this.reflect(n);
        } catch (err) {
          this.record("error", `${n.persona.name} could not reflect: ${(err as Error).message}`, { npc: n.persona.id });
        }
      }
    }

    this.journal.snapshot(this.snapshot());
  }

  private async stepNpc(n: NpcRuntime): Promise<void> {
    const { state, persona } = n;
    const now = this.clock.minute;
    const block = persona.routine.find((b) => within(this.clock.minuteOfDay, b.start, b.end));
    const shouldSleep = block ? /sleep/i.test(block.activity) : false;

    if (state.asleep) {
      state.needs.energy = clamp(state.needs.energy + 0.02);
      if (!shouldSleep) {
        state.asleep = false;
        state.busyUntil = 0;
        this.record("wake", `${persona.name} wakes up.`, { npc: persona.id, place: state.place });
        await this.planDay(n);
      }
      return;
    }

    if (shouldSleep && state.place === persona.home && !n.inDialogue) {
      state.asleep = true;
      state.currentAction = null;
      this.record("sleep", `${persona.name} goes to sleep.`, { npc: persona.id, place: state.place });
      return;
    }

    drift(state.needs);

    if (n.inDialogue || state.busyUntil > now) return;

    if (state.currentAction) {
      settle(state, state.currentAction);
      state.currentAction = null;
    }

    const situation = this.situationFor(n);
    const out = await this.withMind(n, (m) => m.decide(situation), null);
    const action = out ? this.validate(n, out) : fallbackIdle("Nothing came to mind.");
    if (out?.mood) state.mood = out.mood;
    await this.apply(n, action);
  }

  private validate(n: NpcRuntime, out: ActionOut): Action {
    const here = this.placesById.get(n.state.place);
    const action: Action = {
      kind: out.kind,
      reason: out.reason,
      visible: out.visible,
    };
    if (out.kind === "move") {
      const dest = out.place ?? "";
      const ok = here?.exits.includes(dest) && this.isOpen(dest);
      if (!ok) return fallbackIdle(`Wanted to go to ${dest} but could not.`);
      action.place = dest;
    }
    if (out.kind === "talk") {
      const target = out.target ? this.npcs.get(out.target) : undefined;
      const ok =
        target &&
        target.persona.id !== n.persona.id &&
        target.state.place === n.state.place &&
        !target.state.asleep &&
        !target.inDialogue;
      if (!ok) return fallbackIdle(`Wanted to talk to ${out.target ?? "someone"} but could not.`);
      action.target = target.persona.id;
      action.utterance = out.utterance?.trim() || "Hello.";
    }
    return action;
  }

  private async apply(n: NpcRuntime, action: Action): Promise<void> {
    const { state, persona } = n;
    const now = this.clock.minute;
    state.currentAction = action;
    state.busyUntil = now + DURATION[action.kind];

    switch (action.kind) {
      case "move": {
        const from = state.place;
        const to = action.place as PlaceId;
        state.place = to;
        const toName = this.placesById.get(to)?.name ?? to;
        this.record("move", `${persona.name} goes to ${toName}.`, { npc: persona.id, place: to, data: { from, to } });
        n.memory.add("observation", `I went to ${toName}. ${action.reason}`, 2, now, [to]);
        this.observeOthers(n, `${persona.name} arrived at ${toName}.`, 1);
        return;
      }
      case "talk": {
        const partner = this.npcs.get(action.target as NpcId);
        if (!partner) return;
        await this.dialogue(n, partner, action.utterance ?? "Hello.");
        return;
      }
      default: {
        this.record("action", `${persona.name} is ${action.visible}.`, { npc: persona.id, place: state.place, data: { kind: action.kind } });
        n.memory.add("observation", `I spent some time ${action.visible}. ${action.reason}`, 2, now, [state.place]);
        this.observeOthers(n, `${persona.name} was ${action.visible}.`, 1);
      }
    }
  }

  private async dialogue(a: NpcRuntime, b: NpcRuntime, opener: string): Promise<void> {
    a.inDialogue = true;
    b.inDialogue = true;
    const placeId = a.state.place;
    const transcript: DialogueTurn[] = [{ speaker: a.persona.name, line: opener }];
    this.record("say", `${a.persona.name}: ${opener}`, { npc: a.persona.id, place: placeId, data: { to: b.persona.id } });

    let speaker = b;
    let listener = a;
    let maxImportance = 2;
    for (let i = 1; i < MAX_DIALOGUE_LINES; i += 1) {
      const turnsLeft = MAX_DIALOGUE_LINES - i;
      const situation: DialogueSituation = {
        ...this.situationFor(speaker, `${listener.persona.name} ${transcript.map((t) => t.line).join(" ")}`),
        partner: { id: listener.persona.id, name: listener.persona.name },
        transcript: [...transcript],
        turnsLeft,
      };
      const line = await this.withMind(speaker, (m) => m.speak(situation), null);
      if (!line) break;
      transcript.push({ speaker: speaker.persona.name, line: line.line });
      maxImportance = Math.max(maxImportance, line.importance);
      this.record("say", `${speaker.persona.name}: ${line.line}`, { npc: speaker.persona.id, place: placeId, data: { to: listener.persona.id } });
      if (line.wrapUp) break;
      [speaker, listener] = [listener, speaker];
    }

    const text = transcript.map((t) => `${t.speaker}: ${t.line}`).join("\n");
    const now = this.clock.minute;
    a.memory.add("dialogue", `I talked with ${b.persona.name} at ${this.placeName(placeId)}.\n${text}`, maxImportance, now, [b.persona.id, placeId]);
    b.memory.add("dialogue", `${a.persona.name} talked with me at ${this.placeName(placeId)}.\n${text}`, maxImportance, now, [a.persona.id, placeId]);
    for (const other of this.npcs.values()) {
      if (other === a || other === b || other.state.place !== placeId || other.state.asleep) continue;
      other.memory.add("observation", `${a.persona.name} and ${b.persona.name} were talking at ${this.placeName(placeId)}.`, 2, now, [a.persona.id, b.persona.id, placeId]);
    }
    a.state.needs.social = clamp(a.state.needs.social + 0.25);
    b.state.needs.social = clamp(b.state.needs.social + 0.25);
    b.state.busyUntil = now + DURATION.talk;
    a.inDialogue = false;
    b.inDialogue = false;
    this.record("dialogue", `${a.persona.name} and ${b.persona.name} talked (${transcript.length} lines).`, { npc: a.persona.id, place: placeId, data: { transcript } });
  }

  private async planDay(n: NpcRuntime): Promise<void> {
    const situation = this.situationFor(n, "yesterday plans people");
    const plan = await this.withMind(n, (m) => m.planDay(situation), null);
    if (!plan) return;
    n.state.dayPlan = plan.plan;
    n.state.mood = plan.mood;
    n.memory.add("plan", `My plan for day ${this.clock.day}: ${plan.plan.join("; ")}`, 3, this.clock.minute, ["plan"]);
    this.record("plan", `${n.persona.name} plans the day: ${plan.plan[0] ?? ""}`, { npc: n.persona.id, place: n.state.place, data: plan });
  }

  private async reflect(n: NpcRuntime): Promise<void> {
    const memories = n.memory.recent(20);
    const situation: Situation = { ...this.situationFor(n), memories };
    const out = await this.withMind(n, (m) => m.reflect(situation), null);
    n.lastReflectionAt = this.clock.minute;
    n.state.reflectionPressure = 0;
    if (!out) return;
    for (const insight of out.insights) {
      n.memory.add("reflection", insight, 6, this.clock.minute, ["reflection"]);
    }
    for (const u of out.relationshipUpdates) {
      if (!this.npcs.has(u.npc) || u.npc === n.persona.id) continue;
      let rel = n.persona.relationships.find((r) => r.to === u.npc);
      if (!rel) {
        rel = { to: u.npc, bond: 0, trust: 0.5, note: u.note };
        n.persona.relationships.push(rel);
      }
      rel.bond = Math.max(-1, Math.min(1, rel.bond + u.bondDelta));
      rel.trust = clamp(rel.trust + u.trustDelta);
      rel.note = u.note;
    }
    this.record("reflection", `${n.persona.name} reflects: ${out.insights[0] ?? ""}`, { npc: n.persona.id, place: n.state.place, data: out });
  }

  private situationFor(n: NpcRuntime, extraQuery = ""): Situation {
    const place = this.placesById.get(n.state.place) as Place;
    const present = [...this.npcs.values()]
      .filter((o) => o !== n && o.state.place === n.state.place && !o.state.asleep)
      .map((o) => ({ id: o.persona.id, name: o.persona.name, visible: o.state.currentAction?.visible ?? "around" }));
    const exits = place.exits.map((id) => ({
      id,
      name: this.placeName(id),
      open: this.isOpen(id),
    }));
    const block = n.persona.routine.find((b) => within(this.clock.minuteOfDay, b.start, b.end));
    const routineNow = block ? `${block.activity} at ${this.placeName(block.place)}` : "nothing in particular";
    let routeHint: Situation["routeHint"] = null;
    if (block && block.place !== n.state.place) {
      const via = this.nextHop(n.state.place, block.place);
      if (via) {
        routeHint = { place: block.place, placeName: this.placeName(block.place), via, viaName: this.placeName(via) };
      }
    }
    const query = [place.name, routineNow, ...present.map((p) => p.name), extraQuery].join(" ");
    return {
      persona: n.persona,
      state: n.state,
      place,
      present,
      exits,
      day: this.clock.day,
      time: this.clock.time,
      phase: this.clock.phase,
      routineNow,
      routeHint,
      memories: n.memory.retrieve(query, this.clock.minute, RETRIEVE_K),
    };
  }

  /** Breadth-first next step from `from` towards `to`, through open places only. */
  private nextHop(from: PlaceId, to: PlaceId): PlaceId | null {
    if (from === to) return null;
    const prev = new Map<PlaceId, PlaceId | null>([[from, null]]);
    const queue: PlaceId[] = [from];
    while (queue.length) {
      const cur = queue.shift() as PlaceId;
      for (const next of this.placesById.get(cur)?.exits ?? []) {
        if (prev.has(next)) continue;
        if (next !== to && !this.isOpen(next)) continue;
        prev.set(next, cur);
        if (next === to) {
          let step: PlaceId = to;
          while (prev.get(step) !== from) step = prev.get(step) as PlaceId;
          return this.isOpen(step) ? step : null;
        }
        queue.push(next);
      }
    }
    return null;
  }

  /**
   * Route a request to the live mind when there is one and the daily budget
   * allows, otherwise to the scripted mind. A live failure of any kind falls
   * back to scripted for that one choice and is recorded, never hidden.
   */
  private async withMind<T>(n: NpcRuntime, fn: (m: Mind) => Promise<T>, onFail: T | null): Promise<T | null> {
    const overBudget = this.calls.today >= this.config.dailyCallBudget;
    if (this.live && overBudget && !this.budgetWarned) {
      this.budgetWarned = true;
      this.record("budget", `Daily call budget of ${this.config.dailyCallBudget} reached; scripted minds take over until tomorrow.`);
    }
    const mind = this.live && !overBudget ? this.live : this.scripted;
    try {
      return await fn(mind);
    } catch (err) {
      if (mind === this.scripted) throw err;
      const why = err instanceof RefusalError ? `declined (${err.category ?? "uncategorised"})` : (err as Error).message;
      this.record("error", `${n.persona.name}: live mind ${why}; scripted mind answers.`, { npc: n.persona.id });
      try {
        return await fn(this.scripted);
      } catch {
        return onFail;
      }
    }
  }

  private onCall(r: CallRecord): void {
    this.calls.today += 1;
    this.calls.total += 1;
    this.emit("call", r);
  }

  private observeOthers(n: NpcRuntime, text: string, importance: number): void {
    for (const other of this.npcs.values()) {
      if (other === n || other.state.place !== n.state.place || other.state.asleep) continue;
      other.memory.add("observation", text, importance, this.clock.minute, [n.persona.id, n.state.place]);
    }
  }

  private isOpen(placeId: PlaceId): boolean {
    const p = this.placesById.get(placeId);
    if (!p?.openHours) return true;
    return within(this.clock.minuteOfDay, p.openHours[0], p.openHours[1]);
  }

  private placeName(id: PlaceId): string {
    return this.placesById.get(id)?.name ?? id;
  }

  private record(type: TownEventType, text: string, extra: { npc?: NpcId; place?: PlaceId; data?: unknown } = {}): void {
    const e: TownEvent = {
      at: Date.now(),
      minute: this.clock.minute,
      day: this.clock.day,
      time: this.clock.time,
      type,
      text,
      ...extra,
    };
    this.recentEvents.push(e);
    if (this.recentEvents.length > 500) this.recentEvents.shift();
    this.journal.append(e);
    this.emit("event", e);
  }
}

function drift(needs: Needs): void {
  needs.energy = clamp(needs.energy + DRIFT.energy);
  needs.hunger = clamp(needs.hunger + DRIFT.hunger);
  needs.social = clamp(needs.social + DRIFT.social);
  needs.purpose = clamp(needs.purpose + DRIFT.purpose);
}

/** Apply the payoff of a finished action to needs. */
function settle(state: NpcState, action: Action): void {
  switch (action.kind) {
    case "work":
      state.needs.purpose = clamp(state.needs.purpose + 0.2);
      state.needs.energy = clamp(state.needs.energy - 0.05);
      break;
    case "eat":
      state.needs.hunger = clamp(state.needs.hunger + 0.5);
      break;
    case "rest":
      state.needs.energy = clamp(state.needs.energy + 0.3);
      break;
    case "wander":
      state.needs.purpose = clamp(state.needs.purpose + 0.05);
      break;
    default:
      break;
  }
}

function fallbackIdle(reason: string): Action {
  return { kind: "idle", reason, visible: "lingering" };
}

function clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
