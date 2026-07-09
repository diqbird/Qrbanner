import { translate, type Locale } from '@/lib/i18n';
import { resolveAnalyticsCountryLabel } from '@/lib/i18n/resolve-analytics-country-label';
import {
  resolveAnalyticsDeviceLabel,
  resolveAnalyticsOsLabel,
} from '@/lib/i18n/resolve-analytics-scan-copy';
import { resolveAnalyticsCityLabel } from '@/lib/i18n/resolve-analytics-city-label';
import type { ScanNotificationPayload } from '@/lib/email';
import type { EmailShellOptions } from '@/lib/i18n/email-shell';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

function t(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  return translate(locale, key, vars);
}

export function buildScanNotificationEmailContent(
  locale: Locale,
  payload: ScanNotificationPayload,
  shell?: EmailShellOptions,
): { subject: string; headline: string; html: string; text: string } {
  const tr = (key: string, vars?: Record<string, string | number>) => t(locale, key, vars);
  const tf = tr as TranslateFn;
  const brandName = (shell?.brandName?.trim() || 'QRbanner').slice(0, 80);
  const year = new Date().getFullYear();
  const copyright = shell?.hidePoweredBy
    ? tr('authEmail.footerRightsBrand', { year, brand: brandName })
    : `© ${year} QRbanner`;

  const greeting = payload.userName
    ? tr('scanNotifyEmail.greeting', { name: payload.userName })
    : tr('scanNotifyEmail.greetingNoName');

  const headline =
    payload.reason === 'first'
      ? tr('scanNotifyEmail.titleFirst')
      : payload.reason === 'milestone'
        ? tr('scanNotifyEmail.titleMilestone', { milestone: payload.milestone ?? 0 })
        : tr('scanNotifyEmail.titleEvery', { qrName: payload.qrName });

  const countryLabel = payload.country
    ? resolveAnalyticsCountryLabel(tf, payload.country, locale)
    : '';
  const cityLabel = payload.city ? resolveAnalyticsCityLabel(tf, payload.city, locale) : '';
  const location =
    [cityLabel, countryLabel].filter(Boolean).join(', ') || tr('scanNotifyEmail.unknownLocation');

  const devicePart = payload.device ? resolveAnalyticsDeviceLabel(tf, payload.device) : '';
  const osPart = payload.os ? resolveAnalyticsOsLabel(tf, payload.os) : '';
  const deviceInfo = [devicePart, osPart].filter(Boolean).join(' · ') || tr('scanNotifyEmail.unknownDevice');

  const subject =
    payload.reason === 'first'
      ? tr('scanNotifyEmail.subjectFirst', { qrName: payload.qrName })
      : payload.reason === 'milestone'
        ? tr('scanNotifyEmail.subjectMilestone', {
            milestone: payload.milestone ?? 0,
            qrName: payload.qrName,
          })
        : tr('scanNotifyEmail.subjectEvery', { qrName: payload.qrName });

  const bodyLine = tr('scanNotifyEmail.body', { qrName: payload.qrName });
  const bodyHtml = tr('scanNotifyEmail.body', {
    qrName: `<strong>${payload.qrName}</strong>`,
  });
  const viewAnalytics = tr('scanNotifyEmail.viewAnalytics');
  const footer = tr('scanNotifyEmail.footer');
  const totalScansLabel = tr('scanNotifyEmail.totalScans');
  const locationLabel = tr('scanNotifyEmail.location');
  const deviceLabel = tr('scanNotifyEmail.device');

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1d1d1f">
    <div style="text-align:center;margin-bottom:24px">
      <div style="display:inline-block;width:48px;height:48px;line-height:48px;background:#0071e3;color:#fff;border-radius:14px;font-size:22px">▣</div>
      <h1 style="font-size:18px;margin:12px 0 0;font-weight:600">${brandName}</h1>
    </div>
    <h2 style="font-size:20px;font-weight:700;margin:0 0 16px;letter-spacing:-.02em">${headline}</h2>
    <p style="font-size:15px;line-height:1.5">${greeting}</p>
    <p style="font-size:15px;line-height:1.5">${bodyHtml}</p>
    <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
      <table style="width:100%;font-size:14px;border-collapse:collapse">
        <tr><td style="padding:6px 0;color:#6e6e73">${totalScansLabel}</td><td style="padding:6px 0;text-align:right;font-weight:600">${payload.totalScans}</td></tr>
        <tr><td style="padding:6px 0;color:#6e6e73">${locationLabel}</td><td style="padding:6px 0;text-align:right">${location}</td></tr>
        <tr><td style="padding:6px 0;color:#6e6e73">${deviceLabel}</td><td style="padding:6px 0;text-align:right">${deviceInfo}</td></tr>
      </table>
    </div>
    <div style="text-align:center;margin:28px 0">
      <a href="${payload.analyticsUrl}" style="display:inline-block;background:#0071e3;color:#fff;text-decoration:none;padding:12px 28px;border-radius:980px;font-size:15px;font-weight:600">${viewAnalytics}</a>
    </div>
    <p style="font-size:12px;color:#86868b;text-align:center">${footer}</p>
    <hr style="border:none;border-top:1px solid #e5e5ea;margin:24px 0" />
    <p style="font-size:11px;color:#aeaeb2;text-align:center">${copyright}</p>
  </div>`;

  const text = [
    headline,
    '',
    greeting,
    bodyLine,
    '',
    `${totalScansLabel}: ${payload.totalScans}`,
    `${locationLabel}: ${location}`,
    `${deviceLabel}: ${deviceInfo}`,
    '',
    `${viewAnalytics}: ${payload.analyticsUrl}`,
  ].join('\n');

  return { subject, headline, html, text };
}
