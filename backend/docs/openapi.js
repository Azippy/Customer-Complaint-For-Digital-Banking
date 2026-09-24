const openapiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Customer Complaint API",
    version: "1.0.0",
    description:
      "Role-based customer complaint management API. Use the Authorize button to provide a JWT as `Bearer <token>` for protected endpoints.",
  },
  servers: [
    {
      url: "http://localhost:{port}",
      description: "Local development server",
      variables: {
        port: {
          default: "5000",
        },
      },
    },
  ],
  tags: [
    { name: "System" },
    { name: "Authentication" },
    { name: "User Complaints" },
    { name: "Admin" },
    { name: "Handler" },
    { name: "Comments" },
    { name: "Notifications" },
    { name: "Audit History" },
    { name: "Dashboards" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter the JWT returned by register or login.",
      },
    },
    parameters: {
      ComplaintId: {
        name: "id",
        in: "path",
        required: true,
        description: "Human-readable complaint ID, for example CMP-2026-00010.",
        schema: { type: "string", example: "CMP-2026-00010" },
      },
      MongoId: {
        name: "id",
        in: "path",
        required: true,
        description: "MongoDB ObjectId.",
        schema: {
          type: "string",
          pattern: "^[a-fA-F0-9]{24}$",
          example: "507f1f77bcf86cd799439011",
        },
      },
      Page: {
        name: "page",
        in: "query",
        schema: { type: "integer", minimum: 1, default: 1 },
      },
      UserLimit: {
        name: "limit",
        in: "query",
        schema: { type: "integer", minimum: 1, maximum: 50, default: 10 },
      },
      AdminLimit: {
        name: "limit",
        in: "query",
        schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
      },
      Status: {
        name: "status",
        in: "query",
        schema: {
          type: "string",
          enum: [
            "PENDING",
            "ASSIGNED",
            "IN_PROGRESS",
            "RESOLVED",
            "REJECTED",
            "CLOSED",
          ],
        },
      },
      Category: {
        name: "category",
        in: "query",
        schema: {
          type: "string",
          enum: ["PAYMENT", "ACCOUNT", "TECHNICAL", "SERVICE", "OTHER"],
        },
      },
      Priority: {
        name: "priority",
        in: "query",
        schema: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "URGENT"] },
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "507f1f77bcf86cd799439011" },
          firstName: { type: "string", example: "Ada" },
          lastName: { type: "string", example: "Lovelace" },
          email: {
            type: "string",
            format: "email",
            example: "ada@example.com",
          },
          role: {
            type: "string",
            enum: ["USER", "HANDLER", "ADMIN"],
            example: "USER",
          },
          isActive: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Login successful" },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Complaint: {
        type: "object",
        properties: {
          _id: { type: "string", example: "507f1f77bcf86cd799439011" },
          complaintId: { type: "string", example: "CMP-2026-00010" },
          title: { type: "string", example: "Payment was charged twice" },
          description: {
            type: "string",
            example: "My account shows two charges for the same transaction.",
          },
          category: {
            type: "string",
            enum: ["PAYMENT", "ACCOUNT", "TECHNICAL", "SERVICE", "OTHER"],
          },
          priority: {
            type: "string",
            enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
          },
          status: {
            type: "string",
            enum: [
              "PENDING",
              "ASSIGNED",
              "IN_PROGRESS",
              "RESOLVED",
              "REJECTED",
              "CLOSED",
            ],
          },
          submittedBy: {
            oneOf: [{ type: "string" }, { $ref: "#/components/schemas/User" }],
          },
          assignedTo: {
            nullable: true,
            oneOf: [{ type: "string" }, { $ref: "#/components/schemas/User" }],
          },
          assignedAt: { type: "string", format: "date-time", nullable: true },
          resolution: { type: "string", nullable: true },
          resolvedAt: { type: "string", format: "date-time", nullable: true },
          rejectionReason: { type: "string", nullable: true },
          closedAt: { type: "string", format: "date-time", nullable: true },
          statusHistory: {
            type: "array",
            items: { $ref: "#/components/schemas/StatusHistory" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      StatusHistory: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: [
              "PENDING",
              "ASSIGNED",
              "IN_PROGRESS",
              "RESOLVED",
              "REJECTED",
              "CLOSED",
            ],
          },
          changedBy: {
            oneOf: [{ type: "string" }, { $ref: "#/components/schemas/User" }],
          },
          note: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CommentAttachment: {
        type: "object",
        properties: {
          url: { type: "string", format: "uri" },
          publicId: { type: "string" },
          originalName: { type: "string" },
          fileType: { type: "string" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          _id: { type: "string" },
          complaint: { type: "string" },
          user: {
            oneOf: [{ type: "string" }, { $ref: "#/components/schemas/User" }],
          },
          message: { type: "string" },
          attachments: {
            type: "array",
            items: { $ref: "#/components/schemas/CommentAttachment" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          _id: { type: "string" },
          recipient: { type: "string" },
          complaint: { type: "string", nullable: true },
          type: { type: "string" },
          title: { type: "string" },
          message: { type: "string" },
          isRead: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AuditLog: {
        type: "object",
        properties: {
          _id: { type: "string" },
          complaint: { type: "string" },
          user: {
            oneOf: [{ type: "string" }, { $ref: "#/components/schemas/User" }],
          },
          action: { type: "string" },
          oldStatus: { type: "string", nullable: true },
          newStatus: { type: "string", nullable: true },
          description: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Pagination: {
        type: "object",
        properties: {
          total: { type: "integer", example: 12 },
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          totalPages: { type: "integer", example: 2 },
          hasNextPage: { type: "boolean" },
          hasPreviousPage: { type: "boolean" },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Resource not found" },
          errors: { type: "array", items: { type: "object" } },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Missing, invalid, or expired JWT.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
      Forbidden: {
        description:
          "Authenticated user does not have the required role or access.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
      NotFound: {
        description: "Requested resource was not found.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
      ValidationError: {
        description: "Request validation failed.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
      ServerError: {
        description: "Unexpected server or database error.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["System"],
        summary: "Check that the API is running",
        responses: {
          200: {
            description: "API is running.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string" } },
                },
              },
            },
          },
        },
      },
    },
    "/api/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        responses: {
          200: {
            description: "Healthy API.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["firstName", "lastName", "email", "password"],
                properties: {
                  firstName: { type: "string", minLength: 2, maxLength: 50 },
                  lastName: { type: "string", minLength: 2, maxLength: 50 },
                  email: { type: "string", format: "email" },
                  password: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                    maxLength: 128,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Registered successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          409: { description: "Email already exists." },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Log in",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Logged in successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get the current user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Current user.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { user: { $ref: "#/components/schemas/User" } },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/complaints": {
      post: {
        tags: ["User Complaints"],
        summary: "Create a complaint",
        description:
          "Requires the USER role. Priority should be sent in uppercase.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description", "category", "priority"],
                properties: {
                  title: { type: "string", minLength: 5, maxLength: 150 },
                  description: {
                    type: "string",
                    minLength: 10,
                    maxLength: 5000,
                  },
                  category: {
                    type: "string",
                    enum: [
                      "PAYMENT",
                      "ACCOUNT",
                      "TECHNICAL",
                      "SERVICE",
                      "OTHER",
                    ],
                  },
                  priority: {
                    type: "string",
                    enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
                    default: "MEDIUM",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Complaint created.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    complaint: { $ref: "#/components/schemas/Complaint" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/complaints/my": {
      get: {
        tags: ["User Complaints"],
        summary: "List the current user's complaints",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/UserLimit" },
          { $ref: "#/components/parameters/Status" },
          { $ref: "#/components/parameters/Category" },
          { $ref: "#/components/parameters/Priority" },
        ],
        responses: {
          200: {
            description: "Complaint list.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    complaints: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Complaint" },
                    },
                    pagination: { $ref: "#/components/schemas/Pagination" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/complaints/{id}": {
      get: {
        tags: ["User Complaints"],
        summary: "Get one complaint",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/ComplaintId" }],
        responses: {
          200: {
            description: "Complaint details.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    complaint: { $ref: "#/components/schemas/Complaint" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/complaints/{id}/close": {
      patch: {
        tags: ["User Complaints"],
        summary: "Close a resolved complaint",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/ComplaintId" }],
        responses: {
          200: {
            description: "Complaint closed.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    complaint: { $ref: "#/components/schemas/Complaint" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/admin/complaints": {
      get: {
        tags: ["Admin"],
        summary: "List all complaints",
        description: "Requires the ADMIN role.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/AdminLimit" },
          { name: "search", in: "query", schema: { type: "string" } },
          { $ref: "#/components/parameters/Status" },
          { $ref: "#/components/parameters/Priority" },
          { $ref: "#/components/parameters/Category" },
          { name: "assignedTo", in: "query", schema: { type: "string" } },
          {
            name: "sortBy",
            in: "query",
            schema: { type: "string", default: "createdAt" },
          },
          {
            name: "sortOrder",
            in: "query",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
          },
        ],
        responses: {
          200: {
            description: "Complaint list.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Complaint" },
                    },
                    pagination: { $ref: "#/components/schemas/Pagination" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/admin/complaints/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Get a complaint as an admin",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/ComplaintId" }],
        responses: {
          200: {
            description: "Complaint details.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    complaint: { $ref: "#/components/schemas/Complaint" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/admin/complaints/{id}/assign": {
      patch: {
        tags: ["Admin"],
        summary: "Assign a complaint to a handler",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/ComplaintId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["handlerId"],
                properties: {
                  handlerId: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Complaint assigned.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    complaint: { $ref: "#/components/schemas/Complaint" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/admin/complaints/{id}/reject": {
      patch: {
        tags: ["Admin"],
        summary: "Reject a complaint",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/ComplaintId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["reason"],
                properties: {
                  reason: { type: "string", minLength: 5, maxLength: 1000 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Complaint rejected.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    complaint: { $ref: "#/components/schemas/Complaint" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/handler/complaints": {
      get: {
        tags: ["Handler"],
        summary: "List assigned complaints",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/UserLimit" },
          { $ref: "#/components/parameters/Status" },
          { $ref: "#/components/parameters/Priority" },
          { $ref: "#/components/parameters/Category" },
        ],
        responses: {
          200: {
            description: "Assigned complaint list.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    complaints: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Complaint" },
                    },
                    pagination: { $ref: "#/components/schemas/Pagination" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/handler/complaints/{id}": {
      get: {
        tags: ["Handler"],
        summary: "Get an assigned complaint",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/ComplaintId" }],
        responses: {
          200: {
            description: "Complaint details.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    complaint: { $ref: "#/components/schemas/Complaint" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/handler/complaints/{id}/status": {
      patch: {
        tags: ["Handler"],
        summary: "Move an assigned complaint to in progress",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/ComplaintId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["IN_PROGRESS"] },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Status updated.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    complaint: { $ref: "#/components/schemas/Complaint" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/handler/complaints/{id}/resolve": {
      patch: {
        tags: ["Handler"],
        summary: "Resolve a complaint",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/ComplaintId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["resolution"],
                properties: {
                  resolution: { type: "string", minLength: 5, maxLength: 5000 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Complaint resolved.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    complaint: { $ref: "#/components/schemas/Complaint" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/complaints/{id}/comments": {
      get: {
        tags: ["Comments"],
        summary: "List complaint comments",
        description:
          "Here `id` is the MongoDB Complaint _id, not the human-readable complaintId.",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/MongoId" }],
        responses: {
          200: {
            description: "Comments.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Comment" },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
      post: {
        tags: ["Comments"],
        summary: "Add a comment with optional attachments",
        description:
          "Here `id` is the MongoDB Complaint _id. Maximum 5 files, 5 MB each. Allowed types: JPEG, PNG, WebP, PDF.",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/MongoId" }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  message: { type: "string" },
                  attachments: {
                    type: "array",
                    maxItems: 5,
                    items: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Comment created.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Comment" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "List notifications",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/Page" },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          },
          {
            name: "unreadOnly",
            in: "query",
            schema: { type: "boolean", default: false },
          },
        ],
        responses: {
          200: {
            description: "Notifications.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Notification" },
                    },
                    unreadCount: { type: "integer" },
                    pagination: { $ref: "#/components/schemas/Pagination" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/notifications/read-all": {
      patch: {
        tags: ["Notifications"],
        summary: "Mark all notifications as read",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Notifications marked as read." },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/notifications/{id}/read": {
      patch: {
        tags: ["Notifications"],
        summary: "Mark one notification as read",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/MongoId" }],
        responses: {
          200: {
            description: "Notification marked as read.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Notification" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/complaints/{id}/history": {
      get: {
        tags: ["Audit History"],
        summary: "Get complaint audit history",
        description:
          "Here `id` is the MongoDB Complaint _id, not the human-readable complaintId.",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/MongoId" }],
        responses: {
          200: {
            description: "Audit history.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/AuditLog" },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/admin/dashboard": {
      get: {
        tags: ["Dashboards"],
        summary: "Get admin dashboard statistics",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Admin dashboard data." },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/handler/dashboard": {
      get: {
        tags: ["Dashboards"],
        summary: "Get handler dashboard statistics",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Handler dashboard data." },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/user/dashboard": {
      get: {
        tags: ["Dashboards"],
        summary: "Get user dashboard statistics",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User dashboard data." },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
  },
};

module.exports = openapiDocument;
