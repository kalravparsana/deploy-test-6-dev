import { test, expect } from '@playwright/test';
import { dashboardData } from '../../../fixtures/mock-data/dashboard.data';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

test.describe('Dashboard > UI Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(dashboardData.api.statsEndpoint, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(dashboardData.valid.stats),
      })
    );
    await page.route(dashboardData.api.activitiesEndpoint, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(dashboardData.valid.activities),
      })
    );
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
  });

  test('page header section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByText(/overview of your platform/i)).toBeVisible();
  });

  test('stat cards render with correct data', async ({ page }) => {
    await expect(page.getByText('Total Users')).toBeVisible();
    await expect(page.getByText('12,847')).toBeVisible();
    await expect(page.getByText('Revenue')).toBeVisible();
    await expect(page.getByText('$48,290')).toBeVisible();
  });

  test('activity list is visible with entries', async ({ page }) => {
    await expect(page.getByText('Recent Activity')).toBeVisible();
    await expect(page.getByText('Sarah Chen')).toBeVisible();
    await expect(page.getByText(/alpha launch/i)).toBeVisible();
  });

  test('search input is visible', async ({ page }) => {
    await expect(page.getByLabel(/search activity/i)).toBeVisible();
  });

  test('activity status badges are visible', async ({ page }) => {
    await expect(page.getByText('completed').first()).toBeVisible();
    await expect(page.getByText('pending')).toBeVisible();
  });

  test('empty state shown when no activities returned', async ({ page }) => {
    await page.route(dashboardData.api.activitiesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify([]) })
    );
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByText(/no activities found/i)).toBeVisible();
  });

  test('loading spinner shown before data loads', async ({ page }) => {
    await page.route(dashboardData.api.statsEndpoint, (route) =>
      new Promise((resolve) => setTimeout(() => resolve(route.continue()), 1500))
    );
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByTestId('spinner')).toBeVisible();
  });
});
