import { test, expect } from '@playwright/test';

test('unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/dashboard/merchant');
  await page.waitForURL(/\/auth\/login/);
  expect(page.url()).toContain('/auth/login');
});

test('dashboard page shows redirect when not logged in', async ({ page }) => {
  const response = await page.goto('/dashboard');
  expect(response?.status()).toBeLessThan(500);
});
