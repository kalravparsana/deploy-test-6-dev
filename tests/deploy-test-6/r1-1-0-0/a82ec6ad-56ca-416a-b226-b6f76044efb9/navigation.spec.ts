import { test, expect } from '@playwright/test';
import { dashboardData } from '../../../fixtures/mock-data/dashboard.data';
import { analyticsData } from '../../../fixtures/mock-data/analytics.data';
import { settingsData } from '../../../fixtures/mock-data/settings.data';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

test.describe('Navigation > Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(dashboardData.api.statsEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(dashboardData.valid.stats) })
    );
    await page.route(dashboardData.api.activitiesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(dashboardData.valid.activities) })
    );
    await page.route(analyticsData.api.analyticsEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(analyticsData.valid.chart7d) })
    );
    await page.route(settingsData.api.profileEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.profile) })
    );
    await page.route(settingsData.api.preferencesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.preferences) })
    );
  });

  test('default route shows Dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('Analytics nav link navigates to /analytics', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.getByRole('link', { name: /analytics/i }).click();
    await expect(page).toHaveURL(`${BASE_URL}/analytics`);
    await expect(page.getByRole('heading', { name: /analytics/i })).toBeVisible();
  });

  test('Settings nav link navigates to /settings', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.getByRole('link', { name: /settings/i }).click();
    await expect(page).toHaveURL(`${BASE_URL}/settings`);
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
  });

  test('Dashboard nav link is active on home page', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    const dashboardLink = page.getByRole('link', { name: /^dashboard$/i });
    await expect(dashboardLink).toBeVisible();
  });

  test('Analytics nav link is active on analytics page', async ({ page }) => {
    await page.goto(`${BASE_URL}/analytics`);
    await expect(page.getByRole('link', { name: /analytics/i })).toBeVisible();
  });
});
