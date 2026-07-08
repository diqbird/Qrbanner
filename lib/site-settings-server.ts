import fs from 'fs';
import path from 'path';
import type { SiteSettings } from './site-settings';

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'site-settings.json');

function envDefaultShowQrDescription(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_QR_DESCRIPTION !== 'false';
}

function readFileSettings(): Partial<SiteSettings> | null {
  try {
    const raw = fs.readFileSync(SETTINGS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

let cache: { settings: SiteSettings; at: number } | null = null;
const CACHE_MS = 3000;

export function getSiteSettings(): SiteSettings {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) return cache.settings;

  const fromFile = readFileSettings();
  const settings: SiteSettings = {
    showQrDescription:
      typeof fromFile?.showQrDescription === 'boolean'
        ? fromFile.showQrDescription
        : envDefaultShowQrDescription(),
    announcementEnabled: fromFile?.announcementEnabled === true,
    announcementText: typeof fromFile?.announcementText === 'string' ? fromFile.announcementText : '',
    announcementTextTr: typeof fromFile?.announcementTextTr === 'string' ? fromFile.announcementTextTr : '',
    announcementLink: typeof fromFile?.announcementLink === 'string' ? fromFile.announcementLink : '',
  };
  cache = { settings, at: now };
  return settings;
}

export function writeSiteSettings(patch: Partial<SiteSettings>): SiteSettings {
  const current = getSiteSettings();
  const next: SiteSettings = { ...current, ...patch };
  fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(next, null, 2) + '\n', 'utf8');
  cache = { settings: next, at: Date.now() };
  return next;
}

export function showQrDescriptionEnabled(): boolean {
  return getSiteSettings().showQrDescription;
}

export function invalidateSiteSettingsCache(): void {
  cache = null;
}
