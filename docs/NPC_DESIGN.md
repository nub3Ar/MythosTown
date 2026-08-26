# How a townsperson works

A townsperson is a persona file, a state record, a memory stream, and a mind. This document covers each, and the authoring rules that keep them believable.

## Persona

Authored in `town/npcs/<id>.json`, validated by `PersonaSchema` in `src/npc/schema.ts`.

| Field | What it does in play |
|---|---|
| `summary` | The one-line identity. Goes first in the prompt after the name. |
| `backstory` | Two to five sentences of history, voice, and contradiction. The most important field. |
| `traits` | Big Five sliders, 0 to 1. Rendered as percentages with a plain-language gloss. The scripted mind also uses extraversion to decide how often to start conversations. |
| `values` | What they will not trade. Short noun phrases. |
| `drives` | What they are trying to do this week. Three is right. These are the engine of plot. |
| `secrets` | Things they protect. The prompt tells them they may hint, deflect, or lie depending on trust. |
| `voice` | Register, quirks, and a sample line. This is what makes two people with similar traits sound different. |
| `relationships` | Per-person bond (-1 to 1), trust (0 to 1), and a note. Reflection can move bond and trust and rewrite the note. |
| `routine` | Time blocks with a place and an activity. The scripted mind follows it exactly. The live mind is told to follow it unless it has a reason not to. A block whose activity contains the word "sleep" puts them to bed; it must be at their `home`. |

### Writing a good one

- Give every person one thing they want, one thing they hide, and one person they are wrong about.
- Make secrets collide. Theo hides that the lamp failures are his; Ines has seen his tremor; Juno knows it is not the wiring; Bram thinks it is an omen. Four people, one fact, four distances from it.
- Routines should cross. If two people are never in the same place at the same hour, they will never talk. The Lantern at 19:00 and the square at 13:00 are the town's crossing points on purpose.
- Keep the voice sample short and specific. The model imitates it more than anything else in the file.
- Do not write what they think of themselves in the summary. Write what the town would say.

## State

`NpcState` in `src/types.ts`. Place, needs, mood, day plan, current action, busy-until, asleep, and reflection pressure. State is never written by a mind directly; it changes only through engine rules.

### Needs

Four values from 0 to 1. Each tick awake they drift down. Actions pay them back when they settle:

| Need | Drift per tick | Restored by |
|---|---|---|
| energy | -0.008 | rest (+0.3), sleep (+0.02 per tick) |
| hunger | -0.012 | eat (+0.5) |
| social | -0.007 | any dialogue (+0.25 each side) |
| purpose | -0.005 | work (+0.2), wander (+0.05) |

Needs appear in the prompt as words, not numbers ("starving", "peckish", "fed"), so the model reasons about them the way a person would.

## Memory

`MemoryStream` in `src/npc/memory.ts`. Append-only. Four kinds:

- **observation**: things that happened to or around them. Written by the engine, importance 1 to 2 for routine events, higher for announcements.
- **dialogue**: a full conversation transcript, importance as judged by the speakers.
- **plan**: the day plan, importance 3.
- **reflection**: a synthesised insight, importance 6.

### Retrieval

When a situation is built, the stream is queried with the place name, the routine activity, the names of the people present, and (for dialogue) the partner's name and the transcript so far. Each memory scores:

```
score = recency + importance + relevance

recency    = 0.5 ^ (hours since last access / 24)
importance = importance / 10
relevance  = |query tokens ∩ memory tokens| / min(|query|, |memory|)
```

Tokens are lower-cased, stop-worded, and lightly stemmed. The top eight are returned in chronological order and their `lastAccess` is bumped, so a memory that keeps being recalled stays recallable.

The weights are equal by default and exposed as `RetrievalWeights` for experiments.

### Reflection

Every tick, for each awake townsperson, the engine sums the importance of non-reflection memories since their last reflection. At 30 or more, the mind is asked to reflect over the twenty most recent memories and returns one to five insights plus relationship updates. Insights are stored as reflection memories. Relationship deltas are clamped and applied to the live persona, and the relationship note is rewritten. The next compiled situation will show the new bond and trust.

This is how a town changes. Nothing in the persona files moves; everything in the running town does.

## Mind

See `docs/ARCHITECTURE.md` and `docs/MODEL_CONTRACT.md`. The persona is compiled once into a stable system prompt by `compilePersonaPrompt` in `src/npc/persona.ts`. The compiled prompt for any townsperson is visible with:

```
npm run town -- inspect theo --prompt
```

or at `GET /api/npcs/theo/prompt` on a running observer.
