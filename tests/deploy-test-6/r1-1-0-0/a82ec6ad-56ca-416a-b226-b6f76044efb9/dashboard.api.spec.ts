import { test, expect } from '@playwright/test';
import { dashboardData } from '../../../fixtures/mock-data/dashboard.data';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

test.describe('Dashboard > API Mock Tests', () => {
  test('renders data correctly on API success (200)', async ({ page }) => {
    await page.route(dashboardData.api.statsEndpoint, (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(dashboardData.valid.stats),
      })
    );
    await page.route(dashboardData.api.activitiesEndpoint, (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(dashboardData.valid.activities),
      })
    );
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByText('Sarah Chen')).toBeVisible();
    await expect(page.getByText('12,847')).toBeVisible();
  });

  test('falls back to mock data on server error (500)', async ({ page }) => {
    await page.route(dashboardData.api.statsEndpoint, (route) =>
      route.fulfill({ status: 500, body: JSON.stringify({ message: 'Internal Server Error' }) })
    );
    await page.route(dashboardData.api.activitiesEndpoint, (route) =>
      route.fulfill({ status: 500, body: JSON.stringify({ message: 'Internal Server Error' }) })
    );
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByText('Total Users')).toBeVisible();
  });

  test('falls back on network failure', async ({ page }) => {
    await page.route(dashboardData.api.statsEndpoint, (route) => route.abort('failed'));
    await page.route(dashboardData.api.activitiesEndpoint, (route) => route.abort('failed'));
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByText('Total Users')).toBeVisible();
  });

  test('search filters activities via API query', async ({ page }) => {
    let capturedUrl = '';
    await page.route(dashboardData.api.statsEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(dashboardData.valid.stats) })
    );
    await page.route(dashboardData.api.activitiesEndpoint, async (route) => {
      capturedUrl = route.request().url();
      await route.fulfill({
        status: 200,
        body: JSON.stringify([dashboardData.valid.activities[0]]),
      });
    });
    await page.goto(`${BASE_URL}/`);
    await page.getByLabel(/search activity/i).fill(dashboardData.valid.searchQuery);
    await page.waitForTimeout(500);
    expect(capturedUrl).toContain('search=Sarah');
    await expect(page.getByText(dashboardData.valid.searchResult)).toBeVisible();
  });

  test('empty API response shows empty state UI', async ({ page }) => {
    await page.route(dashboardData.api.statsEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(dashboardData.valid.stats) })
    );
    await page.route(dashboardData.api.activitiesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(dashboardData.edge.emptyActivities) })
    );
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByText(/no activities found/i)).toBeVisible();
  });
});
