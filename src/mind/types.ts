import type { Memory, NpcState, Persona, Place } from "../types.js";
import type { ActionOut, DayPlanOut, LineOut, ReflectionOut } from "../npc/schema.js";

/** Everything a mind sees when it is asked to do something on a tick. */
export interface Situation {
  persona: Persona;
  state: NpcState;
  place: Place;
  /** Names of the other people present, keyed by id. */
  present: Array<{ id: string; name: string; visible: string }>;
  /** Exits from the current place, by id and name. */
  exits: Array<{ id: string; name: string; open: boolean }>;
  day: number;
  time: string;
  phase: string;
  routineNow: string;
  /** Where the routine wants this person, and the next open exit towards it. Null when already there or unreachable. */
  routeHint: { place: string; placeName: string; via: string; viaName: string } | null;
  memories: Memory[];
}

export interface DialogueTurn {
  speaker: string;
  line: string;
}

export interface DialogueSituation extends Situation {
  partner: { id: string; name: string };
  transcript: DialogueTurn[];
  /** Turns remaining before the engine ends the conversation. */
  turnsLeft: number;
}

/**
 * A mind is the thing that answers for a townsperson. The engine owns the
 * loop; a mind owns the choices. Two implementations ship: MythosMind calls
 * Claude Mythos, ScriptedMind follows the persona's routine deterministically
 * so the town runs with no key and in tests.
 */
export interface Mind {
  readonly name: string;
  decide(s: Situation): Promise<ActionOut>;
  planDay(s: Situation): Promise<DayPlanOut>;
  reflect(s: Situation): Promise<ReflectionOut>;
  speak(s: DialogueSituation): Promise<LineOut>;
  rateImportance(persona: Persona, text: string): Promise<number>;
}
