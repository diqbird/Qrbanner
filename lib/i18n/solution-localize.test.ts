import { describe, expect, it } from 'vitest';
import { getSolutionBySlug } from '@/lib/solutions';
import { localizeSolutionPage } from '@/lib/i18n/solution-localize';

describe('localizeSolutionPage', () => {
  it('returns English unchanged', () => {
    const page = getSolutionBySlug('restaurant-menu');
    expect(page).toBeDefined();
    expect(localizeSolutionPage(page!, 'en').title).toContain('Restaurant');
  });

  it('localizes restaurant menu to Turkish', () => {
    const page = getSolutionBySlug('restaurant-menu')!;
    const tr = localizeSolutionPage(page, 'tr');
    expect(tr.title).toBe('Restoran Menü QR Kodu');
    expect(tr.headline).toContain('dijital menü');
  });

  it('uses template for slugs without hand copy', () => {
    const page = getSolutionBySlug('car-wash-detailing')!;
    const tr = localizeSolutionPage(page, 'tr');
    expect(tr.title).toBe('Oto yıkama QR Kodu');
    expect(tr.faq.length).toBeGreaterThan(0);
  });
});
