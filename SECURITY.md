# Security

## Keys

Mythostown reads `ANTHROPIC_API_KEY` from the environment or `.env`. `.env` is ignored by git. Never commit a key, and never pass one on the command line.

## The observer

The HTTP server in `src/server/http.ts` binds to the configured port on all interfaces and has no authentication. It exposes every townsperson's state, memories, and compiled prompt, and it accepts `POST /api/announce`, which writes into every townsperson's memory. Run it on localhost or behind something that authenticates. It is a window onto a toy, not a service.

## Prompt content

Townsfolk read announcements and each other's lines as memories, and those memories are placed in later prompts. Anyone who can call `announce` can therefore put text in front of the model. The engine validates every model answer against a schema and against the world, so the worst an injected line can do is change what a townsperson says or where they walk. Nothing a mind returns is executed, fetched, or written anywhere but the journal.

## Reporting

Open an issue, or if the problem would put a key or a machine at risk, contact the maintainer privately before posting details.
