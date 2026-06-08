import { test, expect } from '@playwright/test';
import { analyticsData } from '../../../fixtures/mock-data/analytics.data';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

test.describe('Analytics > API Mock Tests', () => {
  test('renders chart data on API success', async ({ page }) => {
    await page.route(analyticsData.api.analyticsEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(analyticsData.valid.chart7d) })
    );
    await page.goto(`${BASE_URL}/analytics`);
    await expect(page.getByText('Mon')).toBeVisible();
    await expect(page.getByText('Sun')).toBeVisible();
  });

  test('falls back to mock data on 500 error', async ({ page }) => {
    await page.route(analyticsData.api.analyticsEndpoint, (route) =>
      route.fulfill({ status: 500, body: JSON.stringify({ message: 'Error' }) })
    );
    await page.goto(`${BASE_URL}/analytics`);
    await expect(page.getByTestId('chart-display')).toBeVisible();
  });

  test('falls back on network failure', async ({ page }) => {
    await page.route(analyticsData.api.analyticsEndpoint, (route) => route.abort('failed'));
    await page.goto(`${BASE_URL}/analytics`);
    await expect(page.getByTestId('chart-display')).toBeVisible();
  });

  test('loading spinner shown during slow response', async ({ page }) => {
    await page.route(analyticsData.api.analyticsEndpoint, (route) =>
      new Promise((resolve) => setTimeout(() => resolve(route.continue()), 2000))
    );
    const gotoPromise = page.goto(`${BASE_URL}/analytics`);
    await expect(page.getByTestId('spinner')).toBeVisible();
    await gotoPromise;
  });
});
