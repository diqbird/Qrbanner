import { test, expect } from '@playwright/test';

const TOKEN = 'e2e-invite-brand-token';
const BRAND = {
  email: 'invitee@example.com',
  role: 'editor',
  workspace: { id: 'ws_e2e', name: 'Acme Ops' },
  branding: {
    agencyName: 'Acme Agency',
    logoUrl: 'https://qrbanner.com/icon',
    faviconUrl: 'https://qrbanner.com/icon',
    brandColor: '#0ea5e9',
  },
};

test.describe('Invite auth brand continuity', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`**/api/invite/${TOKEN}`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(BRAND),
        });
        return;
      }
      await route.continue();
    });
  });

  test('invite page shows agency logo and brand CTA', async ({ page }) => {
    await page.goto(`/invite/${TOKEN}`);
    await expect(page.getByRole('img').first()).toBeVisible();
    await expect(page.getByText(/Acme Ops/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in|giriş|anmelden|iniciar/i })).toBeVisible();
  });

  test('login with invite callbackUrl shows branded mark and subtitle', async ({ page }) => {
    await page.goto(`/login?callbackUrl=${encodeURIComponent(`/invite/${TOKEN}`)}`);
    await expect(page.locator('img[src*="icon"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('body')).toContainText(/Acme Ops|Acme Agency/i);
  });

  test('signup with invite callbackUrl shows branded mark', async ({ page }) => {
    await page.goto(`/signup?callbackUrl=${encodeURIComponent(`/invite/${TOKEN}`)}`);
    await expect(page.locator('img[src*="icon"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('body')).toContainText(/Acme Ops|Acme Agency/i);
  });
});
