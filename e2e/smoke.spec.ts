import { test, expect } from '@playwright/test';

const PUBLIC_WITH_HEADER = [
  '/',
  '/pricing',
  '/features',
  '/faq',
  '/qr/create',
  '/enterprise',
  '/developers',
];

const AUTH_PAGES = ['/login', '/signup'];

test.describe('Public pages smoke', () => {
  for (const path of PUBLIC_WITH_HEADER) {
    test(`${path} returns 200 and has header`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator('header').first()).toBeVisible();
    });
  }

  for (const path of AUTH_PAGES) {
    test(`${path} returns 200 and shows auth form`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator('form').first()).toBeVisible();
    });
  }

  test('404 page uses public chrome', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-qrbanner-qa');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
  });
});
