# Architecture

Mythostown is a discrete-time simulation with a language model in the inner loop. This document describes the moving parts, the order they move in, and the reasons behind the shape.

## The three layers

```
 town/                     authored data: places, townsfolk, common knowledge
   |
   v
 src/engine/Town           the loop: clock, state, needs, routing, dialogue, reflection, journal
   |            \
   v             v
 src/mind/Mythos  src/mind/Scripted      the choices: live model, or deterministic routine
```

The engine never generates text and the minds never mutate state. A mind is asked a question about a situation and returns a typed answer. The engine decides whether the answer is legal, applies it, records it, and tells everyone who could see it.

## One tick

A tick is ten simulated minutes by default (`town.json`, `clock.minutesPerTick`). On every tick, in order:

1. **Clock advances.** If midnight was crossed, the daily call counter resets and a `day` event is recorded. On the hour a `tick` event is recorded.
2. **Each townsperson is stepped**, in file order:
   - Asleep: energy recovers. If the routine no longer says sleep, they wake, a `wake` event is recorded, and the mind is asked for a day plan.
   - Awake and the routine says sleep and they are home: they go to sleep.
   - Awake: needs drift downward. If they are mid-dialogue or committed to an action (`busyUntil` is in the future), nothing else happens.
   - Otherwise the previous action settles (its payoff is applied to needs), a `Situation` is built, and the mind is asked to `decide`.
   - The decision is validated against the world (is the exit real and open, is the target present and awake) and applied. Illegal decisions degrade to `idle` with the reason recorded.
3. **Reflection check.** For each awake townsperson, the importance of memories since their last reflection is summed. Past the threshold, the mind is asked to `reflect`; insights become reflection memories and relationship deltas are applied.
4. **Snapshot** is written to `var/snapshot.json`.

Everything that happened is already in `var/journal.jsonl` by the time the tick returns, because `record()` appends synchronously.

## Situation

`src/mind/types.ts` defines `Situation`, the whole of what a mind is allowed to know at the moment of a choice:

| Field | Source |
|---|---|
| `persona` | the authored persona, with relationships mutated by reflections |
| `state` | place, needs, mood, day plan, current action |
| `place`, `present`, `exits` | the world as seen from where they stand, with open/closed exits |
| `day`, `time`, `phase` | the clock |
| `routineNow`, `routeHint` | the routine block for this time and the next open step towards it |
| `memories` | the top eight memories retrieved for this scene |

Nothing else reaches the model. In particular a townsperson does not see other people's reasons, needs, secrets, or memories. They see what others are visibly doing, and what others say to them.

## Minds

`Mind` (`src/mind/types.ts`) has five methods: `decide`, `planDay`, `reflect`, `speak`, `rateImportance`. Both implementations return the same zod-validated shapes from `src/npc/schema.ts`.

- **MythosMind** calls Claude Mythos through the Anthropic SDK with structured output. See `docs/MODEL_CONTRACT.md`.
- **ScriptedMind** follows the routine, eats when hungry, rests when tired, and makes small talk from a fixed list, seeded and deterministic. It runs when there is no key, when `--offline` is passed, when the daily budget is spent, and whenever a live call fails.

The engine routes each call through `Town.withMind()`, which picks the mind, counts live calls, and falls back on error. The fallback is recorded as an `error` event, so a day that quietly degraded to scripted minds is visible in the journal.

## Dialogue

A `talk` action starts a bounded exchange. The initiator's opening line is taken from the decision. Then the two take turns, each asked to `speak` with the transcript so far, until one sets `wrapUp` or six lines are reached. Each speaker is prompted with their own persona and their own retrieved memories, so the two sides of a conversation are genuinely two minds.

When it ends, each participant stores the full transcript as a `dialogue` memory with the highest importance either side assigned. Bystanders at the same place store a one-line observation that the two were talking. Both participants gain social satisfaction and are busy for twenty minutes.

## Memory

See `docs/NPC_DESIGN.md`. The short version: an append-only stream per person, scored at retrieval by recency, importance and lexical relevance, with reflection synthesising insights once enough importance has accumulated.

## Observer

`src/server/http.ts` exposes a snapshot, a server-sent event stream, per-person detail and prompt, and an `announce` endpoint. The viewer at `/` is a single HTML string with no build step. See the README for the route table.

## Why these shapes

- **Structured output, not free text.** Every answer from a mind is a typed object. The engine can validate it, reject it, log it, and replay it. Free text would need a parser, and a parser would need forgiveness, and forgiveness hides bugs.
- **Stable system prompt.** The persona prompt is compiled once and never varies. Everything that varies goes in the user turn. That is what makes prompt caching work and what keeps a persona consistent across thousands of calls.
- **No embeddings.** Retrieval is lexical. It is worse than a vector store and better than a vector store for this project, because it runs offline, costs nothing, and can be debugged by reading the memory text.
- **Scripted twin for every live path.** Every call the live mind can make, the scripted mind can also make. The town cannot be stopped by an outage, a refusal, or an empty wallet. It just gets duller.
- **Append-only journal.** The journal is the product. The viewer and the API are two ways of reading it.
