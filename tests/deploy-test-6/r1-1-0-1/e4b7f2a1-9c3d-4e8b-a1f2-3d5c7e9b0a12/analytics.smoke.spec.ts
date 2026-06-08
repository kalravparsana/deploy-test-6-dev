import { test, expect } from '@playwright/test';
import { analyticsData } from '../../../fixtures/mock-data/analytics.data';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

test.describe('Analytics > Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(analyticsData.api.analyticsEndpoint, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(analyticsData.valid.chart7d),
      })
    );
    await page.goto(`${BASE_URL}/analytics`);
    await page.waitForLoadState('networkidle');
  });

  test('page loads with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /analytics/i })).toBeVisible();
  });

  test('period tabs are visible', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /7 days/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /30 days/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /90 days/i })).toBeVisible();
  });

  test('chart display renders', async ({ page }) => {
    await expect(page.getByTestId('chart-display')).toBeVisible();
    await expect(page.getByText('Performance Overview')).toBeVisible();
  });
});
