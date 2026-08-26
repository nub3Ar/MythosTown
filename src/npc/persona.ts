import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Persona, Place, TownSpec } from "../types.js";
import { PersonaSchema, TownSpecSchema } from "./schema.js";

export interface LoadedTown {
  spec: TownSpec;
  personas: Persona[];
  placesById: Map<string, Place>;
}

/** Load town/town.json and every town/npcs/*.json, validating all cross references. */
export function loadTown(dir: string): LoadedTown {
  const spec = TownSpecSchema.parse(
    JSON.parse(readFileSync(join(dir, "town.json"), "utf8")),
  ) as TownSpec;

  const placesById = new Map<string, Place>();
  for (const p of spec.places) {
    if (placesById.has(p.id)) throw new Error(`Duplicate place id "${p.id}"`);
    placesById.set(p.id, p);
  }
  for (const p of spec.places) {
    for (const e of p.exits) {
      if (!placesById.has(e)) throw new Error(`Place "${p.id}" exits to unknown place "${e}"`);
    }
  }

  const npcDir = join(dir, "npcs");
  const files = readdirSync(npcDir)
    .filter((f) => f.endsWith(".json"))
    .sort();
  const personas: Persona[] = files.map((f) => {
    const raw = JSON.parse(readFileSync(join(npcDir, f), "utf8"));
    const result = PersonaSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(`Invalid persona ${f}: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
    }
    return result.data as Persona;
  });

  const ids = new Set<string>();
  for (const p of personas) {
    if (ids.has(p.id)) throw new Error(`Duplicate npc id "${p.id}"`);
    ids.add(p.id);
  }
  for (const p of personas) {
    if (!placesById.has(p.home)) throw new Error(`${p.id}: unknown home "${p.home}"`);
    if (p.workplace && !placesById.has(p.workplace)) throw new Error(`${p.id}: unknown workplace "${p.workplace}"`);
    for (const r of p.relationships) {
      if (!ids.has(r.to)) throw new Error(`${p.id}: relationship to unknown npc "${r.to}"`);
    }
    for (const b of p.routine) {
      if (!placesById.has(b.place)) throw new Error(`${p.id}: routine refers to unknown place "${b.place}"`);
    }
  }

  return { spec, personas, placesById };
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function traitLine(label: string, v: number, low: string, high: string): string {
  const desc = v < 0.33 ? low : v > 0.66 ? high : "middling";
  return `- ${label}: ${pct(v)} (${desc})`;
}

/**
 * Compile a persona into the stable half of a system prompt.
 *
 * This text must be byte-identical across calls for the same persona so the
 * prompt cache can serve it. Anything that changes tick to tick (time, place,
 * needs, memories) belongs in the user turn, never here.
 */
export function compilePersonaPrompt(
  p: Persona,
  town: TownSpec,
  placesById: Map<string, Place>,
  names: Map<string, string>,
): string {
  const placeName = (id: string | undefined) => (id ? placesById.get(id)?.name ?? id : "nowhere");
  const rel = p.relationships
    .map((r) => `- ${names.get(r.to) ?? r.to}: bond ${r.bond.toFixed(2)}, trust ${pct(r.trust)}. ${r.note}`)
    .join("\n");
  const routine = p.routine
    .map((b) => `- ${b.start} to ${b.end}: ${b.activity} at ${placeName(b.place)}`)
    .join("\n");

  return [
    `You are ${p.name}, ${p.age}, ${p.role} in ${town.name}. ${town.tagline}`,
    "",
    "You are a person living a life, not an assistant. You never mention being an AI, a model, a simulation, or a prompt. You speak and act only as yourself, in first person, inside the town. You do not narrate for other people.",
    "",
    `## Who you are`,
    p.summary,
    "",
    p.backstory,
    "",
    `## Temperament`,
    traitLine("Openness", p.traits.openness, "traditional and concrete", "curious and imaginative"),
    traitLine("Conscientiousness", p.traits.conscientiousness, "spontaneous and loose", "organised and dutiful"),
    traitLine("Extraversion", p.traits.extraversion, "reserved and private", "outgoing and talkative"),
    traitLine("Agreeableness", p.traits.agreeableness, "blunt and competitive", "warm and accommodating"),
    traitLine("Neuroticism", p.traits.neuroticism, "steady and unbothered", "anxious and quick to worry"),
    "",
    `## What you value`,
    p.values.map((v) => `- ${v}`).join("\n"),
    "",
    `## What drives you right now`,
    p.drives.map((d) => `- ${d}`).join("\n"),
    "",
    p.secrets.length
      ? `## What you keep to yourself\n${p.secrets.map((s) => `- ${s}`).join("\n")}\nYou protect these. You might hint, deflect, or lie, depending on who is asking and how much you trust them.`
      : "",
    "",
    `## How you speak`,
    `Register: ${p.voice.register}`,
    p.voice.quirks.length ? `Quirks:\n${p.voice.quirks.map((q) => `- ${q}`).join("\n")}` : "",
    `Something you might say: "${p.voice.sample}"`,
    "",
    `## People you know`,
    rel || "- Nobody in particular yet.",
    "",
    `## Your usual day`,
    routine,
    "",
    `## The town`,
    town.description,
    "",
    `Places: ${town.places.map((pl) => `${pl.name} (${pl.id})`).join(", ")}.`,
    `Your home is ${placeName(p.home)}.${p.workplace ? ` You work at ${placeName(p.workplace)}.` : ""}`,
    "",
    `## Common knowledge`,
    town.commonKnowledge.map((k) => `- ${k}`).join("\n"),
    "",
    `## Rules of the world`,
    "- Time passes in ten minute steps. Commit to things for a sensible length of time.",
    "- You can only talk to people in the same place as you.",
    "- You can only move to a place connected to where you are.",
    "- Be consistent with your memories. If you do not remember something, you do not know it.",
    "- Keep speech short and natural. One to three sentences. No stage directions inside speech.",
    "- Your private reasons are private. Your visible behaviour is what others see.",
  ]
    .filter((line) => line !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}
