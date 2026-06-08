import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.VITE_PORT || '5173'}`;

test.describe('Dashboard > Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/stats', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    );
    await page.route('**/api/activities**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    );
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
  });

  test('page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(`${BASE_URL}/`);
    expect(errors).toHaveLength(0);
  });

  test('page has correct document title', async ({ page }) => {
    await expect(page).toHaveTitle(/LaunchPad Dashboard/i);
  });

  test('primary heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('page renders within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('domcontentloaded');
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test('navigation links are visible', async ({ page }) => {
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /analytics/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /settings/i })).toBeVisible();
  });
});
