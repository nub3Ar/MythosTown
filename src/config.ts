import "dotenv/config";
import { z } from "zod";

const EffortSchema = z.enum(["low", "medium", "high", "xhigh", "max"]);

const EnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().optional(),
  MYTHOSTOWN_MODEL: z.string().default("claude-mythos-5-1"),
  MYTHOSTOWN_EFFORT: EffortSchema.default("low"),
  MYTHOSTOWN_DEEP_EFFORT: EffortSchema.default("high"),
  MYTHOSTOWN_OFFLINE: z
    .string()
    .default("false")
    .transform((v) => v === "1" || v.toLowerCase() === "true"),
  MYTHOSTOWN_DAILY_CALL_BUDGET: z.coerce.number().int().positive().default(600),
  MYTHOSTOWN_PORT: z.coerce.number().int().positive().default(4321),
  MYTHOSTOWN_VAR_DIR: z.string().default("var"),
});

export type Effort = z.infer<typeof EffortSchema>;

export interface Config {
  apiKey: string | undefined;
  model: string;
  effort: Effort;
  deepEffort: Effort;
  offline: boolean;
  dailyCallBudget: number;
  port: number;
  varDir: string;
}

export function loadConfig(overrides: Partial<Config> = {}): Config {
  const env = EnvSchema.parse(process.env);
  const base: Config = {
    apiKey: env.ANTHROPIC_API_KEY,
    model: env.MYTHOSTOWN_MODEL,
    effort: env.MYTHOSTOWN_EFFORT,
    deepEffort: env.MYTHOSTOWN_DEEP_EFFORT,
    offline: env.MYTHOSTOWN_OFFLINE || !env.ANTHROPIC_API_KEY,
    dailyCallBudget: env.MYTHOSTOWN_DAILY_CALL_BUDGET,
    port: env.MYTHOSTOWN_PORT,
    varDir: env.MYTHOSTOWN_VAR_DIR,
  };
  return { ...base, ...overrides };
}
