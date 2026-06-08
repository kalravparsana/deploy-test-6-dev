import { test, expect } from '@playwright/test';
import { dashboardData } from '../../../fixtures/mock-data/dashboard.data';
import { settingsData } from '../../../fixtures/mock-data/settings.data';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

test.describe('Accessibility > Cross-Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(dashboardData.api.statsEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(dashboardData.valid.stats) })
    );
    await page.route(dashboardData.api.activitiesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(dashboardData.valid.activities) })
    );
    await page.route(settingsData.api.profileEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.profile) })
    );
    await page.route(settingsData.api.preferencesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.preferences) })
    );
  });

  test('dashboard has exactly one h1 heading', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    const h1Count = await page.getByRole('heading', { level: 1 }).count();
    expect(h1Count).toBe(1);
  });

  test('settings form fields have associated labels', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/role/i)).toBeVisible();
  });

  test('toggle switches have aria-checked attribute', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    const switches = page.getByRole('switch');
    const count = await switches.count();
    for (let i = 0; i < count; i++) {
      const checked = await switches.nth(i).getAttribute('aria-checked');
      expect(['true', 'false']).toContain(checked);
    }
  });

  test('navigation has aria-label', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
  });

  test('main landmark is present', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('error messages linked to inputs via aria-describedby on validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    await page.getByLabel(/name/i).fill('trigger');
    await page.getByLabel(/name/i).clear();
    await page.getByRole('button', { name: /save changes/i }).click();
    const inputWithError = page.locator('input[aria-describedby]');
    await expect(inputWithError.first()).toBeVisible();
  });
});
