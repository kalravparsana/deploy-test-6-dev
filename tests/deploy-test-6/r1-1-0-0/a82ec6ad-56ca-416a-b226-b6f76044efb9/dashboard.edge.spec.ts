import { test, expect } from '@playwright/test';
import { dashboardData } from '../../../fixtures/mock-data/dashboard.data';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

test.describe('Dashboard > Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(dashboardData.api.statsEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(dashboardData.valid.stats) })
    );
  });

  test('handles extremely long action text without layout overflow', async ({ page }) => {
    await page.route(dashboardData.api.activitiesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(dashboardData.edge.longAction) })
    );
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByRole('main')).toBeVisible();
    const box = await page.getByRole('main').boundingBox();
    expect(box?.width).toBeLessThanOrEqual(1280);
  });

  test('single activity renders correctly', async ({ page }) => {
    await page.route(dashboardData.api.activitiesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(dashboardData.edge.singleActivity) })
    );
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByText('Test User')).toBeVisible();
    await expect(page.getByText('Single action')).toBeVisible();
  });

  test('browser back/forward navigation restores correct state', async ({ page }) => {
    await page.route(dashboardData.api.activitiesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(dashboardData.valid.activities) })
    );
    await page.goto(`${BASE_URL}/`);
    await page.getByRole('link', { name: /analytics/i }).click();
    await page.goBack();
    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });
});
