import { describe, expect, it } from "vitest";
import { MemoryStream, relevance, tokenize } from "../src/npc/memory.js";

describe("memory stream", () => {
  it("tokenizes with stop words removed and light stemming", () => {
    expect(tokenize("The lamp at the lighthouse failed again")).toEqual(["lamp", "lighthouse", "fail", "again"]);
  });

  it("scores lexical relevance", () => {
    const q = tokenize("lighthouse lamp");
    expect(relevance(q, "the lamp at the lighthouse is failing")).toBe(1);
    expect(relevance(q, "bread for two at the bakery")).toBe(0);
  });

  it("retrieves by recency, importance and relevance, returned chronologically", () => {
    const s = new MemoryStream("theo");
    s.add("observation", "I ate breakfast.", 1, 0);
    s.add("observation", "The lamp failed again last night.", 8, 60);
    s.add("observation", "Bram waved from the harbour.", 2, 120);
    s.add("reflection", "I am getting too old to climb the tower twice.", 7, 180);
    s.add("observation", "Bought bread from Cas.", 1, 240);

    const got = s.retrieve("lamp tower", 300, 2);
    expect(got.map((m) => m.text)).toEqual([
      "The lamp failed again last night.",
      "I am getting too old to climb the tower twice.",
    ]);
    expect(got.every((m) => m.lastAccess === 300)).toBe(true);
  });

  it("accumulates reflection pressure from non-reflections only", () => {
    const s = new MemoryStream("mara");
    s.add("observation", "a", 5, 10);
    s.add("reflection", "b", 9, 20);
    s.add("dialogue", "c", 4, 30);
    expect(s.pressureSince(0)).toBe(9);
    expect(s.pressureSince(15)).toBe(4);
  });

  it("clamps importance into 1..10", () => {
    const s = new MemoryStream("x");
    expect(s.add("observation", "a", 99, 0).importance).toBe(10);
    expect(s.add("observation", "b", -3, 0).importance).toBe(1);
    expect(s.add("observation", "c", Number.NaN, 0).importance).toBe(3);
  });
});
