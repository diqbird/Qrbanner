import { test, expect } from '@playwright/test';

test.describe('Locale URL routes', () => {
  test('/tr/pricing serves Turkish pricing page', async ({ page }) => {
    await page.goto('/tr/pricing');
    await expect(page).toHaveURL(/\/tr\/pricing/);
    await expect(page.locator('h1')).toContainText(/Fiyat|Pricing/i);
  });

  test('language switcher navigates to /tr path', async ({ page }) => {
    await page.goto('/pricing');
    await page.getByRole('button', { name: 'TR', exact: true }).click();
    await expect(page).toHaveURL(/\/tr\/pricing/);
  });

  test('/en/pricing redirects to canonical English URL', async ({ page }) => {
    await page.goto('/en/pricing');
    await expect(page).toHaveURL(/\/pricing$/);
  });
});
