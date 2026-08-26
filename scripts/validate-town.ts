import { resolve } from "node:path";
import { loadTown, compilePersonaPrompt } from "../src/npc/persona.js";

/**
 * Validate town/ without running anything: schemas, cross references, and a
 * rough token estimate for every compiled persona prompt.
 */
const dir = resolve(process.argv[2] ?? "town");
const { spec, personas, placesById } = loadTown(dir);
const names = new Map(personas.map((p) => [p.id, p.name]));

process.stdout.write(`${spec.name}: ${personas.length} townsfolk, ${spec.places.length} places.\n`);
for (const p of personas) {
  const prompt = compilePersonaPrompt(p, spec, placesById, names);
  const approxTokens = Math.round(prompt.length / 4);
  process.stdout.write(`  ${p.id.padEnd(10)} ${p.name.padEnd(18)} prompt ~${approxTokens} tokens, ${p.relationships.length} relationships, ${p.routine.length} routine blocks\n`);
}
for (const pl of spec.places) {
  const residents = personas.filter((p) => p.home === pl.id).map((p) => p.name);
  const workers = personas.filter((p) => p.workplace === pl.id).map((p) => p.name);
  process.stdout.write(`  ${pl.id.padEnd(14)} ${pl.name.padEnd(20)} exits: ${pl.exits.length}${residents.length ? `, home of ${residents.join(", ")}` : ""}${workers.length ? `, workplace of ${workers.join(", ")}` : ""}\n`);
}
process.stdout.write("ok\n");
