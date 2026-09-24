const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};

// Auth
export const authApi = {
  register: (body) => api.post("/auth/register", body),
  login: (body) => api.post("/auth/login", body),
  me: () => api.get("/auth/me"),
};

// Complaints (user)
export const userComplaintApi = {
  list: (params) => api.get(`/complaints/my?${new URLSearchParams(params)}`),
  get: (id) => api.get(`/complaints/${id}`),
  create: (body) => api.post("/complaints", body),
  close: (id) => api.patch(`/complaints/${id}/close`),
};

// Admin
export const adminApi = {
  dashboard: () => api.get("/admin/dashboard"),
  complaints: (params) =>
    api.get(`/admin/complaints?${new URLSearchParams(params)}`),
  complaint: (id) => api.get(`/admin/complaints/${id}`),
  assign: (id, handlerId) =>
    api.patch(`/admin/complaints/${id}/assign`, { handlerId }),
  reject: (id, reason) =>
    api.patch(`/admin/complaints/${id}/reject`, { reason }),
  handlers: () => api.get("/admin/handlers"),
};

// Handler
export const handlerApi = {
  dashboard: () => api.get("/handler/dashboard"),
  complaints: (params) =>
    api.get(`/handler/complaints?${new URLSearchParams(params)}`),
  complaint: (id) => api.get(`/handler/complaints/${id}`),
  startProgress: (id) =>
    api.patch(`/handler/complaints/${id}/status`, { status: "IN_PROGRESS" }),
  resolve: (id, resolution) =>
    api.patch(`/handler/complaints/${id}/resolve`, { resolution }),
};

// Comments
export const commentApi = {
  list: (complaintMongoId) =>
    api.get(`/complaints/${complaintMongoId}/comments`),
  create: (complaintMongoId, message) =>
    api.post(`/complaints/${complaintMongoId}/comments`, { message }),
};

// Notifications
export const notificationApi = {
  list: (params) =>
    api.get(`/notifications?${new URLSearchParams(params)}`),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch(`/notifications/read-all`),
};

// Audit history
export const auditApi = {
  history: (complaintMongoId) =>
    api.get(`/complaints/${complaintMongoId}/history`),
};

// User dashboard
export const userDashboardApi = {
  dashboard: () => api.get("/user/dashboard"),
};
