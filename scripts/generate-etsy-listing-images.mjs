#!/usr/bin/env node
/**
 * Etsy listing images built from real QRbanner.com screenshots + site design tokens.
 *
 * 1. node scripts/capture-etsy-site-screenshots.mjs
 * 2. node scripts/generate-etsy-listing-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CAPTURES = path.join(ROOT, 'marketing', 'etsy-listing', 'captures');
const OUT_DIR = path.join(ROOT, 'marketing', 'etsy-listing', 'export');

const CAPTURE_FILES = {
  homeHero: 'home-hero.png',
  createWizard: 'create-wizard.png',
  features: 'features.png',
  pricing: 'pricing.png',
  studioClaim: 'studio-claim.png',
};

function b64(file) {
  const p = path.join(CAPTURES, file);
  if (!fs.existsSync(p)) throw new Error(`Missing capture: ${p}\nRun: node scripts/capture-etsy-site-screenshots.mjs`);
  return `data:image/png;base64,${fs.readFileSync(p).toString('base64')}`;
}

const COPY = {
  en: {
    slides: [
      {
        id: '01-hero',
        badge: 'Instant digital delivery',
        title: '5 Dynamic QR Codes — One Pack',
        subtitle: 'Five professional QR codes with logo, analytics & live editing. One private studio link.',
        image: 'homeHero',
        imageLabel: 'qrbanner.com',
      },
      {
        id: '02-included',
        badge: 'What you get',
        title: 'Full create wizard included',
        bullets: [
          '5 dynamic QR codes in one pack',
          'Premium Studio private link',
          'Design, preview & export in one flow',
          'Scan analytics on every code',
          'Update URLs without reprinting',
        ],
        image: 'createWizard',
        imageLabel: 'qrbanner.com/qr/create',
      },
      {
        id: '03-how-it-works',
        badge: 'Simple setup',
        title: 'How Etsy delivery works',
        steps: [
          ['1', 'Purchase on Etsy', 'One listing — 5 dynamic QR codes included.'],
          ['2', 'Get your private link', 'We email your Premium Studio URL.'],
          ['3', 'Create & download', 'Same email to activate, then export.'],
        ],
        image: 'createWizard',
        imageLabel: 'qrbanner.com/studio',
      },
      {
        id: '04-features',
        badge: 'Platform features',
        title: 'Built on QRbanner',
        subtitle: 'Same product your customers see on qrbanner.com — not a generic QR template.',
        image: 'features',
        imageLabel: 'qrbanner.com/features',
      },
      {
        id: '05-create-flow',
        badge: 'Pro workflow',
        title: 'Design · Preview · Export',
        subtitle: 'Step-by-step wizard with live QR preview, styles, and print-ready downloads.',
        image: 'createWizard',
        imageLabel: 'Premium Studio create flow',
      },
      {
        id: '06-pack-options',
        badge: '5-QR bundle',
        title: 'Five codes, one link',
        subtitle: 'Menu, shop, social, WiFi & campaign — all from a single Premium Studio activation.',
        image: 'pricing',
        imageLabel: 'qrbanner.com',
        packs: [
          ['5 dynamic QR codes', 'Create up to five branded codes on one private link.'],
          ['Great value', 'Perfect for small business, Etsy sellers & side projects.'],
        ],
      },
      {
        id: '07-trust',
        badge: 'Powered by QRbanner',
        title: 'qrbanner.com',
        subtitle: 'Dynamic QR platform with analytics, security controls, and print exports.',
        image: 'homeHero',
        imageLabel: null,
        trustOnly: true,
      },
    ],
  },
  tr: {
    slides: [
      {
        id: '01-hero',
        badge: 'Anında dijital teslimat',
        title: '5 Dinamik QR Kod — Tek Paket',
        subtitle: 'Beş profesyonel QR kodu: logo, analitik, canlı düzenleme. Tek özel studio linki.',
        image: 'homeHero',
        imageLabel: 'qrbanner.com',
      },
      {
        id: '02-included',
        badge: 'Pakette neler var',
        title: 'Tam oluşturma sihirbazı dahil',
        bullets: [
          'Tek pakette 5 dinamik QR kodu',
          'Premium Studio özel linki',
          'Tasarım, önizleme ve dışa aktarım',
          'Her kod için tarama analitiği',
          'Yeniden basmadan URL güncelleme',
        ],
        image: 'createWizard',
        imageLabel: 'qrbanner.com/qr/create',
      },
      {
        id: '03-how-it-works',
        badge: 'Kolay kurulum',
        title: 'Etsy teslimat akışı',
        steps: [
          ['1', "Etsy'den satın al", 'Tek ilan — 5 dinamik QR kodu dahil.'],
          ['2', 'Özel linkini al', 'Premium Studio URL e-postana gelir.'],
          ['3', 'Oluştur & indir', 'Aynı e-postayla aktive et, dışa aktar.'],
        ],
        image: 'createWizard',
        imageLabel: 'qrbanner.com/studio',
      },
      {
        id: '04-features',
        badge: 'Platform özellikleri',
        title: 'QRbanner altyapısı',
        subtitle: 'Müşterilerin qrbanner.com\'da gördüğü gerçek ürün — jenerik şablon değil.',
        image: 'features',
        imageLabel: 'qrbanner.com/features',
      },
      {
        id: '05-create-flow',
        badge: 'Profesyonel akış',
        title: 'Tasarla · Önizle · Dışa aktar',
        subtitle: 'Canlı QR önizlemeli adım adım sihirbaz, stiller ve baskıya hazır dosyalar.',
        image: 'createWizard',
        imageLabel: 'Premium Studio oluşturma',
      },
      {
        id: '06-pack-options',
        badge: '5 QR paketi',
        title: 'Beş kod, tek link',
        subtitle: 'Menü, mağaza, sosyal, WiFi ve kampanya — tek Premium Studio aktivasyonu.',
        image: 'pricing',
        imageLabel: 'qrbanner.com',
        packs: [
          ['5 dinamik QR kodu', 'Tek özel linkte beş markalı kod oluştur.'],
          ['Uygun fiyat', 'Küçük işletme, Etsy satıcıları ve yan projeler için ideal.'],
        ],
      },
      {
        id: '07-trust',
        badge: 'QRbanner altyapısı',
        title: 'qrbanner.com',
        subtitle: 'Analitik, güvenlik kontrolleri ve baskı dışa aktarımı sunan dinamik QR platformu.',
        image: 'homeHero',
        imageLabel: null,
        trustOnly: true,
      },
    ],
  },
};

function siteCss() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', system-ui, sans-serif; background: #111; }
    .slide {
      width: 2000px; height: 2000px; position: relative; overflow: hidden;
      background: linear-gradient(to bottom right, hsl(211 100% 26% / 0.05), hsl(0 0% 100%), hsl(211 100% 26% / 0.10));
      color: hsl(240 10% 3.9%);
    }
    .slide.trust-slide {
      background: linear-gradient(to bottom right, hsl(211 100% 26% / 0.08), hsl(0 0% 100%), hsl(211 100% 26% / 0.12));
    }
    .inner { height: 100%; padding: 88px 96px; display: flex; flex-direction: column; gap: 40px; }
    .top { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; }
    .logo {
      display: inline-flex; align-items: center; gap: 14px;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 34px; font-weight: 700; letter-spacing: -0.02em;
    }
    .logo-mark {
      width: 56px; height: 56px; border-radius: 14px; background: hsl(211 100% 26%);
      display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
    }
    .logo-mark svg { width: 28px; height: 28px; color: white; }
    .badge {
      display: inline-flex; align-items: center; padding: 12px 22px; border-radius: 999px;
      background: hsl(240 4.8% 95.9%); color: hsl(240 5.9% 10%); font-size: 24px; font-weight: 600;
    }
    .studio-badge {
      display: inline-flex; align-items: center; gap: 10px; font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 26px; font-weight: 700; color: hsl(211 100% 26%);
    }
    .studio-badge svg { width: 22px; height: 22px; }
    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 72px; line-height: 1.05;
      font-weight: 800; letter-spacing: -0.03em; max-width: 920px;
    }
    .subtitle { font-size: 32px; line-height: 1.4; color: hsl(240 3.8% 46.1%); max-width: 880px; }
    .content-row { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; flex: 1; min-height: 0; align-items: stretch; }
    .content-row.single { grid-template-columns: 1fr; }
    .left-col { display: flex; flex-direction: column; gap: 28px; justify-content: center; }
    ul.bullets { list-style: none; display: grid; gap: 18px; }
    ul.bullets li {
      display: flex; align-items: flex-start; gap: 16px; font-size: 30px; font-weight: 600; line-height: 1.35;
    }
    ul.bullets li::before {
      content: '✓'; flex-shrink: 0; width: 36px; height: 36px; border-radius: 10px;
      background: hsl(211 100% 26%); color: white; display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 700;
    }
    .steps { display: grid; gap: 20px; }
    .step {
      background: hsl(0 0% 100%); border: 1px solid hsl(240 5.9% 90% / 0.6); border-radius: 16px;
      padding: 28px 32px; box-shadow: 0 1px 2px rgb(0 0 0 / 0.03), 0 1px 3px rgb(0 0 0 / 0.06);
    }
    .step-num {
      display: inline-flex; width: 40px; height: 40px; border-radius: 10px; align-items: center; justify-content: center;
      background: hsl(211 100% 26%); color: white; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 22px; margin-bottom: 12px;
    }
    .step h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .step p { font-size: 24px; color: hsl(240 3.8% 46.1%); line-height: 1.4; }
    .packs { display: grid; gap: 18px; }
    .pack {
      border: 1px solid hsl(240 5.9% 90% / 0.6); border-radius: 16px; padding: 24px 28px; background: white;
      box-shadow: 0 1px 2px rgb(0 0 0 / 0.03);
    }
    .pack h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 30px; font-weight: 800; color: hsl(211 100% 26%); margin-bottom: 8px; }
    .pack p { font-size: 24px; color: hsl(240 3.8% 46.1%); line-height: 1.4; }
    .browser {
      border-radius: 16px; border: 1px solid hsl(240 5.9% 90% / 0.6); background: hsl(0 0% 100%);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05);
      overflow: hidden; display: flex; flex-direction: column; min-height: 0;
    }
    .browser-bar {
      display: flex; align-items: center; gap: 10px; padding: 14px 18px;
      border-bottom: 1px solid hsl(240 5.9% 90% / 0.5); background: hsl(240 4.8% 95.9% / 0.4);
    }
    .dot { width: 12px; height: 12px; border-radius: 999px; }
    .dot.r { background: rgb(248 113 113 / 0.8); }
    .dot.y { background: rgb(251 191 36 / 0.8); }
    .dot.g { background: rgb(52 211 153 / 0.8); }
    .browser-url { margin-left: 8px; font-size: 18px; color: hsl(240 3.8% 46.1%); }
    .browser img { width: 100%; height: auto; display: block; object-fit: cover; object-position: top; }
    .browser.tall img { max-height: 1180px; }
    .browser.hero img { max-height: 980px; }
    .trust-center { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 28px; }
    .trust-center h1 { max-width: none; font-size: 96px; }
    .trust-center .subtitle { max-width: 1100px; }
    .footer-pill {
      margin-top: auto; align-self: flex-start; padding: 16px 28px; border-radius: 999px;
      background: hsl(211 100% 26%); color: white; font-size: 26px; font-weight: 700;
    }
  `;
}

const QR_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h2v2h-2z"/><path d="M18 14h3v3h-3z"/><path d="M14 18h2v3h-2z"/><path d="M18 18h1v1h-1z"/><path d="M20 18h1v1h-1z"/><path d="M20 20h1v1h-1z"/></svg>`;
const SPARKLES = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.94 15.5 11 19l1.06-3.5L15.5 14l-3.44-1.06L11 9.5 9.94 13 6.5 14z"/><path d="M16.5 8.5 17 10l.5-1.5L19 8l-1.5-.5L17 6l-.5 1.5L15 8z"/></svg>`;

function logoHtml() {
  return `<div class="logo"><span class="logo-mark">${QR_ICON}</span><span>QRbanner</span></div>`;
}

function browserHtml(src, label, tall = true) {
  return `<div class="browser ${tall ? 'tall' : 'hero'}">
    <div class="browser-bar">
      <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
      ${label ? `<span class="browser-url">${label}</span>` : ''}
    </div>
    <img src="${src}" alt="" />
  </div>`;
}

function renderSlide(slide, images) {
  const src = images[slide.image];
  const studioHeader = slide.image === 'studioClaim'
    ? `<div class="studio-badge">${SPARKLES} Premium QR Studio</div>`
    : '';

  if (slide.trustOnly) {
    return `<div class="slide trust-slide" id="slide-${slide.id}">
      <div class="inner">
        ${logoHtml()}
        <div class="trust-center">
          <span class="badge">${slide.badge}</span>
          <h1>${slide.title}</h1>
          <p class="subtitle">${slide.subtitle}</p>
        </div>
        ${browserHtml(src, 'qrbanner.com', false)}
      </div>
    </div>`;
  }

  let left = `<div class="left-col">
    <span class="badge">${slide.badge}</span>
    ${studioHeader}
    <h1>${slide.title}</h1>
    ${slide.subtitle ? `<p class="subtitle">${slide.subtitle}</p>` : ''}`;

  if (slide.bullets) {
    left += `<ul class="bullets">${slide.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>`;
  }
  if (slide.steps) {
    left += `<div class="steps">${slide.steps.map(([n, t, d]) => `
      <div class="step"><div class="step-num">${n}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`;
  }
  if (slide.packs) {
    left += `<div class="packs">${slide.packs.map(([t, d]) => `
      <div class="pack"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`;
  }
  left += `</div>`;

  const single = slide.id === '04-features' || slide.id === '05-create-flow';
  return `<div class="slide" id="slide-${slide.id}">
    <div class="inner">
      <div class="top">${logoHtml()}<span class="badge">qrbanner.com</span></div>
      <div class="content-row ${single ? 'single' : ''}">
        ${single ? '' : left}
        <div>${browserHtml(src, slide.imageLabel ?? 'qrbanner.com')}</div>
        ${single ? left : ''}
      </div>
      ${slide.id === '01-hero' ? '<div class="footer-pill">Instant download · No shipping</div>' : ''}
    </div>
  </div>`;
}

function buildHtml(locale, images) {
  const slides = COPY[locale].slides.map((s) => renderSlide(s, images)).join('\n');
  return `<!DOCTYPE html><html lang="${locale}"><head><meta charset="UTF-8" /><style>${siteCss()}</style></head><body>${slides}</body></html>`;
}

async function renderLocale(page, locale, images) {
  const outSub = path.join(OUT_DIR, locale);
  fs.mkdirSync(outSub, { recursive: true });
  const html = buildHtml(locale, images);
  const tmp = path.join(outSub, '_render.html');
  fs.writeFileSync(tmp, html);
  await page.goto(`file:///${tmp.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });

  for (const slide of COPY[locale].slides) {
    const out = path.join(outSub, `${slide.id}.png`);
    await page.locator(`#slide-${slide.id}`).screenshot({ path: out, type: 'png' });
    console.log('Wrote', path.relative(ROOT, out));
  }
  fs.unlinkSync(tmp);
}

async function main() {
  const images = Object.fromEntries(
    Object.entries(CAPTURE_FILES).map(([k, f]) => [k, b64(f)]),
  );

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2000, height: 2000 } });

  for (const locale of ['en', 'tr']) {
    await renderLocale(page, locale, images);
  }

  await browser.close();

  fs.writeFileSync(
    path.join(OUT_DIR, 'README.md'),
    `# Etsy listing images (site screenshots)

Built from **real qrbanner.com captures** — homepage, create wizard, features, pricing, studio.

Regenerate:

\`\`\`bash
node scripts/capture-etsy-site-screenshots.mjs
node scripts/generate-etsy-listing-images.mjs
\`\`\`

Folders: \`en/\`, \`tr/\` — 2000×2000 PNG, upload in numeric order.
`,
  );

  console.log('\nDone →', path.relative(ROOT, OUT_DIR));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
