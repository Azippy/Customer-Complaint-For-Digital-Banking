# Customer Complaint API

Backend API for a role-based customer complaint management system. Users submit and track complaints, admins assign or reject them, and handlers process and resolve assigned complaints.

## Features

- JWT authentication with `USER`, `HANDLER`, and `ADMIN` roles
- Complaint creation, filtering, status transitions, assignment, rejection, and closure
- Comments, notifications, and audit history
- Email notifications through SMTP
- Cloudinary configuration for upload-related features
- Helmet, CORS, request rate limiting, validation, and Morgan request logging

## Requirements

- Node.js 18 or newer
- MongoDB
- SMTP credentials for email notifications
- Cloudinary credentials if upload features are enabled

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   copy .env.example .env
   ```

   On macOS or Linux, use `cp .env.example .env`.

3. Replace every placeholder in `.env` with local credentials. Never commit `.env`.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Or start it normally:

   ```bash
   npm start
   ```

The API runs on `http://localhost:5000` by default. Set `PORT` to use another port.

## Swagger API Documentation

Start the backend, then open the interactive API documentation at:

```text
http://localhost:5000/api/docs
```

The raw OpenAPI document is available at:

```text
http://localhost:5000/api/docs.json
```

For protected endpoints, call `POST /api/auth/login`, copy the returned token,
select **Authorize** in Swagger UI, and enter `Bearer <token>`. Swagger documents
the required role for each operation and includes request bodies, path/query
parameters, multipart uploads, response schemas, and common error responses.

## Environment Variables

| Variable                | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `PORT`                  | HTTP server port                          |
| `MONGO_URI`             | MongoDB connection string                 |
| `JWT_SECRET`            | Secret used to sign and verify JWTs       |
| `JWT_EXPIRES_IN`        | JWT lifetime, such as `7d`                |
| `EMAIL_HOST`            | SMTP server hostname                      |
| `EMAIL_PORT`            | SMTP server port, normally `587` or `465` |
| `EMAIL_USER`            | SMTP username                             |
| `EMAIL_PASS`            | SMTP password or provider app password    |
| `EMAIL_FROM`            | Sender address                            |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                     |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                        |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                     |

For Gmail SMTP, use an App Password rather than your normal account password.

## Scripts

| Command                | Description                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Start with Nodemon                                               |
| `npm start`            | Start the API                                                    |
| `npm run create-admin` | Create an administrator using the script's prompts/configuration |

## Authentication

Login returns a JWT. Send it on protected requests as:

```text
Authorization: Bearer <token>
```

Role access is enforced by middleware:

- `USER`: create and manage your own complaints
- `HANDLER`: view assigned complaints and update or resolve them
- `ADMIN`: view all complaints and assign or reject them

## API Endpoints

The server prefixes routes as shown below. Protected endpoints require a valid JWT and some require a specific role.

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Complaints

- `POST /api/complaints` - user creates a complaint
- `GET /api/complaints/my` - user lists their complaints
- `GET /api/complaints/:id` - user views a complaint
- `PATCH /api/complaints/:id/close` - user closes a resolved complaint

### Admin

- `GET /api/admin/complaints`
- `GET /api/admin/complaints/:id`
- `PATCH /api/admin/complaints/:id/assign`
- `PATCH /api/admin/complaints/:id/reject`
- `GET /api/admin/dashboard`

### Handler

- `GET /api/handler/complaints`
- `GET /api/handler/complaints/:id`
- `PATCH /api/handler/complaints/:id/status`
- `PATCH /api/handler/complaints/:id/resolve`
- `GET /api/handler/dashboard`

### Comments, notifications, and audit history

- `GET /api/complaints/:id/comments`
- `POST /api/complaints/:id/comments`
- `GET /api/notifications`
- `PATCH /api/notifications/read-all`
- `PATCH /api/notifications/:id/read`
- `GET /api/complaints/:id/history`

### Health check

- `GET /api/health`

## Complaint Status Flow

```text
PENDING -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED
PENDING -> REJECTED
```

## Security Notes

- `.env` and other environment files are ignored by Git; only `.env.example` is intended to be committed.
- Do not place passwords, API keys, JWT secrets, or database credentials in source code, README files, screenshots, or Postman collections.
- If a secret has been exposed, revoke or rotate it immediately and replace it in the local `.env` file.
- Use a strong, unique `JWT_SECRET` in every environment.

## Project Structure

```text
backend/
├── config/          Database and third-party service configuration
├── controllers/     Request handlers
├── middleware/      Authentication, authorization, and validation
├── models/          Mongoose models
├── routes/          Express route definitions
├── scripts/         Maintenance and setup scripts
├── services/        Complaint, email, and notification logic
├── utils/           Shared helpers
├── docs/             OpenAPI document used by Swagger UI
├── .env.example     Safe environment template
├── server.js        Application entry point
└── package.json     Scripts and dependencies
```
