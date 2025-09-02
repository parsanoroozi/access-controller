import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Account APIs
export const accountAPI = {
  getAll: (example = {}) => api.post("/accounts/findAll", example),
  getById: (id) => api.post("/accounts/findById", id),
  create: (account) => api.post("/accounts/create", account),
  update: (account) => api.post("/accounts/update", account),
  delete: (id) => api.delete(`/accounts/${id}`),
  authenticate: (request) => api.post("/accounts/authenticate", request),
  checkAccess: (request) => api.post("/accounts/check-access", request),
};

// Client APIs
export const clientAPI = {
  getAll: (example = {}) => api.post("/clients/findAll", example),
  getById: (id) => api.post("/clients/findById", id),
  create: (client) => api.post("/clients/create", client),
  update: (client) => api.post("/clients/update", client),
  delete: (id) => api.delete(`/clients/${id}`),
};

// Role APIs
export const roleAPI = {
  getAll: (example = {}) => api.post("/roles/findAll", example),
  getById: (id) => api.post("/roles/findById", id),
  create: (role) => api.post("/roles/create", role),
  update: (role) => api.post("/roles/update", role),
  delete: (id) => api.delete(`/roles/${id}`),
};

// Resource APIs
export const resourceAPI = {
  getAll: (example = {}) => api.post("/resources/findAll", example),
  getById: (id) => api.post("/resources/findById", id),
  create: (resource) => api.post("/resources/create", resource),
  update: (resource) => api.post("/resources/update", resource),
  delete: (id) => api.delete(`/resources/${id}`),
};

export default api;
