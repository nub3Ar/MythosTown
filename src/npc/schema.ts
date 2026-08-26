import { z } from "zod";

const unit = z.number().min(0).max(1);
const hhmm = z.string().regex(/^\d{1,2}:\d{2}$/, "expected HH:MM");
const slug = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "lowercase slug");

export const TraitsSchema = z.object({
  openness: unit,
  conscientiousness: unit,
  extraversion: unit,
  agreeableness: unit,
  neuroticism: unit,
});

export const RelationshipSchema = z.object({
  to: slug,
  bond: z.number().min(-1).max(1),
  trust: unit,
  note: z.string().min(1),
});

export const RoutineBlockSchema = z.object({
  start: hhmm,
  end: hhmm,
  place: slug,
  activity: z.string().min(1),
});

export const PersonaSchema = z.object({
  id: slug,
  name: z.string().min(1),
  age: z.number().int().min(1).max(120),
  role: z.string().min(1),
  home: slug,
  workplace: slug.optional(),
  summary: z.string().min(10),
  backstory: z.string().min(40),
  traits: TraitsSchema,
  values: z.array(z.string().min(1)).min(1).max(8),
  voice: z.object({
    register: z.string().min(1),
    quirks: z.array(z.string().min(1)).max(6),
    sample: z.string().min(1),
  }),
  drives: z.array(z.string().min(1)).min(1).max(6),
  secrets: z.array(z.string()).max(4),
  relationships: z.array(RelationshipSchema),
  routine: z.array(RoutineBlockSchema).min(1),
});

export const PlaceSchema = z.object({
  id: slug,
  name: z.string().min(1),
  kind: z.enum(["home", "work", "public", "landmark"]),
  description: z.string().min(10),
  exits: z.array(slug),
  openHours: z.tuple([hhmm, hhmm]).optional(),
});

export const TownSpecSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(10),
  clock: z.object({
    minutesPerTick: z.number().int().positive(),
    startDay: z.number().int().min(0),
    startMinute: z.number().int().min(0).max(1439),
  }),
  places: z.array(PlaceSchema).min(1),
  commonKnowledge: z.array(z.string()),
});

/** What a mind must return when asked to act. Used as the structured output format. */
export const ActionSchema = z.object({
  kind: z.enum(["move", "work", "talk", "eat", "rest", "wander", "idle"]),
  target: z.string().nullable(),
  place: z.string().nullable(),
  utterance: z.string().nullable(),
  reason: z.string(),
  visible: z.string(),
  mood: z.string(),
});

export const DayPlanSchema = z.object({
  mood: z.string(),
  plan: z.array(z.string()).min(3).max(10),
});

export const ReflectionSchema = z.object({
  insights: z.array(z.string()).min(1).max(5),
  relationshipUpdates: z.array(
    z.object({
      npc: z.string(),
      bondDelta: z.number().min(-0.5).max(0.5),
      trustDelta: z.number().min(-0.5).max(0.5),
      note: z.string(),
    }),
  ),
});

export const LineSchema = z.object({
  line: z.string(),
  /** True when the speaker wants to end the conversation after this line. */
  wrapUp: z.boolean(),
  importance: z.number().int().min(1).max(10),
});

export const ImportanceSchema = z.object({
  importance: z.number().int().min(1).max(10),
});

export type ActionOut = z.infer<typeof ActionSchema>;
export type DayPlanOut = z.infer<typeof DayPlanSchema>;
export type ReflectionOut = z.infer<typeof ReflectionSchema>;
export type LineOut = z.infer<typeof LineSchema>;
