import { DM_Sans, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { DeferredSiteAnalytics } from '@/components/analytics/deferred-site-analytics';
import { getServerLocale } from '@/lib/i18n/server';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  weight: ['500', '600', '700', '800'],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Dynamic QR Platform with Smart Routing & API`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, telephone: false },
  applicationName: SITE_NAME,
  category: 'technology',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Dynamic QR Platform`,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${SITE_NAME} — Dynamic QR Platform` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Dynamic QR Platform`,
    description: DEFAULT_DESCRIPTION,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' as const },
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/icon', type: 'image/png' }],
    shortcut: '/icon',
    apple: '/icon',
  },
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ??
      'xFJ2mgJtq8mkZibVZWBdq1bAvM0RhBl53tQS_QFvqMg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${dmSans.variable} ${jakartaSans.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <DeferredSiteAnalytics />
      </body>
    </html>
  );
}
