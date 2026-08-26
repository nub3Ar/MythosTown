# The model contract

Every townsperson runs on Claude Mythos. This document is the exact shape of every call, and the reasons for each choice. The implementation is `src/mind/mythos.ts`.

## The call

```ts
const response = await client.beta.messages.parse({
  model: "claude-mythos-5-1",
  max_tokens: 1200,
  betas: ["server-side-fallback-2026-07-01"],
  fallbacks: "default",
  system: [
    {
      type: "text",
      text: compiledPersonaPrompt,          // byte-stable per townsperson
      cache_control: { type: "ephemeral", ttl: "1h" },
    },
  ],
  messages: [{ role: "user", content: scenePrompt }],   // everything that changes
  output_config: {
    effort: "low",                        // "high" for plans and reflections
    format: zodOutputFormat(ActionSchema),
  },
});
```

Then: check `stop_reason`, read `parsed_output`, re-validate with the zod schema, return.

## Why each part

**Model.** `claude-mythos-5-1` is the default and is gated to Project Glasswing organisations. `claude-fable-5-1` is the same underlying model, generally available, and is a one-line change in `.env`. Any current Claude model will run the town; the prompts assume a model that can hold a long persona and a short scene in its head at once and answer in one shot.

**Thinking.** On this model family thinking is always on and is not configured. Depth is set with `output_config.effort`. Routine ticks run at `low`: the question is small and the persona does most of the work. Day plans and reflections run at the configured deep effort, `high` by default, because those are the calls that shape the next hundred.

**System prompt, cached.** The persona prompt is compiled once at startup and never varies. It is marked cacheable with a one hour TTL. After the first call of the hour for a given townsperson, every later call reads the persona from cache. Every tick-to-tick variable (clock, place, who is present, needs, retrieved memories, the question) is in the user turn, after the cache breakpoint. If you add anything to the system prompt that changes between calls you will silently lose caching; check `cache_read_input_tokens` with `--calls`.

**Structured output, not tools.** Forced tool choice is not available on this model family, so the contract is `output_config.format` with a zod schema. The SDK parses the response into `parsed_output`; the mind re-validates it (cheap, and it catches a truncated answer). The engine never has to parse prose.

**Fallbacks.** `fallbacks: "default"` with the matching beta header turns on server-side refusal fallbacks. If the safety layer declines a request, the API re-runs it on a fallback model inside the same call and returns a normal response with a `fallback` content block. If the whole chain declines, the final `stop_reason` is `refusal` and the mind raises `RefusalError`. The engine catches that, records it, and asks the scripted mind for that one choice. A townsperson is never left standing because a classifier disagreed with a sentence about a harbour wall.

**No prefill, no sampling parameters.** Neither is supported on this family. Persona consistency comes from the system prompt and from memory, not from temperature.

**max_tokens.** 1200 for decisions, 2000 for plans and reflections, 800 for a line of dialogue, 200 for an importance rating. A `max_tokens` stop is treated as an error and falls back, rather than being parsed as a partial answer.

## Budget

`MYTHOSTOWN_DAILY_CALL_BUDGET` (default 600) caps live calls per simulated day. When reached, the engine records one `budget` event and routes every remaining call that day to the scripted mind. The counter resets at midnight. `Town.calls` and the snapshot's `calls` field expose today's count and the lifetime total.

With twelve townsfolk at ten minutes per tick, a day is 144 ticks. The number of live calls depends on how much the townsfolk talk: each decision is one call, each line of dialogue one call, each reflection one, each plan one. Expect several hundred to around a thousand per simulated day at the default settings. The `--calls` flag on `run` and `serve` prints every call with its token counts.

## Errors

| Condition | What happens |
|---|---|
| `stop_reason: "refusal"` after fallbacks | `RefusalError`, recorded as an `error` event with the category, scripted mind answers |
| `stop_reason: "max_tokens"` | error, scripted mind answers |
| No parseable output | error, scripted mind answers |
| SDK error (auth, rate limit, network) | surfaces as an `error` event with the SDK message, scripted mind answers |
| Scripted mind also fails | the choice is skipped for that tick; the townsperson idles |

Nothing retries inside the mind. The SDK's own retry policy (two retries on 429 and 5xx) applies.

## Changing the model

Set `MYTHOSTOWN_MODEL`. If you move to a model outside the Fable and Mythos families, read the Anthropic docs for that model's thinking and effort rules; `output_config.effort` and `fallbacks` may need adjusting. The structured-output and caching parts of the contract are the same everywhere.
