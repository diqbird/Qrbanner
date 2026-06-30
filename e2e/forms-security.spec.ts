import { test, expect } from '@playwright/test';

test.describe('Form security', () => {
  test('enterprise contact form does not execute injected script', async ({ page }) => {
    let dialogFired = false;
    page.on('dialog', async (dialog) => {
      dialogFired = true;
      await dialog.dismiss();
    });

    await page.goto('/enterprise');
    await page.locator('#contact-sales').scrollIntoViewIfNeeded();

    await page.fill('#inq-name', '<img src=x onerror=alert(1)>');
    await page.fill('#inq-email', 'qa-security@example.com');
    await page.locator('form button[type="submit"]').first().click();

    await page.waitForTimeout(1500);
    expect(dialogFired).toBe(false);
  });

  test('contact API rejects invalid email', async ({ request }) => {
    const res = await request.post('/api/contact/inquiry', {
      data: {
        type: 'general',
        name: 'QA Bot',
        email: 'not-an-email',
        message: 'test',
      },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('auth signup rejects empty password', async ({ request }) => {
    const res = await request.post('/api/signup', {
      data: {
        name: 'QA Bot',
        email: `qa-${Date.now()}@example.com`,
        password: '',
      },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
