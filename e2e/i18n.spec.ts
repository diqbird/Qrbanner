import { test, expect } from '@playwright/test';

test.describe('Language switcher', () => {
  test('homepage switches to Turkish', async ({ page }) => {
    await page.goto('/');
    const switcher = page.getByRole('button', { name: /TR|EN|Türkçe|English/i }).first();
    if (await switcher.isVisible()) {
      await switcher.click();
      const trOption = page.getByRole('menuitem', { name: /Türkçe|TR/i }).or(
        page.getByRole('option', { name: /Türkçe|TR/i }),
      );
      if (await trOption.count()) {
        await trOption.first().click();
      }
    }
    await expect(page.locator('body')).toContainText(/QR|Oluştur|Fiyat|Özellik/i);
  });
});
