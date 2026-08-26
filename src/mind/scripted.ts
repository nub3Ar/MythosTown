import type { Persona } from "../types.js";
import type { ActionOut, DayPlanOut, LineOut, ReflectionOut } from "../npc/schema.js";
import type { DialogueSituation, Mind, Situation } from "./types.js";
import { within } from "../engine/clock.js";

/**
 * A deterministic mind. It follows the persona's routine, eats when hungry,
 * rests when tired, and makes small talk from a fixed set of lines. It is what
 * runs when there is no API key, when the daily call budget is spent, and in
 * tests. Nothing it does is clever. Everything it does is reproducible.
 */
export class ScriptedMind implements Mind {
  readonly name = "scripted";
  private seed: number;

  constructor(seed = 7) {
    this.seed = seed;
  }

  private rand(): number {
    // xorshift32, deterministic per instance.
    let x = this.seed;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.seed = x >>> 0;
    return (this.seed % 10_000) / 10_000;
  }

  private pick<T>(xs: readonly T[]): T {
    return xs[Math.floor(this.rand() * xs.length)] as T;
  }

  async decide(s: Situation): Promise<ActionOut> {
    const base = {
      target: null,
      place: null,
      utterance: null,
      mood: s.state.mood || "even",
    };
    const minuteOfDay = toMinuteOfDay(s.time);
    const block = s.persona.routine.find((b) => within(minuteOfDay, b.start, b.end));

    if (s.state.needs.hunger < 0.25) {
      return { ...base, kind: "eat", reason: "Hungry.", visible: "eating something quickly" };
    }
    if (s.state.needs.energy < 0.15) {
      return { ...base, kind: "rest", reason: "Worn out.", visible: "sitting down to rest" };
    }
    if (block && block.place !== s.state.place && s.routeHint) {
      const arriving = s.routeHint.via === s.routeHint.place;
      return {
        ...base,
        kind: "move",
        place: s.routeHint.via,
        reason: `Routine: ${block.activity}.`,
        visible: arriving ? `heading to ${s.routeHint.viaName}` : `walking towards ${s.routeHint.placeName}`,
      };
    }

    const sociable = s.persona.traits.extraversion;
    if (s.present.length > 0 && this.rand() < 0.1 + sociable * 0.25) {
      const who = this.pick(s.present);
      return {
        ...base,
        kind: "talk",
        target: who.id,
        utterance: this.pick(OPENERS).replace("{name}", who.name.split(" ")[0] ?? who.name),
        reason: "Someone to talk to.",
        visible: `turning to ${who.name}`,
      };
    }

    const activity = block?.activity ?? "passing the time";
    const visible = /^[a-z]+ing\b/i.test(activity) ? activity : `busy with ${activity}`;
    if (/sleep/i.test(activity)) {
      return { ...base, kind: "rest", reason: "Bedtime.", visible: "settling in for the night" };
    }
    if (/eat|breakfast|lunch|dinner|supper/i.test(activity)) {
      return { ...base, kind: "eat", reason: activity, visible };
    }
    if (block && block.place === s.persona.workplace) {
      return { ...base, kind: "work", reason: activity, visible };
    }
    return { ...base, kind: this.rand() < 0.2 ? "wander" : "idle", reason: activity, visible };
  }

  async planDay(s: Situation): Promise<DayPlanOut> {
    const plan = s.persona.routine.map((b) => `${b.start} ${b.activity}`);
    return { mood: this.pick(MOODS), plan: plan.slice(0, 10) };
  }

  async reflect(s: Situation): Promise<ReflectionOut> {
    const names = new Set(s.memories.flatMap((m) => m.tags));
    const someone = [...names].find((t) => t !== s.persona.id);
    return {
      insights: [`Another ${s.phase} in town. ${s.persona.drives[0] ?? "Life goes on."}`],
      relationshipUpdates: someone
        ? [{ npc: someone, bondDelta: 0.02, trustDelta: 0, note: "We crossed paths again." }]
        : [],
    };
  }

  async speak(s: DialogueSituation): Promise<LineOut> {
    const wrapUp = s.turnsLeft <= 1 || this.rand() < 0.3;
    const line = wrapUp ? this.pick(CLOSERS) : this.pick(REPLIES);
    return { line, wrapUp, importance: 2 };
  }

  async rateImportance(_persona: Persona, text: string): Promise<number> {
    if (/argu|secret|fire|storm|love|dead|died|stole|lied|debt|leave|leaving/i.test(text)) return 7;
    if (/talk|said|asked|told/i.test(text)) return 4;
    return 2;
  }
}

function toMinuteOfDay(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

const OPENERS = [
  "Morning, {name}. Quiet one today.",
  "{name}. Did you hear the wind last night?",
  "Hello {name}. You look like you have news.",
  "{name}, got a minute?",
  "Didn't expect to see you here, {name}.",
];

const REPLIES = [
  "Could be. I have not decided what to make of it yet.",
  "Same as ever. Though the harbour has been strange this week.",
  "You know how it is. Work, sleep, weather.",
  "I heard something about that. I'd not repeat it though.",
  "Let me think on that. Ask me again tomorrow.",
];

const CLOSERS = [
  "Anyway. I should get on.",
  "Right. See you about.",
  "Good talking. Mind how you go.",
  "I'll leave you to it.",
];

const MOODS = ["even", "hopeful", "tired", "restless", "content", "wary"];
