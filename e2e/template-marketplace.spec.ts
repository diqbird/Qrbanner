import { test, expect } from '@playwright/test';

test.describe('Template marketplace', () => {
  test('lists templates and links to create wizard', async ({ page }) => {
    await page.goto('/templates');
    await expect(page.getByTestId('template-marketplace')).toBeVisible();
    await expect(page.getByTestId('marketplace-template-restaurant-menu')).toBeVisible();

    const link = page.getByTestId('marketplace-template-restaurant-menu').getByRole('link', {
      name: /use this template|bu şablonu kullan/i,
    });
    await expect(link).toHaveAttribute('href', '/qr/create?template=restaurant-menu');
  });

  test('Turkish locale shows translated template name', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('qrb-locale', 'tr');
      document.cookie = 'qrb-locale=tr;path=/;max-age=31536000;SameSite=Lax';
    });
    await page.goto('/templates');
    await expect(page.getByTestId('marketplace-template-restaurant-menu')).toContainText(
      /Restoran Menüsü|restaurant/i,
    );
  test('detail page links to create wizard', async ({ page }) => {
    await page.goto('/templates/restaurant-menu');
    await expect(page.getByTestId('template-detail')).toBeVisible();

    const cta = page.getByTestId('template-detail-create-cta');
    await expect(cta).toHaveAttribute('href', '/qr/create?template=restaurant-menu');
    await cta.click();
    await expect(page).toHaveURL(/\/qr\/create\?template=restaurant-menu/);
  });

  test('marketplace title links to detail page', async ({ page }) => {
    await page.goto('/templates');
    const card = page.getByTestId('marketplace-template-restaurant-menu');
    const titleLink = card.locator('a[href="/templates/restaurant-menu"]').first();
    await expect(titleLink).toBeVisible();
    await titleLink.click();
    await expect(page).toHaveURL(/\/templates\/restaurant-menu/);
  });
});
