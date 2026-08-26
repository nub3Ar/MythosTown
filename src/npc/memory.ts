import { randomUUID } from "node:crypto";
import type { Memory, MemoryKind, NpcId } from "../types.js";

/**
 * A memory stream: an append-only list of what one townsperson has
 * observed, concluded, planned and said, with retrieval weighted by
 * recency, importance and relevance.
 *
 * Relevance is lexical (token overlap with a light stemmer). There is no
 * embedding service in the loop on purpose: the town must run offline and the
 * retrieval must be inspectable by reading the journal.
 */

export interface RetrievalWeights {
  recency: number;
  importance: number;
  relevance: number;
}

export const DEFAULT_WEIGHTS: RetrievalWeights = { recency: 1, importance: 1, relevance: 1 };

/** Half-life of recency in simulated hours. */
const RECENCY_HALF_LIFE_HOURS = 24;

const STOP = new Set(
  "a an the and or but of to in on at for with by from as is are was were be been being it its this that these those i you he she they we me him her them us my your his their our not no yes do does did have has had will would can could should about into over under than then so if".split(
    " ",
  ),
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(stem);
}

function stem(t: string): string {
  if (t.length <= 4) return t;
  return t.replace(/(ing|ed|es|s|ly)$/, "");
}

export function relevance(queryTokens: string[], text: string): number {
  if (queryTokens.length === 0) return 0;
  const q = new Set(queryTokens);
  const doc = new Set(tokenize(text));
  if (doc.size === 0) return 0;
  let hits = 0;
  for (const t of q) if (doc.has(t)) hits += 1;
  // Normalise by the smaller set so short queries can still score high.
  return hits / Math.min(q.size, doc.size);
}

export class MemoryStream {
  private readonly items: Memory[] = [];

  constructor(readonly npc: NpcId) {}

  add(
    kind: MemoryKind,
    text: string,
    importance: number,
    now: number,
    tags: string[] = [],
  ): Memory {
    const m: Memory = {
      id: randomUUID(),
      npc: this.npc,
      kind,
      text: text.trim(),
      importance: clampImportance(importance),
      createdAt: now,
      lastAccess: now,
      tags,
    };
    this.items.push(m);
    return m;
  }

  all(): readonly Memory[] {
    return this.items;
  }

  get size(): number {
    return this.items.length;
  }

  /** The `n` most recent memories, newest last. */
  recent(n: number): Memory[] {
    return this.items.slice(-n);
  }

  /**
   * Score every memory against a query and return the top `k`. Each returned
   * memory has its lastAccess bumped, so recalled things stay fresh.
   */
  retrieve(
    query: string,
    now: number,
    k = 8,
    weights: RetrievalWeights = DEFAULT_WEIGHTS,
  ): Memory[] {
    const qt = tokenize(query);
    const scored = this.items.map((m) => {
      const hours = Math.max(0, now - m.lastAccess) / 60;
      const rec = Math.pow(0.5, hours / RECENCY_HALF_LIFE_HOURS);
      const imp = m.importance / 10;
      const rel = relevance(qt, m.text);
      const score = weights.recency * rec + weights.importance * imp + weights.relevance * rel;
      return { m, score };
    });
    scored.sort((a, b) => b.score - a.score);
    const picked = scored.slice(0, k).map((s) => s.m);
    for (const m of picked) m.lastAccess = now;
    // Present in chronological order so the model reads them as a story.
    return picked.sort((a, b) => a.createdAt - b.createdAt);
  }

  /** Importance accumulated since `sinceMinute`, used to trigger reflection. */
  pressureSince(sinceMinute: number): number {
    let total = 0;
    for (const m of this.items) {
      if (m.createdAt > sinceMinute && m.kind !== "reflection") total += m.importance;
    }
    return total;
  }

  toJSON(): Memory[] {
    return [...this.items];
  }

  static fromJSON(npc: NpcId, items: Memory[]): MemoryStream {
    const s = new MemoryStream(npc);
    for (const m of items) s.items.push({ ...m });
    return s;
  }
}

export function clampImportance(n: number): number {
  if (!Number.isFinite(n)) return 3;
  return Math.max(1, Math.min(10, Math.round(n)));
}
