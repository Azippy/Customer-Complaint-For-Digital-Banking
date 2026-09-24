# Base44 development notes

- Use the root `docker-compose.base44.yml`; it starts MongoDB, the Express API, and Vite from bind-mounted source. The older compose file under `frontend/` is not the canonical Base44 runbook.
- Vite routes relative `/api` calls to the local API using `VITE_PROXY_TARGET=http://api:5000` in Compose; without it, local non-Docker development uses localhost:5000.
- The platform supplies `JWT_SECRET` via `/run/base44/app.env`; do not copy it into the repo. SMTP and Cloudinary values are optional for basic preview, but email delivery and attachments respectively require real credentials.
- Verify with `curl http://localhost:3000/` and `curl http://localhost:3000/api/health`; the latter must report success and the API logs should report MongoDB connected. Registration can then be tested through the UI.
