import { test, expect } from '@playwright/test';

const SITE = process.env.PLAYWRIGHT_BASE_URL ?? 'https://qrbanner.com';

test.describe('P4-26 sitemap health', () => {
  test('sitemap.xml returns valid XML with core URLs', async ({ request }) => {
    const res = await request.get(`${SITE}/sitemap.xml`);
    expect(res.status()).toBe(200);

    const xml = await res.text();
    expect(xml).toContain('<urlset');
    expect(xml).toContain(`${SITE}/pricing`);
    expect(xml).toContain(`${SITE}/case-studies`);
    expect(xml).not.toContain('/login');
    expect(xml).not.toContain('/dashboard');

    const locCount = (xml.match(/<loc>/g) ?? []).length;
    expect(locCount).toBeGreaterThan(80);
  });

  test('robots.txt references sitemap', async ({ request }) => {
    const res = await request.get(`${SITE}/robots.txt`);
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body.toLowerCase()).toContain('sitemap');
  });
});

test.describe('P4-27 marketing claims', () => {
  test('case studies index shows illustrative disclaimer', async ({ page }) => {
    await page.goto('/case-studies');
    await expect(page.getByText(/Illustrative scenario|not verified/i).first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/scenario|use case/i);
  });

  test('case study detail shows scenario badge', async ({ page }) => {
    await page.goto('/case-studies/multi-location-restaurant-menus');
    await expect(page.getByText(/Illustrative scenario|not a verified/i).first()).toBeVisible();
  });

  test('customers page shows logo disclaimer', async ({ page }) => {
    await page.goto('/customers');
    await expect(page.getByText(/not customer logos|Industry labels only/i).first()).toBeVisible();
  });

  test('review prompts redirect to reviews', async ({ page }) => {
    await page.goto('/reviews/prompts');
    await expect(page).toHaveURL(/\/reviews\/?$/);
  });
});
