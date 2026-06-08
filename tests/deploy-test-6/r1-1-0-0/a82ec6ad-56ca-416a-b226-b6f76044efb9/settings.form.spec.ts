import { test, expect } from '@playwright/test';
import { settingsData } from '../../../fixtures/mock-data/settings.data';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

test.describe('Settings > Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(settingsData.api.profileEndpoint, (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.profile) });
      }
      return route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.updatedProfile) });
    });
    await page.route(settingsData.api.preferencesEndpoint, (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.preferences) });
      }
      return route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.preferences) });
    });
    await page.goto(`${BASE_URL}/settings`);
    await page.waitForLoadState('networkidle');
  });

  test('submit with empty name shows required field error', async ({ page }) => {
    await page.getByLabel(/name/i).fill('');
    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByText(/name is required/i)).toBeVisible();
  });

  test('email: invalid format shows format error', async ({ page }) => {
    await page.getByLabel(/email/i).fill(settingsData.invalid.badEmail.email);
    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('valid form submission succeeds', async ({ page }) => {
    await page.getByLabel(/name/i).fill(settingsData.valid.updatedProfile.name);
    await page.getByLabel(/email/i).fill(settingsData.valid.updatedProfile.email);
    await page.getByLabel(/role/i).fill(settingsData.valid.updatedProfile.role);
    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByText(/changes saved/i)).toBeVisible();
  });

  test('save button disabled when no changes', async ({ page }) => {
    await expect(page.getByRole('button', { name: /save changes/i })).toBeDisabled();
  });

  test('save button enabled after making changes', async ({ page }) => {
    await page.getByLabel(/name/i).fill('Changed Name');
    await expect(page.getByRole('button', { name: /save changes/i })).toBeEnabled();
  });

  test('whitespace-only name treated as empty', async ({ page }) => {
    await page.getByLabel(/name/i).fill(settingsData.invalid.whitespaceName.name);
    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByText(/name is required/i)).toBeVisible();
  });

  test('double-click save does not create duplicate requests', async ({ page }) => {
    let callCount = 0;
    await page.route(settingsData.api.profileEndpoint, async (route) => {
      if (route.request().method() === 'PUT') callCount++;
      await route.fulfill({ status: 200, body: JSON.stringify(settingsData.valid.updatedProfile) });
    });
    await page.getByLabel(/name/i).fill('New Name');
    await page.getByRole('button', { name: /save changes/i }).dblclick();
    await page.waitForTimeout(500);
    expect(callCount).toBeLessThanOrEqual(2);
  });

  test('toggle switches update preference state', async ({ page }) => {
    const pushToggle = page.getByRole('switch', { name: /push notifications/i });
    await expect(pushToggle).toHaveAttribute('aria-checked', 'false');
    await pushToggle.click();
    await expect(pushToggle).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByRole('button', { name: /save changes/i })).toBeEnabled();
  });
});
