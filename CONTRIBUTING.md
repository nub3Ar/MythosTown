# Contributing

Thank you for wanting to make the town stranger.

## Setup

```
npm install
npm run typecheck
npm test
npm run validate
npm run dev          # offline town, one tick every 250ms
```

Node 20 or later. No key is needed for anything above.

## Where things go

| Change | Where |
|---|---|
| A new townsperson or place | `town/` (see `docs/AUTHORING.md`) |
| Prompt wording | `src/mind/prompts.ts` (volatile) or `src/npc/persona.ts` (stable persona) |
| What a mind can answer | `src/npc/schema.ts`, then both minds |
| World rules, durations, drift, thresholds | `src/engine/town.ts` |
| Retrieval scoring | `src/npc/memory.ts` |
| Observer routes or the viewer | `src/server/` |

## Rules of the road

- **Every live path has a scripted twin.** If you add a method to `Mind`, implement it in `ScriptedMind` too, deterministically. The offline day in `test/town.test.ts` must still pass with no errors.
- **Keep the system prompt stable.** Nothing that varies between ticks goes in `compilePersonaPrompt`. If you are not sure, put it in the user turn.
- **Record everything.** If the engine does something, it emits a `TownEvent`. No silent state changes.
- **No new dependencies without a reason in the pull request.** The runtime dependency list is short on purpose.
- **Prose style.** Documentation and prompts use plain sentences. No emojis, no exclamation marks, no decorative symbols.

## Pull requests

- Run `npm run typecheck && npm test && npm run validate` before opening.
- One change per pull request. A new townsperson and a retrieval change are two pull requests.
- If you changed a prompt, include a short before-and-after from a live run in the description so reviewers can see the effect.
- Keep the journal format backward compatible. Add fields; do not rename them.

## Reporting a problem

Open an issue with the journal lines around the problem (`var/journal.jsonl`) and the command you ran. If a live mind misbehaved, include the `--calls` output for that tick.
