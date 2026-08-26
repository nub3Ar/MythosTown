#!/usr/bin/env node
import { Command } from "commander";
import { resolve } from "node:path";
import { loadConfig } from "./config.js";
import { Town } from "./engine/town.js";
import { loadTown } from "./npc/persona.js";
import { startServer } from "./server/http.js";
import type { TownEvent } from "./types.js";
import type { CallRecord } from "./mind/mythos.js";

const program = new Command();

program
  .name("mythostown")
  .description("A town of AI townsfolk, every one of them running on Claude Mythos.")
  .version("0.1.0");

function townDir(opt: string | undefined): string {
  return resolve(opt ?? "town");
}

function printEvent(e: TownEvent): void {
  const stamp = `D${e.day} ${e.time}`.padEnd(10);
  const kind = e.type.padEnd(10);
  process.stdout.write(`${stamp} ${kind} ${e.text}\n`);
}

function attachPrinters(town: Town, quiet: boolean, showCalls: boolean): void {
  if (!quiet) town.on("event", printEvent);
  if (showCalls) {
    town.on("call", (r: CallRecord) => {
      process.stderr.write(
        `  call ${r.task.padEnd(10)} ${r.npc.padEnd(12)} ${r.model} effort=${r.effort} in=${r.inputTokens} cached=${r.cacheRead} out=${r.outputTokens} ${r.ms}ms\n`,
      );
    });
  }
}

program
  .command("run")
  .description("Advance the town a number of ticks and print what happens")
  .option("-t, --ticks <n>", "ticks to run (144 is one day at ten minutes per tick)", "36")
  .option("-s, --speed <ms>", "wall-clock pause between ticks", "0")
  .option("--offline", "use scripted minds even if a key is present", false)
  .option("--town <dir>", "town directory", "town")
  .option("--no-journal", "do not write var/journal.jsonl")
  .option("--calls", "print every model call to stderr", false)
  .option("-q, --quiet", "print nothing but errors", false)
  .action(async (o) => {
    const config = loadConfig(o.offline ? { offline: true } : {});
    const town = new Town({ config, townDir: townDir(o.town), journal: o.journal });
    attachPrinters(town, o.quiet, o.calls);
    if (!o.quiet) {
      process.stdout.write(
        `${town.spec.name}. ${town.personas.length} townsfolk, ${town.spec.places.length} places. Minds: ${town.offline ? "scripted" : config.model}.\n`,
      );
    }
    const ac = new AbortController();
    process.on("SIGINT", () => ac.abort());
    await town.run(Number(o.ticks), Number(o.speed), ac.signal);
    if (!o.quiet) {
      const s = town.snapshot();
      process.stdout.write(`\nStopped at ${s.time} on day ${s.day} after ${s.tick} ticks, ${s.calls.total} live calls.\n`);
    }
  });

program
  .command("serve")
  .description("Run the town continuously with the observer at http://localhost:PORT")
  .option("-p, --port <n>", "port")
  .option("-s, --speed <ms>", "wall-clock pause between ticks", "4000")
  .option("--offline", "use scripted minds even if a key is present", false)
  .option("--town <dir>", "town directory", "town")
  .option("--calls", "print every model call to stderr", false)
  .option("-q, --quiet", "do not print events", false)
  .action(async (o) => {
    const config = loadConfig(o.offline ? { offline: true } : {});
    const port = o.port ? Number(o.port) : config.port;
    const town = new Town({ config, townDir: townDir(o.town) });
    attachPrinters(town, o.quiet, o.calls);
    startServer(town, port);
    process.stdout.write(`${town.spec.name} is awake at http://localhost:${port}  minds: ${town.offline ? "scripted" : config.model}\n`);
    const ac = new AbortController();
    process.on("SIGINT", () => {
      ac.abort();
      process.exit(0);
    });
    await town.run(Number.MAX_SAFE_INTEGER, Number(o.speed), ac.signal);
  });

program
  .command("npcs")
  .description("List the townsfolk")
  .option("--town <dir>", "town directory", "town")
  .action((o) => {
    const { personas, placesById } = loadTown(townDir(o.town));
    for (const p of personas) {
      const home = placesById.get(p.home)?.name ?? p.home;
      process.stdout.write(`${p.id.padEnd(10)} ${p.name.padEnd(18)} ${String(p.age).padEnd(4)} ${p.role.padEnd(28)} home: ${home}\n`);
    }
  });

program
  .command("inspect <id>")
  .description("Show a townsperson's persona, or the compiled system prompt with --prompt")
  .option("--prompt", "print the compiled system prompt", false)
  .option("--town <dir>", "town directory", "town")
  .action((id: string, o) => {
    const config = loadConfig({ offline: true });
    const town = new Town({ config, townDir: townDir(o.town), journal: false });
    const persona = town.personas.find((p) => p.id === id);
    if (!persona) {
      process.stderr.write(`No townsperson with id "${id}". Try: mythostown npcs\n`);
      process.exitCode = 1;
      return;
    }
    process.stdout.write(o.prompt ? `${town.prompt(id) ?? ""}\n` : `${JSON.stringify(persona, null, 2)}\n`);
  });

program
  .command("announce <text>")
  .description("Drop a fact into a running town (talks to the observer server)")
  .option("-p, --port <n>", "port")
  .option("--place <id>", "only people at this place hear it")
  .option("--importance <n>", "1 to 10; omitted lets each person judge")
  .action(async (text: string, o) => {
    const config = loadConfig();
    const port = o.port ? Number(o.port) : config.port;
    const body: Record<string, unknown> = { text };
    if (o.place) body.place = o.place;
    if (o.importance) body.importance = Number(o.importance);
    const res = await fetch(`http://localhost:${port}/api/announce`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    process.stdout.write(`${res.status} ${await res.text()}\n`);
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  process.stderr.write(`${(err as Error).stack ?? String(err)}\n`);
  process.exit(1);
});
