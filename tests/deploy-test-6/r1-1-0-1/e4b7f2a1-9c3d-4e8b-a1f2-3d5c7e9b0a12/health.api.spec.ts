import { test, expect } from '@playwright/test';

const API_BASE = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:3001/api';

test.describe('API > Health Endpoint', () => {
  test('GET /health returns ok status', async ({ request }) => {
    const healthUrl = API_BASE.replace(/\/api\/?$/, '') + '/health';
    const response = await request.get(healthUrl);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ status: 'ok' });
  });

  test('GET /stats returns array shape', async ({ request }) => {
    const response = await request.get(`${API_BASE}/stats`);
    if (response.status() === 200) {
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      if (body.length > 0) {
        expect(body[0]).toHaveProperty('label');
        expect(body[0]).toHaveProperty('value');
        expect(body[0]).toHaveProperty('trend');
      }
    }
  });

  test('GET /analytics?period=7d returns chart shape', async ({ request }) => {
    const response = await request.get(`${API_BASE}/analytics?period=7d`);
    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty('labels');
      expect(body).toHaveProperty('datasets');
      expect(Array.isArray(body.labels)).toBe(true);
      expect(Array.isArray(body.datasets)).toBe(true);
    }
  });
});
