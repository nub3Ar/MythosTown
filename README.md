<p align="center">
  <img src="https://cdn.prod.website-files.com/69082c5061a39922df8ed3b6/6ae2952f3635feecd5169a76_Mythos%20Town%20Pixel%20Adventure.png" alt="Mythostown" width="100%">
</p>

<h1 align="center">Mythostown</h1>

<p align="center">
  <b>A town where every townsperson is a mind.</b><br>
  <i>Twelve people, twenty-one places, one model behind all of them: Claude Mythos.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/model-claude--mythos--5--1-0b0d12?style=flat-square&labelColor=0b0d12&color=1f2937" alt="model">
  <img src="https://img.shields.io/badge/minds-12-22c55e?style=flat-square&labelColor=0b0d12" alt="twelve minds">
  <img src="https://img.shields.io/badge/offline-scripted_twin-f2f4f0?style=flat-square&labelColor=0b0d12" alt="offline twin">
  <img src="https://img.shields.io/badge/journal-append--only-f2f4f0?style=flat-square&labelColor=0b0d12" alt="append-only journal">
  <img src="https://img.shields.io/badge/typescript-strict-3178c6?style=flat-square&labelColor=0b0d12" alt="typescript strict">
  <img src="https://img.shields.io/badge/license-MIT-f2f4f0?style=flat-square&labelColor=0b0d12" alt="MIT">
</p>

<p align="center">
  <a href="#what-this-is">What this is</a> ·
  <a href="#economics">Economics</a> ·
  <a href="#the-townsfolk">The townsfolk</a> ·
  <a href="#a-morning-in-mythostown">A morning</a> ·
  <a href="#the-machine">The machine</a> ·
  <a href="#the-mind-of-a-townsperson">The mind</a> ·
  <a href="#running-it">Running it</a> ·
  <a href="#the-model-contract">Model contract</a> ·
  <a href="#watching-and-steering">Watching</a> ·
  <a href="#authoring">Authoring</a> ·
  <a href="#cost">Cost</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

---

## What this is

Mythostown is a small harbour town at the end of the ferry line. There is an inn, a bakery, a forge, a clinic, a hall of records, a lighthouse whose lamp has started to fail, a harbour wall that is cracking, and a mayor who would like to remain one. Twelve people live there. Each of them is a separate instance of Claude Mythos with a persona, a memory, a routine, needs, relationships, and at least one secret.

Nothing is scripted except the clock. The townsfolk wake, plan their day, walk to work, eat, gossip, avoid each other, reflect on what happened, and change their minds about one another. Everything they do is recorded in a journal you can read, stream, or watch in a browser. You can drop a fact into the town, a storm forecast or a letter or a stranger at the gate, and watch twelve minds decide what it means.

It is a simulation engine, a persona format, a model contract, and a town. The engine is about two thousand lines of strict TypeScript. The town is twelve JSON files you can rewrite.

Three things it is built around:

- **Every townsperson is a real mind.** Each one gets their own compiled system prompt, their own memory stream, their own retrieved context, and their own call to the model. When two of them talk, both sides are thinking.
- **The engine owns the world, the minds own the choices.** A mind is asked a question about a situation and answers with a typed object. The engine validates it against the world, applies it, and tells everyone who could see it. Nothing a model says becomes true until the engine agrees.
- **It runs without a key.** Every live path has a deterministic scripted twin. No key, no network, no money: the town still runs, just duller. The same twin takes over when the daily call budget is spent or a call fails, and says so in the journal.

## Economics

The townsfolk already owe each other things. Mara carries Bram's bar tab. The council owes Juno for a pump job. Sable buys Bram's catch cheap and sells it dear. Cas sells bread on credit to half the square. Today those debts live in persona notes and in memory; the next step is to let the town keep real accounts and settle them.

| | |
|---|---|
| Currency | SOL on Solana. One unit of account for the whole town, no town token. |
| Wallets | One per townsperson, held by the engine. A dev wallet funds the float and takes nothing from trades. |
| What moves money | Buying food and drink, paying for work, rent on a room, the ferry fare, a loan between friends. |
| What decides it | The same mind that decides everything else. Paying is an action like `talk` or `move`, validated by the engine against the payer's balance. |
| What it changes | Balances become needs. Being broke is a reason to work, to borrow, to lie. Being owed is a reason to ask. |
| Record | Every transfer is a journal event with the on-chain signature, so a tab can be read back from the chain. |

Dev wallet: `A1g5fLKb5bJXF2LjBjypELZWk9rEjymz1AaNw7SjCf3V`

None of this is in the code yet. The fiction is ready for it: the debts are written, the grudges are written, and the engine already treats an action as something to validate before it becomes true.

## The townsfolk

| | Who | Wants | Hides |
|---|---|---|---|
| **Mara Voss**, 52 | landlady of the Lantern | to know what the stranger is for | that she has covered Bram's bar tab for two years |
| **Theo Ashgrove**, 67 | lighthouse keeper | to keep the lamp lit through winter | that the lamp failures are his; he fell asleep on watch |
| **Juno Pell**, 29 | smith and mechanic | to be paid for the harbour pump job | that she is in love with the doctor |
| **Elias Crane**, 44 | archivist | to understand a month missing from the 1931 log | a deed suggesting the mayor's villa was taken by forgery |
| **Wren Okafor**, 19 | courier | to take the Friday ferry, this time | that she has had the fare for a month |
| **Ines Halloran**, 38 | the town doctor | to get a nurse funded before she burns out | a mainland job offer that expires this month |
| **Bram Tully**, 61 | fisherman | to get the Marigold through one more winter | that he saw a light at the north wall at two in the morning |
| **Sable Marchetti**, 33 | trader | the harbour wall contract, and a cut of it | debts on the mainland to people who are not patient |
| **Odile Fenn**, 58 | mayor | a fourth term with no one standing against her | that the council has had the wall money for a year |
| **Casimir Larkin**, 24 | baker's apprentice | to keep the Hearth open on his own | that the stranger buys bread for two |
| **Nell Varga**, 71 | retired schoolteacher | to get Wren onto the ferry | that she recognises the name on the stranger's letters |
| **Arlo Quint**, 35 | a visitor | to survey the north wall without anyone noticing | that he is here for two clients, and the jobs are the same job |

The secrets are designed to collide. Four people know something about the lamp and none of them know the same thing. Three people are circling the deed to the villa from three directions. The stranger's letters pass through the hands of the one person who recognises the address. Whether any of it comes out is up to the town.

Full personas are in [town/npcs/](town/npcs/). Each is a few hundred words of backstory, voice, temperament, drives, secrets, relationships, and a daily routine.

## A morning in Mythostown

What the journal looks like. This is an illustrative transcript in the journal's format, with the kind of lines the live minds produce; your town will write its own.

```
D1 06:00   day        Day 1 begins in Mythostown.
D1 06:00   wake       Nell Varga wakes up.
D1 06:00   plan       Nell Varga plans the day: 06:00 tea at the window, and see who passes
D1 06:30   wake       Juno Pell wakes up.
D1 06:30   plan       Juno Pell plans the day: 06:30 breakfast; 07:30 Forge, finish the clinic generator
D1 07:00   tick       07:00, dawn.
D1 07:10   move       Arlo Quint goes to The Lantern.
D1 07:20   say        Mara Voss: Morning, Mr Quint. Sleep all right? Walls are thin, I always say.
D1 07:20   say        Arlo Quint: Very well, thank you. That north wall, is it the original stone?
D1 07:20   say        Mara Voss: Now why would a man on holiday want to know a thing like that?
D1 07:20   say        Arlo Quint: Habit. Thank you. I'll take the bread for two, if Cas has it.
D1 07:20   dialogue   Mara Voss and Arlo Quint talked (4 lines).
D1 09:10   move       Theo Ashgrove goes to Market Square.
D1 09:20   say        Casimir Larkin: Sorry. One white, Mr Ashgrove? Only, how is the lamp?
D1 09:20   say        Theo Ashgrove: Wind's going round to the north-west. She's fine. It's the wiring.
D1 09:20   say        Casimir Larkin: Right. Sorry. Juno said it wasn't. Sorry.
D1 09:20   dialogue   Casimir Larkin and Theo Ashgrove talked (3 lines).
D1 11:40   action     Bram Tully is sitting on the bench and reading the water.
D1 12:10   say        Bram Tully: Ada always said a lamp goes dark when it's got something to tell you.
D1 12:10   say        Theo Ashgrove: Ada said a great many things, Bram.
D1 12:10   say        Bram Tully: She did. Twice this month, Theo.
D1 12:10   say        Theo Ashgrove: That is not recorded.
D1 12:10   dialogue   Bram Tully and Theo Ashgrove talked (4 lines).
D1 13:00   reflection Theo Ashgrove reflects: Bram knows. He will not say it, and I will not, and so it stands.
```

Each `say` line is one call to the model by the speaker, with their own persona and their own memories. The `reflection` line was produced because enough had happened to Theo that morning to cross his reflection threshold; its result changed his trust in Bram and was stored as a memory he will retrieve the next time Bram is in the room.

## The machine

```
                         town/town.json  town/npcs/*.json
                                    |
                                    v  loadTown, compilePersonaPrompt
   +------------------------------------------------------------------+
   |  Town                                                             |
   |                                                                   |
   |   Clock --> for each townsperson --> build Situation              |
   |                     |                      |                      |
   |                     |                      v                      |
   |                     |              Mind.decide / speak / plan /   |
   |                     |              reflect  (typed answers)       |
   |                     |                      |                      |
   |                     v                      v                      |
   |              validate against world  <-----+                      |
   |                     |                                             |
   |                     v                                             |
   |     apply: move, work, talk, eat, rest, wander, idle              |
   |                     |                                             |
   |                     +--> memories (self + bystanders)             |
   |                     +--> needs, busyUntil, relationships          |
   |                     +--> record(TownEvent) --> journal.jsonl      |
   |                                                 |                 |
   +-------------------------------------------------|-----------------+
                                                     v
                             observer: /api/snapshot  /api/events (SSE)  viewer
```

Two minds implement the same interface:

| | MythosMind | ScriptedMind |
|---|---|---|
| Decides by | a structured call to Claude Mythos with the persona cached as the system prompt | following the routine; eating when hungry; resting when tired; small talk from a list |
| Deterministic | no | yes, seeded |
| Needs a key | yes | no |
| Used when | a key is present, the budget allows, and the call succeeds | otherwise, for that one choice, with an `error` or `budget` event recorded |

A tick is ten simulated minutes. One simulated day is 144 ticks. A day with no wall-clock delay runs in under a second offline; live, it runs as fast as the model answers.

The full walk through a tick, the `Situation` a mind is allowed to see, and the reasons for each structural choice are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## The mind of a townsperson

### Persona

A persona file becomes a system prompt once, at startup, and never changes. The prompt opens by telling the model who it is and that it is a person, not an assistant. Then: summary, backstory, temperament rendered from the Big Five sliders in plain words, values, current drives, secrets with permission to deflect or lie, voice register and quirks with a sample line, relationships with bond and trust, the daily routine, the town, common knowledge, and the rules of the world. About 1,500 tokens. You can read any of them:

```
npm run town -- inspect theo --prompt
```

### Needs

Energy, hunger, company, purpose. They drift down every tick awake and are restored by rest, food, conversation and work. They reach the model as words ("starving", "peckish", "fed"), not numbers, so the model reasons about them the way a person would. The scripted mind reads them as thresholds.

### Memory

Each townsperson has an append-only memory stream. The engine writes observations (what they did, who arrived, who was talking to whom); dialogues are stored as full transcripts; day plans and reflections are stored as what they are. When a situation is built, the stream is queried with the place, the routine, the names present, and the conversation so far. Every memory scores:

```
score = recency + importance + relevance
recency    = 0.5 ^ (hours since last recalled / 24)
importance = importance / 10
relevance  = token overlap with the query, stop-worded and stemmed
```

The top eight go to the model in chronological order, and their recall time is refreshed, so what keeps being remembered stays memorable. There are no embeddings in the loop on purpose: retrieval runs offline, costs nothing, and can be debugged by reading the text.

### Reflection

Importance accumulates. Once enough has happened to someone since they last reflected, the mind is asked to step back over the last twenty memories and return one to five insights plus small changes to how they feel about specific people. Insights become memories with high importance. Bond and trust move, the relationship note is rewritten, and the next situation the model sees carries the new numbers. This is the only way the persona changes while the town runs, and it is how a town develops a history.

### Planning

On waking, each townsperson sketches the day in a few timed lines, using their routine and whatever recent memories argue for bending it. The plan goes into every situation that day. It is a suggestion, not a script; the decision each tick is still theirs.

### Dialogue

A `talk` decision names a person present and an opening line. The two then alternate, each asked for one line with their own persona and memories and the transcript so far, until one wraps up or six lines are reached. Bystanders at the same place see that the two were talking, not what was said. Both participants remember all of it.

### Rules of the world

Told to every mind, enforced by the engine regardless:

- Time passes in ten minute steps; commit to things for a sensible length of time.
- You can only talk to people in the same place.
- You can only move to a place connected to where you are, and only if it is open.
- If you do not remember something, you do not know it.
- Your private reasons are private; your visible behaviour is what others see.

A decision that breaks a rule degrades to `idle` with the reason recorded. The model is never told it was overruled; it just finds itself still standing there next tick, which is also what happens to people.

More on authoring minds that come alive, and the exact numbers behind needs and retrieval, in [docs/NPC_DESIGN.md](docs/NPC_DESIGN.md).

## Running it

Node 20 or later.

```
git clone https://github.com/nub3Ar/MythosTown.git mythostown
cd mythostown
npm install
npm run validate        # check the town
npm test                # 14 tests, including a full offline day
npm run dev             # offline, one tick every 250ms, printed to the terminal
```

To run live, copy `.env.example` to `.env` and set a key:

```
ANTHROPIC_API_KEY=sk-ant-...
MYTHOSTOWN_MODEL=claude-mythos-5-1
```

`claude-mythos-5-1` is gated to Project Glasswing organisations. If yours is not one, set `MYTHOSTOWN_MODEL=claude-fable-5-1`, the same underlying model, generally available.

Then:

```
npm run day                      # one simulated day, printed, journal in var/
npm run serve                    # run forever with the observer at http://localhost:4321
npm run town -- run --ticks 36 --calls     # six hours, every model call printed to stderr
```

### Commands

| Command | Does |
|---|---|
| `run` | advance the town `--ticks` ticks with `--speed` ms between them; `--offline`, `--calls`, `--quiet`, `--no-journal`, `--town <dir>` |
| `serve` | run continuously and start the observer; same flags plus `--port` |
| `npcs` | list the townsfolk |
| `inspect <id>` | print a persona, or the compiled system prompt with `--prompt` |
| `announce <text>` | drop a fact into a running town; `--place <id>`, `--importance <1-10>` |

`npm run town -- <command>` runs any of them from source.

### Environment

| Variable | Default | Meaning |
|---|---|---|
| `ANTHROPIC_API_KEY` | unset | unset means offline |
| `MYTHOSTOWN_MODEL` | `claude-mythos-5-1` | the model every townsperson runs on |
| `MYTHOSTOWN_EFFORT` | `low` | reasoning depth for routine ticks and dialogue |
| `MYTHOSTOWN_DEEP_EFFORT` | `high` | reasoning depth for day plans and reflections |
| `MYTHOSTOWN_OFFLINE` | `false` | force scripted minds |
| `MYTHOSTOWN_DAILY_CALL_BUDGET` | `600` | live calls per simulated day before scripted minds take over |
| `MYTHOSTOWN_PORT` | `4321` | observer port |
| `MYTHOSTOWN_VAR_DIR` | `var` | journal and snapshot directory |

## The model contract

Every call a townsperson makes has the same shape. From [src/mind/mythos.ts](src/mind/mythos.ts):

```ts
const response = await client.beta.messages.parse({
  model: "claude-mythos-5-1",
  max_tokens: 1200,
  betas: ["server-side-fallback-2026-07-01"],
  fallbacks: "default",
  system: [
    {
      type: "text",
      text: compiledPersonaPrompt,                 // byte-stable per townsperson
      cache_control: { type: "ephemeral", ttl: "1h" },
    },
  ],
  messages: [{ role: "user", content: scenePrompt }],   // everything that changes
  output_config: {
    effort: "low",                                 // "high" for plans and reflections
    format: zodOutputFormat(ActionSchema),
  },
});
```

- **The persona is cached.** It is the system block, byte-identical across calls, with a one hour cache TTL. After the first call of the hour for a townsperson, every later call reads it from cache. Everything that varies is in the user turn after the breakpoint.
- **Answers are structured.** Forced tool choice is not available on this model family, so the contract is a zod schema passed as the output format. The SDK parses it; the mind validates it again; the engine never reads prose.
- **Thinking is always on; effort is the dial.** Routine ticks run at `low`. Plans and reflections run at `high`, because those calls shape the next hundred.
- **Refusals fall back, then degrade.** Server-side fallbacks are on. If the safety layer declines a request, the API re-runs it on a fallback model inside the same call. If the whole chain declines, the mind raises, the engine records it, and the scripted mind answers that one choice.
- **There is a budget.** Live calls per simulated day are capped. At the cap the engine records a `budget` event and runs scripted until midnight.

The full reasoning, the error table, and what to change when moving to another model are in [docs/MODEL_CONTRACT.md](docs/MODEL_CONTRACT.md).

## Watching and steering

### The journal

`var/journal.jsonl` gets one JSON line per event: `day`, `tick`, `wake`, `sleep`, `plan`, `move`, `action`, `say`, `dialogue`, `reflection`, `memory`, `budget`, `error`. `var/snapshot.json` is rewritten every tick with every townsperson's place, needs, mood, plan and current action. The journal is the product; everything else is a way of reading it.

### The observer

`npm run serve` starts an HTTP server:

| Route | Returns |
|---|---|
| `GET /` | a single-page viewer: the townsfolk, their needs, and the live event stream |
| `GET /api/snapshot` | the current state of every townsperson and place |
| `GET /api/events` | server-sent events, one `TownEvent` per message, with the last fifty on connect |
| `GET /api/npcs/:id` | persona, state, and the last forty memories |
| `GET /api/npcs/:id/prompt` | the compiled system prompt, as text |
| `POST /api/announce` | `{ "text", "place"?, "importance"? }`; writes a memory for everyone present |

The viewer is one HTML string with no build step and no dependencies. It is a window, not a product.

### Announcing

```
npm run town -- announce "A storm is forecast for Friday."
npm run town -- announce "The lamp has gone dark." --place lighthouse --importance 9
```

An announcement becomes an observation in the memory of everyone at the place, or everyone in town. Without `--importance`, each person's mind rates how much the fact matters to them, which costs one call per hearer and gives you twelve different reactions to the same sentence.

## Authoring

Everything the engine knows about the town is in `town/`:

```
town/
  town.json        name, tagline, description, clock, places, common knowledge
  npcs/<id>.json   one townsperson each
```

Add a place by adding an entry with an `id`, a `name`, a `description`, `exits`, and optional `openHours`. Add a townsperson by adding a file with the fields in the table under [The mind of a townsperson](#the-mind-of-a-townsperson); the schema in [src/npc/schema.ts](src/npc/schema.ts) is the contract and `npm run validate` checks every cross reference. Point the CLI at a different directory with `--town`.

The writing guidance that matters most: give every person one thing they want, one thing they hide, and one person they are wrong about; make the secrets collide; make the routines cross, or two people will never be in the same room. The full guide with a minimal persona you can copy is [docs/AUTHORING.md](docs/AUTHORING.md).

## Cost

Rough numbers for the shipped town at the default settings, so you can decide before you run it. These are estimates from the prompt sizes and the offline event mix, not measurements of your account.

| | Per call | Per simulated day |
|---|---|---|
| Persona prompt, cached | ~1,500 tokens read from cache | |
| Scene and memories | ~400 to 700 fresh input tokens | |
| Answer | ~100 to 300 output tokens | |
| Live calls | | several hundred to around a thousand |

Most of the spend is output tokens on dialogue. Three levers, in order of effect: the daily call budget, `MYTHOSTOWN_EFFORT`, and how talkative the townsfolk are (the extraversion sliders and the number of people whose routines cross). Run with `--calls` to see every call with its cached, fresh and output token counts, and watch `cache_read_input_tokens`: if it is zero after the first call for a townsperson, something is varying in the system prompt that should not be.

## Project layout

```
mythostown/
  src/
    cli.ts                 commander entry: run, serve, npcs, inspect, announce
    config.ts              environment, with zod
    types.ts               every domain type
    engine/
      clock.ts             simulated time, HH:MM parsing, overnight windows
      town.ts              the loop: step, needs, routing, dialogue, reflection, budget
    npc/
      schema.ts            zod schemas for personas, places, and every mind answer
      persona.ts           loading, cross-validation, and prompt compilation
      memory.ts            memory stream and retrieval scoring
    mind/
      types.ts             Mind, Situation, DialogueSituation
      prompts.ts           the volatile half of every prompt
      mythos.ts            the live mind: Claude Mythos, cached, structured, with fallbacks
      scripted.ts          the deterministic twin
    server/
      http.ts              snapshot, SSE, per-person detail, announce
      viewer.ts            the single-file viewer
    store/
      journal.ts           journal.jsonl and snapshot.json
  town/
    town.json              Mythostown: places, clock, common knowledge
    npcs/                  twelve townsfolk
  docs/
    ARCHITECTURE.md        the loop, the situation, the minds, the reasons
    NPC_DESIGN.md          persona fields, needs, memory, reflection, writing guidance
    MODEL_CONTRACT.md      the exact call shape and why
    AUTHORING.md           building your own town
  test/                    clock, memory, and a full offline day with invariants
  scripts/validate-town.ts
```

## Testing

```
npm run typecheck
npm test
npm run validate
```

The test suite runs a complete simulated day offline and checks that every townsperson is in a real place, every need is in range, people moved, talked, slept and reflected, no errors were recorded, and that two towns with the same seed produce the same journal. CI runs the same plus an offline smoke day through the CLI.

## Design principles

- **Nothing hidden.** Every choice, every fallback, every refusal, every budget stop is an event in the journal.
- **Offline first.** The scripted twin is not a mock; it is the floor the town stands on.
- **The engine is the law.** Minds propose, the world disposes. A model cannot teleport, talk through walls, or read another mind.
- **Stable prompts, volatile scenes.** One compiled persona per person, forever. Everything else goes in the user turn.
- **Small on purpose.** Twelve people, twenty-one places, no database, no queue, no framework. You can read the whole thing in an afternoon.

## Roadmap

- Persisting memory streams across runs, so the town has a history longer than one process.
- A second town with a different shape: a space station, a monastery, a trading floor.
- Objects with state: a letter that can be read, a key that can be taken, a boat that can be missed.
- A `whisper` command that speaks to one townsperson as another townsperson.
- Memory consolidation: compressing old observations into summaries once they fall below a recall threshold.
- A replay tool that rebuilds any moment from the journal.

## FAQ

**Does it have to be Mythos?** No. Set `MYTHOSTOWN_MODEL`. The prompts assume a model that can hold a long persona and a short scene and answer in one shot. The contract is tuned for the Fable and Mythos families; see the model contract doc before switching families.

**Why not embeddings for memory?** Because they would make the town depend on a service to remember, and the whole point is that the town runs on its own. Lexical retrieval is weaker and entirely inspectable.

**Why structured output instead of tools?** Forced tool choice is not available on this model family, and a typed answer is what the engine needs anyway. The schema is the API between a mind and the world.

**Can the townsfolk tell they are in a simulation?** They are told they are people, told never to mention models or prompts, and shown only what a person in their position could see. Whether that is enough is a question you can answer by reading the journal.

**Is any of the town real?** No. Mythostown, its people, its lighthouse and its 1931 storm are fiction written for this repository.

## License

MIT. See [LICENSE](LICENSE).
