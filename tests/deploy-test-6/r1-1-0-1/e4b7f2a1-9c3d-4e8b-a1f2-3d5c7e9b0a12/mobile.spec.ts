import { test, expect } from '@playwright/test';
import { dashboardData } from '../../../fixtures/mock-data/dashboard.data';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

const MOBILE_VIEWPORTS = [
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Android (360)', width: 360, height: 800 },
  { name: 'iPad', width: 768, height: 1024 },
];

for (const viewport of MOBILE_VIEWPORTS) {
  test.describe(`Dashboard > Mobile: ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeEach(async ({ page }) => {
      await page.route(dashboardData.api.statsEndpoint, (route) =>
        route.fulfill({ status: 200, body: JSON.stringify(dashboardData.valid.stats) })
      );
      await page.route(dashboardData.api.activitiesEndpoint, (route) =>
        route.fulfill({ status: 200, body: JSON.stringify(dashboardData.valid.activities) })
      );
      await page.goto(`${BASE_URL}/`);
      await page.waitForLoadState('networkidle');
    });

    test('page renders correctly on mobile viewport', async ({ page }) => {
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    });

    test('stat cards are visible on mobile', async ({ page }) => {
      await expect(page.getByText('Total Users')).toBeVisible();
    });

    test('search input is accessible on mobile', async ({ page }) => {
      const input = page.getByLabel(/search activity/i);
      await input.tap();
      await expect(input).toBeInViewport();
    });

    test('navigation links are visible on mobile', async ({ page }) => {
      await expect(page.getByRole('link', { name: /analytics/i })).toBeVisible();
    });
  });
}
