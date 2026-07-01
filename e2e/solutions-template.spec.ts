import { test, expect } from '@playwright/test';

const SOLUTION_TEMPLATE_CASES = [
  { slug: 'restaurant-menu', templateId: 'restaurant-menu', label: /Restaurant Menu|Restoran Menüsü/i },
  { slug: 'university-campus', templateId: 'campus-institution', label: /Campus|Kampüs/i },
  { slug: 'food-trucks', templateId: 'mobile-vendor', label: /Mobile Vendor|Mobil Satıcı/i },
  { slug: 'law-firms', templateId: 'professional-services', label: /Professional Services|Profesyonel Hizmetler/i },
] as const;

test.describe('Solution → create with industry template', () => {
  for (const { slug, templateId, label } of SOLUTION_TEMPLATE_CASES) {
    test(`${slug} CTA opens wizard with template=${templateId}`, async ({ page }) => {
      await page.goto(`/solutions/${slug}`);
      await expect(page.locator('header').first()).toBeVisible();

      const cta = page.getByTestId('solution-create-cta').first();
      await expect(cta).toHaveAttribute('href', `/qr/create?template=${templateId}`);

      await cta.click();
      await expect(page).toHaveURL(new RegExp(`/qr/create\\?template=${templateId}`));
      await expect(page.getByTestId('industry-template-guide')).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId('industry-template-guide')).toContainText(label);
      await expect(page.getByTestId('template-section-fields')).toBeVisible();
    });
  }

  test('direct template URL preloads restaurant template fields', async ({ page }) => {
    await page.goto('/qr/create?template=restaurant-menu');
    await expect(page.getByTestId('industry-template-guide')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('template-section-fields')).toBeVisible();
    await expect(page.locator('#tpl-url')).toBeVisible();
  });

  test('industry template picker lists templates on step 0', async ({ page }) => {
    await page.goto('/qr/create');
    await expect(page.getByTestId('industry-template-picker')).toBeVisible();
    await expect(page.getByTestId('industry-template-restaurant-menu')).toBeVisible();
  });

  test('picker section preview uses locale for restaurant template', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('qrb-locale', 'tr');
      document.cookie = 'qrb-locale=tr;path=/;max-age=31536000;SameSite=Lax';
    });
    await page.goto('/qr/create');
    const card = page.getByTestId('industry-template-restaurant-menu');
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: /bölüm/i }).click();
    await expect(card.getByText('Mekan ve marka')).toBeVisible();
    await expect(card.getByText('Menü linki')).toBeVisible();
  });
});

test.describe('Visual preset picker', () => {
  test('grouped categories render on design step', async ({ page }) => {
    await page.goto('/qr/create?template=restaurant-menu');
    await expect(page.getByTestId('template-section-fields')).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: /Next|İleri/i }).click();

    const picker = page.getByTestId('visual-preset-picker');
    await expect(picker).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('visual-preset-group-hospitality')).toBeVisible();
    await expect(page.getByTestId('visual-preset-category-business')).toBeVisible();

    await page.getByTestId('visual-preset-category-business').click();
    await expect(page.getByTestId('visual-preset-modern-business')).toBeVisible();
  });

  test('Turkish locale shows translated visual preset names', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('qrb-locale', 'tr');
      document.cookie = 'qrb-locale=tr;path=/;max-age=31536000;SameSite=Lax';
    });
    await page.goto('/qr/create?template=restaurant-menu');
    await expect(page.getByTestId('template-section-fields')).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: /İleri/i }).click();
    await expect(page.getByTestId('visual-preset-picker')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('visual-preset-restaurant-elegant')).toContainText('Zarif Restoran');
  });
});

test.describe('Template field i18n', () => {
  test('Turkish locale shows translated restaurant field labels', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('qrb-locale', 'tr');
      document.cookie = 'qrb-locale=tr;path=/;max-age=31536000;SameSite=Lax';
    });
    await page.goto('/qr/create?template=restaurant-menu');
    await expect(page.getByTestId('template-section-fields')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Menü hedefi')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByLabel('Menü linki')).toBeVisible();
    await expect(page.getByTestId('industry-template-guide')).toContainText('Masada dijital menü');
    await page.getByRole('button', { name: /İpuçlarını göster/i }).click();
    await expect(page.getByText('En uygun kullanım')).toBeVisible();
    await expect(page.getByText('Masa tent kartı')).toBeVisible();
  });
});
