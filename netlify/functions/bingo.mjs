// Cyber Bingo – live lobby for the trainer screen.
// Phones join with a game code and a nickname; the trainer sees who joined
// and starts the game for everyone at the same moment.
// Data is kept in Netlify Blobs (store "cyber-bingo") and deleted with "New game".
import { getStore } from "@netlify/blobs";

export const config = { path: "/api/bingo" };

export default async (req) =>
  handle(req, getStore({ name: "cyber-bingo", consistency: "strong" }));

const MAX_AGE = 3 * 60 * 60 * 1000;           // a game is valid for 3 hours
const json = (data, status = 200) =>
  new Response(JSON.stringify({ now: Date.now(), ...data }), {
    status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const cleanName = (n) => String(n || "").replace(/[<>&"'/\\]/g, "").replace(/\s+/g, " ").trim().slice(0, 20);
const okCode = (c) => /^\d{4}$/.test(String(c || ""));
const okId = (c) => /^[a-z0-9]{6,24}$/.test(String(c || ""));

async function loadGame(store, code) {
  if (!okCode(code)) return null;
  const g = await store.get(`g/${code}`, { type: "json" });
  if (!g || Date.now() - g.created > MAX_AGE) return null;
  return g;
}
async function players(store, code) {
  const { blobs } = await store.list({ prefix: `p/${code}/` });
  const byId = new Map();
  for (const b of blobs) {
    const [, , pid, name] = b.key.split("/");
    if (pid && name) byId.set(pid, decodeURIComponent(name));
  }
  return [...byId.values()].sort((a, b) => a.localeCompare(b));
}
async function removePlayer(store, code, pid) {
  const { blobs } = await store.list({ prefix: `p/${code}/${pid}/` });
  await Promise.all(blobs.map((b) => store.delete(b.key)));
}

export async function handle(req, store) {
  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const code = url.searchParams.get("code"), tk = url.searchParams.get("tk");
      const g = await loadGame(store, code);
      if (!g) return json({ ok: false, error: "no-game" }, 404);
      const list = await players(store, code);
      const out = { ok: true, startAt: g.startAt || null, count: list.length };
      if (tk && tk === g.tk) out.players = list;            // names only for the trainer
      return json(out);
    }
    if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
    const body = await req.json().catch(() => ({}));

    if (body.action === "create") {
      const tk = crypto.randomUUID().replace(/-/g, "");
      for (let i = 0; i < 20; i++) {
        const code = String(1000 + Math.floor(Math.random() * 9000));
        const old = await store.get(`g/${code}`, { type: "json" });
        if (old && Date.now() - old.created <= MAX_AGE) continue;
        if (old) { const { blobs } = await store.list({ prefix: `p/${code}/` }); await Promise.all(blobs.map((b) => store.delete(b.key))); }
        await store.setJSON(`g/${code}`, { tk, created: Date.now(), startAt: null });
        return json({ ok: true, code, tk });
      }
      return json({ ok: false, error: "busy" }, 503);
    }

    const code = String(body.code || "");
    const g = await loadGame(store, code);
    if (!g) return json({ ok: false, error: "no-game" }, 404);

    if (body.action === "join") {
      const name = cleanName(body.name);
      if (!name) return json({ ok: false, error: "name" }, 400);
      if (!okId(body.pid)) return json({ ok: false, error: "pid" }, 400);
      await removePlayer(store, code, body.pid);
      await store.set(`p/${code}/${body.pid}/${encodeURIComponent(name)}`, "1");
      const list = await players(store, code);
      return json({ ok: true, startAt: g.startAt || null, count: list.length });
    }
    if (body.tk !== g.tk) return json({ ok: false, error: "not-trainer" }, 403);

    if (body.action === "start") {
      if (!g.startAt) { g.startAt = Date.now() + 5000; await store.setJSON(`g/${code}`, g); }  // 5 s to get ready
      return json({ ok: true, startAt: g.startAt });
    }
    if (body.action === "reset") {
      const { blobs } = await store.list({ prefix: `p/${code}/` });
      await Promise.all(blobs.map((b) => store.delete(b.key)));
      await store.delete(`g/${code}`);
      return json({ ok: true });
    }
    return json({ ok: false, error: "action" }, 400);
  } catch (e) {
    return json({ ok: false, error: "server" }, 500);
  }
}
