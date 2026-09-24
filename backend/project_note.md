# Complaint Management Portal

## Architecture

- **Backend**: Node.js/Express API (`server.js`) on internal port 5000. MongoDB via Mongoose.
- **Frontend**: React + Vite + Tailwind CSS SPA in `frontend/`, served on port 3000. Vite proxies `/api` to the backend.
- **Database**: MongoDB 7 (compose service `mongo`).

## Running

```bash
cd ../frontend
docker compose -f docker-compose.base44.yml up -d
```

- Frontend: http://localhost:3000
- API health: http://localhost:3000/api/health
- Swagger docs: http://localhost:3000/api/docs

## Services (`../frontend/docker-compose.base44.yml`)

- `mongo` — MongoDB 7 with healthcheck
- `api` — Backend (node:22, bind-mounted, nodemon live reload, port 5000 internal)
- `frontend` — Vite dev server (node:22, bind-mounted `./`, port 3000 mapped to host)

## Roles

- **USER**: Submit complaints, view own complaints, close resolved complaints, comment.
- **ADMIN**: View all complaints, assign to handlers, reject complaints, dashboard with charts.
- **HANDLER**: View assigned complaints, start progress, resolve, comment.

## Key env vars

- `MONGO_URI` — set inline in compose (local infra)
- `JWT_SECRET` — generated dev placeholder; user should replace for production
- `EMAIL_*` — optional, for SMTP email notifications
- `CLOUDINARY_*` — optional, for file upload features (comment attachments)

## Backend additions for frontend

- `GET /api/admin/handlers` — lists active HANDLER users (added to support the admin assign UI).

## Verification

1. `curl http://localhost:3000/` → 200 (Vite frontend)
2. `curl http://localhost:3000/api/health` → 200 JSON
3. Register a user via the UI → redirects to role-specific dashboard
4. Create a complaint (USER) → redirects to complaint detail with comments + activity timeline
