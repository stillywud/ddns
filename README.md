# ddns

家庭公网 IP 监控（Cloudflare Pages + Functions + D1 的简化版 DDNS）。

## API

- `GET /api/update?token=xxx` — 上报 IP（路由器每分钟 curl 一次；IP 取自 CF-Connecting-IP）
- `GET /api/latest` — 最新 IP + 最后上报时间
- `GET /api/history?limit=100` — IP 变更历史

## 环境要求

- D1 数据库绑定，变量名 `DB`
- 环境变量 `UPDATE_TOKEN`（生产环境）
