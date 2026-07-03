import { test, expect } from '@playwright/test';

/** Keep in sync with lib/qr-utils.ts QR_CATEGORIES */
const QR_CATEGORY_IDS = [
  'url',
  'text',
  'vcard',
  'wifi',
  'email',
  'sms',
  'phone',
  'location',
  'event',
  'whatsapp',
  'telegram',
  'discord',
  'instagram',
  'facebook',
  'tiktok',
  'linkedin',
  'youtube',
  'spotify',
  'social',
  'link_hub',
  'zoom',
  'google_meet',
  'menu',
  'pdf',
  'file',
  'app',
  'crypto',
  'google_review',
  'paypal',
  'upi',
  'signal',
  'apple_music',
  'google_drive',
  'dropbox',
  'gs1',
] as const;

async function selectCategory(page: import('@playwright/test').Page, id: string) {
  const btn = page.getByTestId(`qr-category-${id}`);
  await btn.scrollIntoViewIfNeeded();
  await btn.click({ force: true });
}

test.describe('QR create wizard', () => {
  test('shows all QR category types', async ({ page }) => {
    await page.goto('/qr/create');
    await expect(page.getByTestId('qr-category-url')).toBeVisible();
    for (const id of QR_CATEGORY_IDS) {
      await expect(page.getByTestId(`qr-category-${id}`)).toBeAttached();
    }
    expect(QR_CATEGORY_IDS.length).toBeGreaterThanOrEqual(35);
  });

  test('each category opens step 2 fields', async ({ page }) => {
    test.setTimeout(180_000);
    for (const id of QR_CATEGORY_IDS) {
      await page.goto('/qr/create');
      await selectCategory(page, id);
      await expect(page.locator('label').first()).toBeVisible({ timeout: 10_000 });
    }
  });
});
