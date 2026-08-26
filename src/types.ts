/**
 * Shared domain types for Mythostown.
 *
 * Everything the engine knows about the town is expressed here. Personas and
 * places are authored as JSON under town/ and validated against the zod
 * schemas in src/npc/schema.ts, which mirror these shapes.
 */

export type NpcId = string;
export type PlaceId = string;

/** Big Five style sliders, 0 (low) to 1 (high). */
export interface Traits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

/** Homeostatic needs, 0 (depleted) to 1 (satisfied). */
export interface Needs {
  energy: number;
  hunger: number;
  social: number;
  purpose: number;
}

export interface Relationship {
  to: NpcId;
  /** Warmth, -1 (hostile) to 1 (devoted). */
  bond: number;
  /** Belief in the other person being honest with you, 0 to 1. */
  trust: number;
  note: string;
}

export interface RoutineBlock {
  /** "HH:MM", 24 hour clock. */
  start: string;
  end: string;
  place: PlaceId;
  activity: string;
}

export interface Voice {
  register: string;
  quirks: string[];
  sample: string;
}

export interface Persona {
  id: NpcId;
  name: string;
  age: number;
  role: string;
  home: PlaceId;
  workplace?: PlaceId;
  summary: string;
  backstory: string;
  traits: Traits;
  values: string[];
  voice: Voice;
  drives: string[];
  secrets: string[];
  relationships: Relationship[];
  routine: RoutineBlock[];
}

export type MemoryKind = "observation" | "reflection" | "plan" | "dialogue";

export interface Memory {
  id: string;
  npc: NpcId;
  kind: MemoryKind;
  text: string;
  /** 1 (trivial) to 10 (life changing). */
  importance: number;
  /** Absolute simulated minute at which the memory was formed. */
  createdAt: number;
  lastAccess: number;
  tags: string[];
}

export interface Place {
  id: PlaceId;
  name: string;
  kind: "home" | "work" | "public" | "landmark";
  description: string;
  exits: PlaceId[];
  /** ["HH:MM", "HH:MM"]; omitted means always open. */
  openHours?: [string, string];
}

export interface ClockSpec {
  minutesPerTick: number;
  startDay: number;
  startMinute: number;
}

export interface TownSpec {
  name: string;
  tagline: string;
  description: string;
  clock: ClockSpec;
  places: Place[];
  /** Ambient facts every townsperson knows. */
  commonKnowledge: string[];
}

export type ActionKind =
  | "move"
  | "work"
  | "talk"
  | "eat"
  | "rest"
  | "wander"
  | "idle";

export interface Action {
  kind: ActionKind;
  /** NPC to address, for talk. */
  target?: NpcId;
  /** Destination, for move. */
  place?: PlaceId;
  /** Opening line, for talk. */
  utterance?: string;
  /** One sentence of private motivation. Never shown to other NPCs. */
  reason: string;
  /** A short visible description of what onlookers see. */
  visible: string;
}

export interface NpcState {
  id: NpcId;
  place: PlaceId;
  needs: Needs;
  mood: string;
  dayPlan: string[];
  currentAction: Action | null;
  /** Absolute simulated minute until which the NPC is committed to currentAction. */
  busyUntil: number;
  asleep: boolean;
  /** Sum of importance since the last reflection. */
  reflectionPressure: number;
}

export type TownEventType =
  | "tick"
  | "day"
  | "move"
  | "action"
  | "say"
  | "dialogue"
  | "memory"
  | "reflection"
  | "plan"
  | "sleep"
  | "wake"
  | "budget"
  | "error";

export interface TownEvent {
  /** Wall clock, ms since epoch. */
  at: number;
  /** Simulated minute. */
  minute: number;
  day: number;
  time: string;
  type: TownEventType;
  npc?: NpcId;
  place?: PlaceId;
  text: string;
  data?: unknown;
}

export interface Snapshot {
  town: string;
  day: number;
  time: string;
  minute: number;
  tick: number;
  npcs: Array<NpcState & { name: string; role: string }>;
  places: Place[];
  offline: boolean;
  calls: { today: number; budget: number; total: number };
}
