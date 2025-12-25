const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const code = data.code || 'HTTP_ERROR';
    const message = data.message || `HTTP ${res.status}`;
    const err = new Error(message);
    err.code = code;
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),

  createCheck: (token, payload) => request('/api/checks', { method: 'POST', token, body: payload }),
  listChecks: (token) => request('/api/checks', { token }),
  getCheck: (token, id) => request(`/api/checks/${id}`, { token }),
  patchCheck: (token, id, payload) => request(`/api/checks/${id}`, { method: 'PATCH', token, body: payload }),
  deleteCheck: (token, id) => request(`/api/checks/${id}`, { method: 'DELETE', token })
};
