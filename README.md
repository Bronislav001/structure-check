# Struct Check — Monorepo (LR2 + LR3)

Этот репозиторий содержит:
- `server/` — ЛР‑2: Express‑сервер (health, auth, reports, validate stub)
- `client/` — ЛР‑3: React/Vite SPA (Эталон, Проверка, Регистрация, Вход)

## Быстрый старт (из корня monorepo)

```bash
npm install                 # установит зависимости и для workspaces
cp server/.env.example server/.env
cp client/.env.example client/.env

npm run dev                 # поднимет сервер (8080) и клиент (5173)
```
