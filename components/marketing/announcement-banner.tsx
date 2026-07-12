import Link from 'next/link';
import { getSiteSettings } from '@/lib/site-settings-server';
import { getServerLocale } from '@/lib/i18n/server';

/** Site-wide announcement bar managed from Super Admin → Banners. */
export async function AnnouncementBanner() {
  const settings = getSiteSettings();
  if (!settings.announcementEnabled) return null;

  const locale = await getServerLocale();
  const localized =
    locale === 'tr'
      ? settings.announcementTextTr
      : locale === 'de'
        ? settings.announcementTextDe
        : locale === 'es'
          ? settings.announcementTextEs
          : '';
  const text = (localized || settings.announcementText).trim();
  if (!text) return null;

  const inner = <span className="line-clamp-2">{text}</span>;

  return (
    <div className="bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
      {settings.announcementLink ? (
        <Link href={settings.announcementLink} className="underline-offset-4 hover:underline">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
