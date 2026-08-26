import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { Town } from "../engine/town.js";
import type { TownEvent } from "../types.js";
import { viewerHtml } from "./viewer.js";

/**
 * The observer. A small HTTP surface for watching the town:
 *
 *   GET  /                 a plain viewer page
 *   GET  /api/snapshot     current state of every townsperson and place
 *   GET  /api/events       server-sent events, one TownEvent per message
 *   GET  /api/npcs/:id     persona, state and the last 40 memories
 *   GET  /api/npcs/:id/prompt   the compiled system prompt, as text
 *   POST /api/announce     { text, place?, importance? } drops a fact into the town
 */
export function startServer(town: Town, port: number): Server {
  const clients = new Set<ServerResponse>();

  town.on("event", (e: TownEvent) => {
    const frame = `event: town\ndata: ${JSON.stringify(e)}\n\n`;
    for (const res of clients) res.write(frame);
  });

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    try {
      if (req.method === "GET" && url.pathname === "/") {
        return send(res, 200, viewerHtml(town.spec.name), "text/html; charset=utf-8");
      }
      if (req.method === "GET" && url.pathname === "/api/snapshot") {
        return json(res, 200, town.snapshot());
      }
      if (req.method === "GET" && url.pathname === "/api/events") {
        res.writeHead(200, {
          "content-type": "text/event-stream",
          "cache-control": "no-cache",
          connection: "keep-alive",
        });
        for (const e of town.tail(50)) res.write(`event: town\ndata: ${JSON.stringify(e)}\n\n`);
        clients.add(res);
        req.on("close", () => clients.delete(res));
        return;
      }
      const npc = /^\/api\/npcs\/([a-z0-9-]+)(\/prompt)?$/.exec(url.pathname);
      if (req.method === "GET" && npc) {
        const id = npc[1] as string;
        const persona = town.personas.find((p) => p.id === id);
        const state = town.state(id);
        if (!persona || !state) return json(res, 404, { error: "no such townsperson" });
        if (npc[2]) return send(res, 200, town.prompt(id) ?? "", "text/plain; charset=utf-8");
        return json(res, 200, { persona, state, memories: town.memories(id).slice(-40) });
      }
      if (req.method === "POST" && url.pathname === "/api/announce") {
        const body = await readJson(req);
        const text = typeof body.text === "string" ? body.text.trim() : "";
        if (!text) return json(res, 400, { error: "text is required" });
        const place = typeof body.place === "string" ? body.place : undefined;
        const importance = typeof body.importance === "number" ? body.importance : undefined;
        await town.announce(text, place, importance);
        return json(res, 202, { ok: true });
      }
      return json(res, 404, { error: "not found" });
    } catch (err) {
      return json(res, 500, { error: (err as Error).message });
    }
  });

  server.listen(port);
  return server;
}

function send(res: ServerResponse, status: number, body: string, type: string): void {
  res.writeHead(status, { "content-type": type });
  res.end(body);
}

function json(res: ServerResponse, status: number, body: unknown): void {
  send(res, status, JSON.stringify(body), "application/json; charset=utf-8");
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  const parsed: unknown = JSON.parse(raw);
  return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
}
