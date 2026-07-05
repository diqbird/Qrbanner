export const PUBLIC_NAV_LINKS = [
  { href: '/features', key: 'nav.features' },
  { href: '/solutions', key: 'nav.solutions' },
  { href: '/use-cases', key: 'nav.useCases' },
  { href: '/templates', key: 'nav.templates' },
  { href: '/integrations', key: 'nav.integrations' },
  { href: '/pricing', key: 'nav.pricing' },
  { href: '/blog', key: 'nav.blog' },
  { href: '/faq', key: 'nav.faq' },
] as const;

export type PublicNavLink = (typeof PUBLIC_NAV_LINKS)[number];
