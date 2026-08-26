import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";
import type { Effort } from "../config.js";
import type { Persona } from "../types.js";
import {
  ActionSchema,
  DayPlanSchema,
  ImportanceSchema,
  LineSchema,
  ReflectionSchema,
  type ActionOut,
  type DayPlanOut,
  type LineOut,
  type ReflectionOut,
} from "../npc/schema.js";
import { decidePrompt, importancePrompt, planPrompt, reflectPrompt, speakPrompt } from "./prompts.js";
import type { DialogueSituation, Mind, Situation } from "./types.js";

export interface CallRecord {
  npc: string;
  task: "decide" | "plan" | "reflect" | "speak" | "importance";
  model: string;
  effort: Effort;
  inputTokens: number;
  outputTokens: number;
  cacheRead: number;
  cacheWrite: number;
  ms: number;
}

export class RefusalError extends Error {
  constructor(
    readonly category: string | null,
    readonly explanation: string | null,
  ) {
    super(`Mythos declined (${category ?? "uncategorised"}): ${explanation ?? "no explanation"}`);
    this.name = "RefusalError";
  }
}

export interface MythosMindOptions {
  client?: Anthropic;
  model: string;
  effort: Effort;
  deepEffort: Effort;
  /** Returns the stable, cacheable system prompt for a persona. */
  systemPromptFor: (persona: Persona) => string;
  onCall?: (record: CallRecord) => void;
}

/**
 * The live mind. Every townsperson is one of these, and every one of them
 * talks to the same model: Claude Mythos.
 *
 * Call shape, and why:
 * - The persona prompt is the system block, marked cacheable with a one hour
 *   TTL. It is byte stable per persona, so after the first call of the hour
 *   each tick pays the cache-read rate for it.
 * - Scene, needs, retrieved memories and the question go in the user turn.
 * - Output is a structured object validated against a zod schema. Forced
 *   tool choice is not available on this model family, so structured output
 *   is the contract, not a tool call.
 * - Thinking is always on for this model family. Depth is steered with
 *   output_config.effort: low for routine ticks, the configured deep effort
 *   for daily plans and reflections.
 * - Server-side fallbacks are on. If the safety layer declines a request, the
 *   API re-runs it on a fallback model inside the same call; a refusal on the
 *   final response means the whole chain declined and we raise RefusalError,
 *   which the engine catches and hands to the scripted mind for that choice.
 */
export class MythosMind implements Mind {
  readonly name: string;
  private readonly client: Anthropic;
  private readonly opts: MythosMindOptions;

  constructor(opts: MythosMindOptions) {
    this.opts = opts;
    this.client = opts.client ?? new Anthropic();
    this.name = opts.model;
  }

  async decide(s: Situation): Promise<ActionOut> {
    return this.ask(s.persona, "decide", ActionSchema, decidePrompt(s), this.opts.effort, 1200);
  }

  async planDay(s: Situation): Promise<DayPlanOut> {
    return this.ask(s.persona, "plan", DayPlanSchema, planPrompt(s), this.opts.deepEffort, 2000);
  }

  async reflect(s: Situation): Promise<ReflectionOut> {
    return this.ask(s.persona, "reflect", ReflectionSchema, reflectPrompt(s), this.opts.deepEffort, 2000);
  }

  async speak(s: DialogueSituation): Promise<LineOut> {
    return this.ask(s.persona, "speak", LineSchema, speakPrompt(s), this.opts.effort, 800);
  }

  async rateImportance(persona: Persona, text: string): Promise<number> {
    const out = await this.ask(persona, "importance", ImportanceSchema, importancePrompt(text), "low", 200);
    return out.importance;
  }

  private async ask<S extends z.ZodType>(
    persona: Persona,
    task: CallRecord["task"],
    schema: S,
    user: string,
    effort: Effort,
    maxTokens: number,
  ): Promise<z.infer<S>> {
    const started = Date.now();
    const response = await this.client.beta.messages.parse({
      model: this.opts.model,
      max_tokens: maxTokens,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [
        {
          type: "text",
          text: this.opts.systemPromptFor(persona),
          cache_control: { type: "ephemeral", ttl: "1h" },
        },
      ],
      messages: [{ role: "user", content: user }],
      output_config: {
        effort,
        format: zodOutputFormat(schema),
      },
    });

    this.opts.onCall?.({
      npc: persona.id,
      task,
      model: response.model,
      effort,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheRead: response.usage.cache_read_input_tokens ?? 0,
      cacheWrite: response.usage.cache_creation_input_tokens ?? 0,
      ms: Date.now() - started,
    });

    if (response.stop_reason === "refusal") {
      const d = response.stop_details;
      throw new RefusalError(d?.category ?? null, d?.explanation ?? null);
    }
    if (response.stop_reason === "max_tokens") {
      throw new Error(`Mythos ran out of room answering ${task} for ${persona.id}`);
    }
    const parsed = response.parsed_output;
    if (parsed === null || parsed === undefined) {
      throw new Error(`Mythos returned no parseable ${task} for ${persona.id}`);
    }
    return schema.parse(parsed);
  }
}
