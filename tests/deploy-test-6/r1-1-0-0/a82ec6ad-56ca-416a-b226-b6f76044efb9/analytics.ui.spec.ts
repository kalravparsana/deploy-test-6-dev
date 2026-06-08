import { test, expect } from '@playwright/test';
import { analyticsData } from '../../../fixtures/mock-data/analytics.data';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

test.describe('Analytics > UI Rendering', () => {
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

  test('chart legend shows dataset labels', async ({ page }) => {
    await expect(page.getByText('Revenue')).toBeVisible();
    await expect(page.getByText('Users')).toBeVisible();
  });

  test('summary cards show totals', async ({ page }) => {
    await expect(page.getByText(/revenue total/i)).toBeVisible();
    await expect(page.getByText(/users total/i)).toBeVisible();
  });

  test('switching to 30 Days tab fetches new data', async ({ page }) => {
    let requestPeriod = '';
    await page.route(analyticsData.api.analyticsEndpoint, async (route) => {
      const url = new URL(route.request().url());
      requestPeriod = url.searchParams.get('period') || '';
      const data = requestPeriod === '30d' ? analyticsData.valid.chart30d : analyticsData.valid.chart7d;
      await route.fulfill({ status: 200, body: JSON.stringify(data) });
    });
    await page.goto(`${BASE_URL}/analytics`);
    await page.getByRole('tab', { name: /30 days/i }).click();
    await page.waitForTimeout(300);
    expect(requestPeriod).toBe('30d');
    await expect(page.getByText('Week 1')).toBeVisible();
  });

  test('active tab has selected state', async ({ page }) => {
    const tab7d = page.getByRole('tab', { name: /7 days/i });
    await expect(tab7d).toHaveAttribute('aria-selected', 'true');
  });
});
