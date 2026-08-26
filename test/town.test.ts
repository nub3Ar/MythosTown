import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";
import { Town } from "../src/engine/town.js";
import { compilePersonaPrompt, loadTown } from "../src/npc/persona.js";
import type { TownEvent } from "../src/types.js";

const townDir = fileURLToPath(new URL("../town", import.meta.url));

function offlineTown(): Town {
  const config = loadConfig({ offline: true, apiKey: undefined });
  return new Town({ config, townDir, journal: false, seed: 42 });
}

describe("town data", () => {
  it("loads and cross-validates", () => {
    const { spec, personas, placesById } = loadTown(townDir);
    expect(personas.length).toBeGreaterThanOrEqual(10);
    expect(placesById.size).toBe(spec.places.length);
    for (const p of personas) {
      expect(p.routine.some((b) => /sleep/i.test(b.activity))).toBe(true);
      expect(p.routine.filter((b) => /sleep/i.test(b.activity)).every((b) => b.place === p.home)).toBe(true);
    }
  });

  it("compiles a stable persona prompt", () => {
    const { spec, personas, placesById } = loadTown(townDir);
    const names = new Map(personas.map((p) => [p.id, p.name]));
    const p = personas[0]!;
    const a = compilePersonaPrompt(p, spec, placesById, names);
    const b = compilePersonaPrompt(p, spec, placesById, names);
    expect(a).toBe(b);
    expect(a).toContain(p.name);
    expect(a).not.toMatch(/undefined/);
  });
});

describe("offline town", () => {
  it("runs a full day with scripted minds and keeps every invariant", async () => {
    const town = offlineTown();
    const events: TownEvent[] = [];
    town.on("event", (e: TownEvent) => events.push(e));

    await town.run(144);

    const snap = town.snapshot();
    expect(snap.day).toBe(2);
    expect(snap.calls.total).toBe(0);
    for (const n of snap.npcs) {
      expect(town.placesById.has(n.place)).toBe(true);
      for (const v of Object.values(n.needs)) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
    const types = new Set(events.map((e) => e.type));
    expect(types.has("move")).toBe(true);
    expect(types.has("say")).toBe(true);
    expect(types.has("sleep")).toBe(true);
    expect(events.filter((e) => e.type === "error")).toEqual([]);

    const mara = town.memories("mara");
    expect(mara.length).toBeGreaterThan(10);
    expect(mara.some((m) => m.kind === "dialogue")).toBe(true);
  });

  it("announcements land in memory for the right people", async () => {
    const town = offlineTown();
    await town.announce("A storm is forecast for Friday.", undefined, 7);
    for (const p of town.personas) {
      const last = town.memories(p.id).at(-1);
      expect(last?.text).toBe("A storm is forecast for Friday.");
      expect(last?.importance).toBe(7);
    }
    await town.announce("The lamp has gone dark.", "lighthouse", 9);
    expect(town.memories("theo").at(-1)?.text).toBe("The lamp has gone dark.");
    expect(town.memories("mara").at(-1)?.text).not.toBe("The lamp has gone dark.");
  });

  it("is deterministic for a given seed", async () => {
    const a = offlineTown();
    const b = offlineTown();
    const ea: string[] = [];
    const eb: string[] = [];
    a.on("event", (e: TownEvent) => ea.push(`${e.time} ${e.type} ${e.text}`));
    b.on("event", (e: TownEvent) => eb.push(`${e.time} ${e.type} ${e.text}`));
    await a.run(60);
    await b.run(60);
    expect(ea).toEqual(eb);
  });
});
