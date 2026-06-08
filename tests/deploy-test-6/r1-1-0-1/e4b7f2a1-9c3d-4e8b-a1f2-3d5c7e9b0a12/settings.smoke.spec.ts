import { test, expect } from '@playwright/test';
import { settingsData } from '../../../fixtures/mock-data/settings.data';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

test.describe('Settings > Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(settingsData.api.profileEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.profile) })
    );
    await page.route(settingsData.api.preferencesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.preferences) })
    );
    await page.goto(`${BASE_URL}/settings`);
    await page.waitForLoadState('networkidle');
  });

  test('page loads with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
  });

  test('profile section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/role/i)).toBeVisible();
  });

  test('save button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /save changes/i })).toBeVisible();
  });
});
