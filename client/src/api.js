async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch('/api' + path, {
    method,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'onegov' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* no body */ }
  if (!res.ok) {
    if (res.status === 401 && !path.startsWith('/auth/')) window.dispatchEvent(new Event('onegov:unauthorized'));
    const err = new Error(data?.error || 'Something went wrong. Please try again.');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  login: (body) => request('/auth/login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  forgot: (identifier) => request('/auth/forgot', { method: 'POST', body: { identifier } }),
  dashboard: () => request('/dashboard'),
  analytics: () => request('/analytics'),
  notifications: () => request('/notifications'),
  citizens: () => request('/citizens'),
  citizen: (id) => request('/citizens/' + encodeURIComponent(id)),
  search: (params) => request('/citizens/search?' + new URLSearchParams(params)),
  submitRequest: (body) => request('/requests', { method: 'POST', body }),
  citizenRequests: () => request('/citizen/requests'),
  submitCitizenRequest: (body) => request('/citizen/requests', { method: 'POST', body }),
  citizenRespond: (id, body) => request('/citizen/requests/' + encodeURIComponent(id) + '/respond', { method: 'POST', body }),
  deptRequests: () => request('/dept/requests'),
  sendDeptRequest: (body) => request('/dept/requests', { method: 'POST', body }),
  updateDeptRequest: (id, body) => request('/dept/requests/' + encodeURIComponent(id), { method: 'PATCH', body }),
};
