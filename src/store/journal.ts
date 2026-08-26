import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Snapshot, TownEvent } from "../types.js";

/**
 * The journal is the town's public record: every event, as one JSON object
 * per line, plus a snapshot of the latest state. Nothing the engine does is
 * invisible; if it happened, it is in var/journal.jsonl.
 */
export class Journal {
  private readonly eventsPath: string;
  private readonly snapshotPath: string;

  constructor(dir: string, private readonly enabled = true) {
    this.eventsPath = join(dir, "journal.jsonl");
    this.snapshotPath = join(dir, "snapshot.json");
    if (enabled) mkdirSync(dir, { recursive: true });
  }

  append(e: TownEvent): void {
    if (!this.enabled) return;
    appendFileSync(this.eventsPath, JSON.stringify(e) + "\n");
  }

  snapshot(s: Snapshot): void {
    if (!this.enabled) return;
    writeFileSync(this.snapshotPath, JSON.stringify(s, null, 2));
  }
}
