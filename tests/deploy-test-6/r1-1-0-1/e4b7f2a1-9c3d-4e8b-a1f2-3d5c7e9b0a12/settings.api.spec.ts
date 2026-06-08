import { test, expect } from '@playwright/test';
import { settingsData } from '../../../fixtures/mock-data/settings.data';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

test.describe('Settings > API Mock Tests', () => {
  test('renders profile data on API success', async ({ page }) => {
    await page.route(settingsData.api.profileEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.profile) })
    );
    await page.route(settingsData.api.preferencesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.preferences) })
    );
    await page.goto(`${BASE_URL}/settings`);
    await expect(page.getByLabel(/name/i)).toHaveValue(settingsData.valid.profile.name);
    await expect(page.getByLabel(/email/i)).toHaveValue(settingsData.valid.profile.email);
  });

  test('falls back to mock data on server error', async ({ page }) => {
    await page.route(settingsData.api.profileEndpoint, (route) =>
      route.fulfill({ status: 500, body: JSON.stringify({ message: 'Error' }) })
    );
    await page.route(settingsData.api.preferencesEndpoint, (route) =>
      route.fulfill({ status: 500, body: JSON.stringify({ message: 'Error' }) })
    );
    await page.goto(`${BASE_URL}/settings`);
    await expect(page.getByLabel(/name/i)).toHaveValue(settingsData.valid.profile.name);
  });

  test('correct request payload sent on form submit', async ({ page }) => {
    let capturedBody: Record<string, unknown> = {};
    await page.route(settingsData.api.profileEndpoint, async (route) => {
      if (route.request().method() === 'PUT') {
        capturedBody = JSON.parse(route.request().postData() || '{}');
      }
      await route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.updatedProfile) });
    });
    await page.route(settingsData.api.preferencesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.preferences) })
    );
    await page.goto(`${BASE_URL}/settings`);
    await page.getByLabel(/name/i).fill(settingsData.valid.updatedProfile.name);
    await page.getByRole('button', { name: /save changes/i }).click();
    expect(capturedBody).toMatchObject({ name: settingsData.valid.updatedProfile.name });
  });

  test('shows saving state during submit', async ({ page }) => {
    await page.route(settingsData.api.profileEndpoint, async (route) => {
      if (route.request().method() === 'PUT') {
        await new Promise((r) => setTimeout(r, 1000));
      }
      await route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.profile) });
    });
    await page.route(settingsData.api.preferencesEndpoint, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.preferences) })
    );
    await page.goto(`${BASE_URL}/settings`);
    await page.getByLabel(/name/i).fill('Saving Test');
    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByRole('button', { name: /saving/i })).toBeVisible();
  });
});
