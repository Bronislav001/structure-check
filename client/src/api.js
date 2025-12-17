const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'omit',
    ...options
  });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) {
    const message = typeof data === 'string' ? data : data?.message || 'Request error';
    throw new Error(message);
  }
  return data;
}

export const api = {
  health: () => request('/api/health'),
  register: (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  templates: () => request('/api/reports/templates'),
  validate: (payload) => request('/api/reports/validate', { method: 'POST', body: JSON.stringify(payload) }),
};
