# Customer Complaint Management System

A full-stack customer complaint management system. Customers submit and track complaints, administrators manage and assign complaints, and handlers process complaints through resolution.

## Application Overview

The project contains two applications:

- `backend/` - Express API with MongoDB, JWT authentication, role-based access control, notifications, comments, audit history, email, and Cloudinary uploads.
- `frontend/` - React and Vite single-page application with role-specific dashboards and complaint workflows.

## Main Features

- User registration, login, and authenticated sessions
- Role-based access for `USER`, `HANDLER`, and `ADMIN`
- Complaint creation, filtering, tracking, assignment, rejection, resolution, and closure
- Complaint comments and activity history
- In-app notifications
- Admin and handler dashboards
- JWT authentication
- Request validation and centralized error handling
- Consistent `AppError` responses with field-level validation details
- File uploads through Cloudinary
- Email notifications through SMTP
- Swagger API documentation
- Security middleware with Helmet, CORS, rate limiting, and Morgan logging

## Technology Stack

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Recharts
- Lucide React

### Backend

- Node.js 18 or newer
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens
- bcryptjs
- Nodemailer
- Cloudinary
- Multer
- Swagger UI and OpenAPI

## Requirements

For local development:

- Node.js 18 or newer
- npm
- A MongoDB database, local or MongoDB Atlas
- SMTP credentials if email notifications are enabled
- Cloudinary credentials if file uploads are enabled

For Docker development:

- Docker Desktop with Docker Compose

## Project Structure

```text
customer-complaint/
├── backend/
│   ├── config/              Database and third-party configuration
│   ├── controllers/         API request handlers
│   ├── docs/                OpenAPI and Swagger configuration
│   ├── middleware/          Authentication, roles, uploads, validation, errors
│   ├── models/              MongoDB models
│   ├── routes/              Express route definitions
│   ├── scripts/             Administrative scripts
│   ├── services/            Complaint, email, notification, and audit services
│   ├── utils/               Shared utilities
│   ├── validators/          Request validators
│   ├── .env.example         Backend environment template
│   ├── package.json         Backend scripts and dependencies
│   └── server.js            Backend entry point
├── frontend/
│   ├── public/              Public frontend assets
│   ├── src/                 React components, pages, API client, and context
│   ├── .base44/             Base44 development configuration
│   ├── coding-guildline.md   Base44 development and verification notes
│   ├── .gitignore           Frontend ignore rules
│   ├── docker-compose.base44.yml  Docker Compose configuration
│   ├── package.json         Frontend scripts and dependencies
│   └── vite.config.js       Vite and API proxy configuration
└── README.md
```

## Environment Configuration

### Backend

Create the backend environment file from the template.

PowerShell:

```powershell
cd C:\Users\user\Desktop\customer-complaint\backend
Copy-Item .env.example .env
```

Git Bash:

```bash
cd /c/Users/user/Desktop/customer-complaint/backend
cp .env.example .env
```

Set the values in `backend/.env`:

| Variable                | Purpose                               |
| ----------------------- | ------------------------------------- |
| `PORT`                  | Backend port, normally `5000`         |
| `MONGO_URI`             | MongoDB connection string             |
| `JWT_SECRET`            | Secret used to sign JWTs              |
| `JWT_EXPIRES_IN`        | JWT lifetime, such as `7d`            |
| `EMAIL_HOST`            | SMTP host, such as `smtp.gmail.com`   |
| `EMAIL_PORT`            | SMTP port, normally `587` or `465`    |
| `EMAIL_USER`            | SMTP username                         |
| `EMAIL_PASS`            | SMTP password or app password         |
| `EMAIL_FROM`            | Sender email address                  |
| `FRONTEND_URL`          | Frontend base URL used in reset links |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                 |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                    |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                 |

For local development, the frontend uses relative `/api` requests and Vite proxies them to `http://localhost:5000`. For Vercel production builds, set `VITE_API_URL` to the public backend URL followed by `/api`, for example `https://your-backend.onrender.com/api`.

## Local Development

Install dependencies and start the backend:

```powershell
cd C:\Users\user\Desktop\customer-complaint\backend
npm install
npm run dev
```

In a second terminal, install dependencies and start the frontend:

```powershell
cd C:\Users\user\Desktop\customer-complaint\frontend
npm install
npm run dev
```

Git Bash users can use:

```bash
cd /c/Users/user/Desktop/customer-complaint/backend
npm install
npm run dev
```

and in a second terminal:

```bash
cd /c/Users/user/Desktop/customer-complaint/frontend
npm install
npm run dev
```

Open the frontend at:

```text
http://localhost:3000
```

The backend runs at:

```text
http://localhost:5000
```

The backend must be running before registering or logging in through the frontend.

### Vercel Deployment

In the Vercel project settings, add this environment variable for the Production environment:

```text
VITE_API_URL=https://your-backend.onrender.com/api
```

Replace the URL with the actual public backend URL, then redeploy the frontend. The backend must also allow the Vercel frontend origin through CORS.

## Docker Development

Docker Compose is located in `frontend/docker-compose.base44.yml` because the frontend is the main Compose working directory. From PowerShell:

```powershell
cd C:\Users\user\Desktop\customer-complaint\frontend
docker compose -f .\docker-compose.base44.yml up -d
```

From Git Bash:

```bash
cd /c/Users/user/Desktop/customer-complaint/frontend
docker compose -f docker-compose.base44.yml up -d
```

This starts:

- MongoDB on the internal Docker network
- The backend API on port `5000`
- The Vite frontend on port `3000`

Stop the containers with:

```bash
docker compose -f docker-compose.base44.yml down
```

Docker Desktop must be installed and running. If `docker` is not recognized, install Docker Desktop and open a new terminal after installation.

## Available npm Scripts

### Backend

Run these commands from `backend/`:

| Command                | Description                           |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start the backend with Nodemon        |
| `npm start`            | Start the backend normally            |
| `npm run create-admin` | Run the administrator creation script |

### Frontend

Run these commands from `frontend/`:

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Create a production build            |
| `npm run preview` | Preview the production build locally |

## API Documentation

After starting the backend, open Swagger UI at:

```text
http://localhost:5000/api/docs
```

The raw OpenAPI document is available at:

```text
http://localhost:5000/api/docs.json
```

Health check:

```text
GET http://localhost:5000/api/health
```

## Validation and Error Handling

- Registration passwords must contain between 8 and 20 characters.
- Invalid request data, authorization failures, missing resources, and invalid status transitions throw `AppError` and use the centralized error handler.
- Validation responses include a readable `message` and an `errors` array with the affected field, message, and request location.
- Unexpected controller and service failures are forwarded to the centralized error middleware instead of returning generic responses from individual controllers.

## API Endpoints

Protected endpoints require a valid JWT. Send the token as:

```text
Authorization: Bearer <token>
```

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`

Password reset flow:

1. Request a reset link with `POST /api/auth/forgot-password` and an email in the request body.
2. Open the emailed link, or copy the token from the URL after `/reset-password/`.
3. Submit the new password to `POST /api/auth/reset-password/:token`.

Example request body:

```json
{
  "password": "NewPassword123"
}
```

### User Complaints

- `POST /api/complaints`
- `GET /api/complaints/my`
- `GET /api/complaints/:id`
- `PATCH /api/complaints/:id/close`

### Administration

- `GET /api/admin/complaints`
- `GET /api/admin/complaints/:id`
- `PATCH /api/admin/complaints/:id/assign`
- `PATCH /api/admin/complaints/:id/reject`
- `GET /api/admin/dashboard`
- `GET /api/admin/handlers`

### Handler Workflow

- `GET /api/handler/complaints`
- `GET /api/handler/complaints/:id`
- `PATCH /api/handler/complaints/:id/status`
- `PATCH /api/handler/complaints/:id/resolve`
- `GET /api/handler/dashboard`

### Comments, Notifications, and Audit History

- `GET /api/complaints/:id/comments`
- `POST /api/complaints/:id/comments`
- `GET /api/notifications`
- `PATCH /api/notifications/read-all`
- `PATCH /api/notifications/:id/read`
- `GET /api/complaints/:id/history`

## Roles

### USER

- Register and log in
- Submit complaints
- View personal complaints
- Add comments
- Close complaints after they are resolved

### HANDLER

- View assigned complaints
- Update complaint status
- Add comments
- Resolve assigned complaints
- View handler dashboard information

### ADMIN

- View all complaints
- Assign complaints to handlers
- Reject complaints
- View admin dashboard information
- Manage the complaint workflow

## Complaint Status Flow

```text
PENDING -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED
PENDING -> REJECTED
```

## Email Notifications

- New complaints notify active administrators by email.
- Assigning a complaint notifies the assigned handler and complaint owner.
- Status changes, comments, resolutions, and rejections notify the relevant participants.
- Complaint emails and in-app event notifications are dispatched in the background so SMTP latency does not block complaint, comment, assignment, or status-change responses.
- Gmail SMTP requires an App Password when two-step verification is enabled.
- Delivery depends on the recipient email stored in the user account; check Spam or Promotions if a message is not visible.

## Security and Git Guidance

Never commit secrets. The following files and folders should remain ignored:

- `.env` files
- `node_modules/`
- Frontend `dist/` output
- npm debug logs

The backend and frontend each have a `.gitignore` file. If both applications are combined into one GitHub repository, a root `.gitignore` can also be used for shared rules.

If a MongoDB password, JWT secret, SMTP password, Cloudinary secret, or other credential is exposed, revoke or rotate it immediately and replace it in the local environment file.

## Troubleshooting

### `docker` is not recognized

Docker Desktop is not installed, is not running, or is not available in the terminal `PATH`. Start Docker Desktop and open a new terminal. For local development, Docker is optional; run the backend and frontend with npm instead.

### Vite proxy error: `getaddrinfo ENOTFOUND api`

The Vite proxy was configured with a Docker-only hostname. Local development should use:

```text
target: http://localhost:5000
```

This is configured in `frontend/vite.config.js`.

### Vite proxy error: `ECONNREFUSED`

The frontend cannot connect to the backend. Make sure the backend is running and listening on port `5000` before making API requests.

### MongoDB `querySrv ECONNREFUSED`

This is usually a DNS resolver problem when using a MongoDB Atlas `mongodb+srv://` URI. Check your network, VPN, proxy, or DNS configuration. Public DNS resolvers such as `1.1.1.1` or `8.8.8.8` can help diagnose the issue.

### Registration fails from the frontend

Check these items:

1. The backend is running.
2. MongoDB is connected successfully.
3. The frontend is running on port `3000`.
4. `frontend/vite.config.js` targets `http://localhost:5000` for local development.
5. The browser is using the current Vite server after any configuration change.

## License

This project currently uses the license declared in the backend package configuration.
