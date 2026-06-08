const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new ApiError(data?.message || 'Request failed', response.status, data);
  }

  return data;
}

export const api = {
  getStats: () => request('/stats'),
  getActivities: (search = '') => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/activities${params}`);
  },
  getAnalytics: (period = '7d') => request(`/analytics?period=${period}`),
  getProfile: () => request('/settings/profile'),
  updateProfile: (body) => request('/settings/profile', { method: 'PUT', body: JSON.stringify(body) }),
  getPreferences: () => request('/settings/preferences'),
  updatePreferences: (body) => request('/settings/preferences', { method: 'PUT', body: JSON.stringify(body) }),
};

export { ApiError };
