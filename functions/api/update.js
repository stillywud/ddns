// 上报公网 IP：GET /api/update?token=xxx（也支持 POST）
// IP 取自 Cloudflare 边缘传入的 CF-Connecting-IP，不信任客户端传参
const SCHEMA = `
CREATE TABLE IF NOT EXISTS ip_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  changed_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS kv (
  k TEXT PRIMARY KEY,
  v TEXT NOT NULL
);`;

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  if (!env.UPDATE_TOKEN || token !== env.UPDATE_TOKEN) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = new Date().toISOString();
  await env.DB.exec(SCHEMA);
  const last = await env.DB.prepare(
    'SELECT ip FROM ip_history ORDER BY id DESC LIMIT 1').first();
  const changed = !last || last.ip !== ip;
  if (changed) {
    await env.DB.prepare(
      'INSERT INTO ip_history (ip, changed_at) VALUES (?, ?)').bind(ip, now).run();
  }
  await env.DB.prepare(
    `INSERT INTO kv (k, v) VALUES ('last_seen', ?)
     ON CONFLICT(k) DO UPDATE SET v=excluded.v`).bind(now).run();
  await env.DB.prepare(
    `INSERT INTO kv (k, v) VALUES ('current_ip', ?)
     ON CONFLICT(k) DO UPDATE SET v=excluded.v`).bind(ip).run();
  return Response.json({ ok: true, ip, at: now, changed });
}
