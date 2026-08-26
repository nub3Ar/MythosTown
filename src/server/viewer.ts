/** A single-file viewer. No build step, no framework, no dependencies. */
export function viewerHtml(townName: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(townName)}</title>
<style>
  :root { --bg:#ffffff; --fg:#111111; --muted:#6b7280; --line:#e5e7eb; --card:#fafafa; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font:14px/1.5 Inter, system-ui, -apple-system, "Segoe UI", sans-serif; }
  header { display:flex; justify-content:space-between; align-items:baseline; padding:20px 24px; border-bottom:1px solid var(--line); }
  header h1 { margin:0; font-size:18px; font-weight:600; letter-spacing:-0.01em; }
  header .clock { font-variant-numeric:tabular-nums; color:var(--muted); }
  main { display:grid; grid-template-columns: 360px 1fr; gap:0; min-height:calc(100vh - 62px); }
  aside { border-right:1px solid var(--line); padding:16px; overflow:auto; }
  section { padding:16px 24px; overflow:auto; }
  .npc { border:1px solid var(--line); background:var(--card); border-radius:8px; padding:10px 12px; margin-bottom:8px; }
  .npc b { font-weight:600; }
  .npc .meta { color:var(--muted); font-size:12px; }
  .npc .vis { margin-top:4px; }
  .needs { display:flex; gap:6px; margin-top:6px; }
  .needs i { display:block; height:3px; flex:1; background:var(--line); border-radius:2px; position:relative; overflow:hidden; }
  .needs i::after { content:""; position:absolute; inset:0; width:var(--v); background:#111; }
  .ev { padding:6px 0; border-bottom:1px solid var(--line); display:grid; grid-template-columns:70px 90px 1fr; gap:12px; }
  .ev .t { color:var(--muted); font-variant-numeric:tabular-nums; }
  .ev .k { color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:.04em; }
  .ev.say .x { font-style:italic; }
  .ev.reflection .x, .ev.plan .x { color:#374151; }
  .ev.error .x, .ev.budget .x { color:#b91c1c; }
  form { display:flex; gap:8px; margin-bottom:12px; }
  input { flex:1; border:1px solid var(--line); border-radius:6px; padding:8px 10px; font:inherit; }
  button { border:0; background:#111; color:#fff; border-radius:6px; padding:8px 14px; font:inherit; cursor:pointer; }
  @media (max-width: 800px) { main { grid-template-columns:1fr; } aside { border-right:0; border-bottom:1px solid var(--line); } }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0b0d12; --fg:#f2f4f0; --muted:#9aa3b2; --line:#1f2937; --card:#11141b; }
    .needs i::after { background:#f2f4f0; } button { background:#f2f4f0; color:#0b0d12; }
    .ev.reflection .x, .ev.plan .x { color:#cbd5e1; }
  }
</style>
</head>
<body>
<header><h1>${escapeHtml(townName)}</h1><div class="clock" id="clock">connecting</div></header>
<main>
  <aside id="npcs"></aside>
  <section>
    <form id="announce"><input id="text" placeholder="Announce something to the whole town" autocomplete="off"><button>Announce</button></form>
    <div id="events"></div>
  </section>
</main>
<script>
  const npcsEl = document.getElementById('npcs');
  const evEl = document.getElementById('events');
  const clockEl = document.getElementById('clock');
  async function refresh() {
    const s = await (await fetch('/api/snapshot')).json();
    clockEl.textContent = 'Day ' + s.day + ' ' + s.time + (s.offline ? ' (scripted minds)' : ' (' + s.calls.today + '/' + s.calls.budget + ' calls today)');
    npcsEl.innerHTML = s.npcs.map(n => {
      const place = s.places.find(p => p.id === n.place);
      const vis = n.asleep ? 'asleep' : (n.currentAction ? n.currentAction.visible : 'idle');
      const bar = v => '<i style="--v:' + Math.round(v*100) + '%"></i>';
      return '<div class="npc"><b>' + n.name + '</b> <span class="meta">' + n.role + ' at ' + (place ? place.name : n.place) + ', ' + n.mood + '</span>'
        + '<div class="vis">' + vis + '</div>'
        + '<div class="needs" title="energy, hunger, company, purpose">' + bar(n.needs.energy) + bar(n.needs.hunger) + bar(n.needs.social) + bar(n.needs.purpose) + '</div></div>';
    }).join('');
  }
  const es = new EventSource('/api/events');
  es.addEventListener('town', m => {
    const e = JSON.parse(m.data);
    const row = document.createElement('div');
    row.className = 'ev ' + e.type;
    row.innerHTML = '<span class="t">D' + e.day + ' ' + e.time + '</span><span class="k">' + e.type + '</span><span class="x"></span>';
    row.querySelector('.x').textContent = e.text;
    evEl.prepend(row);
    while (evEl.children.length > 300) evEl.lastChild.remove();
    if (e.type === 'tick' || e.type === 'move' || e.type === 'action' || e.type === 'sleep' || e.type === 'wake') refresh();
  });
  document.getElementById('announce').addEventListener('submit', async ev => {
    ev.preventDefault();
    const input = document.getElementById('text');
    const text = input.value.trim();
    if (!text) return;
    await fetch('/api/announce', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ text }) });
    input.value = '';
  });
  refresh();
  setInterval(refresh, 5000);
</script>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}
