# Authoring a town

Everything the engine knows about a town is in `town/`. You can replace the whole directory and point the CLI at it with `--town <dir>`.

## Files

```
town/
  town.json        name, tagline, description, clock, places, common knowledge
  npcs/
    <id>.json      one townsperson each, loaded in filename order
```

Validate without running anything:

```
npm run validate            # town/
npm run validate -- ./mytown
```

It checks schemas, cross references (every home, workplace, routine place, exit and relationship must exist), and prints a rough token estimate for each compiled persona prompt.

## Places

```json
{
  "id": "lantern",
  "name": "The Lantern",
  "kind": "public",
  "description": "The inn. Low beams, a long bar, a fire that is always lit.",
  "exits": ["square", "harbour-road", "lantern-rooms"],
  "openHours": ["07:00", "01:00"]
}
```

- `id` is a lowercase slug and is what personas refer to.
- `kind` is `home`, `work`, `public` or `landmark`. It is descriptive only.
- `exits` must be symmetrical in practice (if A exits to B, B should exit to A) or people will get stuck. The validator does not enforce this, because one-way doors are occasionally what you want.
- `openHours` are optional. A closed place cannot be entered; routing avoids it; a routine that points at a closed place keeps the person where they are.
- Overnight windows (`["22:00", "06:00"]`) are supported.

A good map has one hub (the square), two or three crossing points with long opening hours (the inn, the harbour), workplaces off the hub, and homes one step further out. Twelve people and about twenty places is a comfortable size.

## Townsfolk

Minimum viable persona:

```json
{
  "id": "pip",
  "name": "Pip Marlow",
  "age": 40,
  "role": "ferry clerk",
  "home": "pip-cottage",
  "workplace": "harbour",
  "summary": "Sells the tickets and knows who is leaving before they do.",
  "backstory": "Pip has sold ferry tickets for twenty years and has never taken the ferry. He keeps a list of everyone who has, and why, and a shorter list of everyone who came back.",
  "traits": { "openness": 0.4, "conscientiousness": 0.8, "extraversion": 0.5, "agreeableness": 0.6, "neuroticism": 0.4 },
  "values": ["Timetables", "Discretion"],
  "voice": {
    "register": "Clipped, polite, a clerk's precision.",
    "quirks": ["Quotes departure times from memory."],
    "sample": "Friday, 07:40. Single or return? People always say return."
  },
  "drives": ["Find out whether Wren is finally going to buy a ticket."],
  "secrets": ["He has a return ticket in his wallet, unused, dated nineteen years ago."],
  "relationships": [
    { "to": "wren", "bond": 0.4, "trust": 0.6, "note": "Asks the fare every week and never buys." }
  ],
  "routine": [
    { "start": "07:00", "end": "17:00", "place": "harbour", "activity": "selling tickets and watching the boats" },
    { "start": "17:00", "end": "22:00", "place": "lantern", "activity": "the evening at the Lantern" },
    { "start": "22:00", "end": "07:00", "place": "pip-cottage", "activity": "sleeping" }
  ]
}
```

Rules enforced by the schema and the loader:

- `id` is a slug and must be unique.
- `relationships[].to` must be another townsperson's id.
- `home`, `workplace` and every `routine[].place` must be a place id.
- At least one routine block, and at least one of them should contain the word `sleep` and point at `home`, or the person never sleeps and never plans a new day. The test suite checks this for the shipped town.
- `backstory` is at least forty characters; `summary` at least ten. Write much more.

Guidance on writing people who come alive in play is in `docs/NPC_DESIGN.md`.

## Common knowledge

`commonKnowledge` in `town.json` is a list of facts every townsperson is told in their system prompt. Use it for the shared situation: the election, the stranger, the failing lamp. These are the threads the drives pull on. Keep it to about eight lines; past that the model starts treating it as a quiz.

## Clock

```json
"clock": { "minutesPerTick": 10, "startDay": 1, "startMinute": 360 }
```

Ten minute ticks are the tested default. Larger ticks are cheaper and coarser; action durations are in minutes and will span fewer ticks. Start at 06:00 so the first thing the town does is wake up and plan.

## Steering a running town

```
npm run town -- announce "A storm is forecast for Friday."
npm run town -- announce "The lamp has gone dark." --place lighthouse --importance 9
```

Announcements become observation memories for everyone present (or everyone, with no place). Without `--importance`, each person's mind rates how much the fact matters to them, which costs one call per person. The viewer at `/` has the same control as a text box.
