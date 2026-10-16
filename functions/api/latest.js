// 返回最新 IP 及最后上报时间：GET /api/latest
export async function onRequest({ env }) {
  await env.DB.exec(`CREATE TABLE IF NOT EXISTS ip_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  changed_at TEXT NOT NULL
)`);
  await env.DB.exec(`CREATE TABLE IF NOT EXISTS kv (
  k TEXT PRIMARY KEY,
  v TEXT NOT NULL
)`);
  const row = await env.DB.prepare(
    'SELECT ip, changed_at FROM ip_history ORDER BY id DESC LIMIT 1').first();
  const seen = await env.DB.prepare(
    "SELECT v FROM kv WHERE k='last_seen'").first();
  return Response.json({
    ip: row ? row.ip : null,
    changed_at: row ? row.changed_at : null,
    last_seen: seen ? seen.v : null,
  });
}
