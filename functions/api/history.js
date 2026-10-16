// 返回 IP 变更历史：GET /api/history?limit=100
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

export async function onRequest({ request, env }) {
  await env.DB.exec(SCHEMA);
  const n = Math.min(Math.max(
    parseInt(new URL(request.url).searchParams.get('limit') || '100', 10) || 100, 1), 500);
  const { results } = await env.DB.prepare(
    'SELECT ip, changed_at FROM ip_history ORDER BY id DESC LIMIT ?').bind(n).all();
  return Response.json({ history: results || [] });
}
