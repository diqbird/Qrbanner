export type SiteSearchItem = {
  id: string;
  titleKey: string;
  descriptionKey?: string;
  href: string;
  groupKey: string;
  keywords?: string[];
};

/** Static index of public pages and key app routes for Cmd+K search. */
export const SITE_SEARCH_INDEX: SiteSearchItem[] = [
  { id: 'home', titleKey: 'siteSearch.home', href: '/', groupKey: 'siteSearch.groupPages' },
  { id: 'features', titleKey: 'siteSearch.features', href: '/features', groupKey: 'siteSearch.groupPages' },
  { id: 'solutions', titleKey: 'siteSearch.solutions', href: '/solutions', groupKey: 'siteSearch.groupPages' },
  { id: 'use-cases', titleKey: 'siteSearch.useCases', href: '/use-cases', groupKey: 'siteSearch.groupPages' },
  { id: 'templates', titleKey: 'siteSearch.templates', href: '/templates', groupKey: 'siteSearch.groupPages' },
  { id: 'qr-types', titleKey: 'siteSearch.qrTypes', href: '/qr-types', groupKey: 'siteSearch.groupPages' },
  { id: 'pricing', titleKey: 'siteSearch.pricing', href: '/pricing', groupKey: 'siteSearch.groupPages' },
  { id: 'integrations', titleKey: 'siteSearch.integrations', href: '/integrations', groupKey: 'siteSearch.groupPages' },
  { id: 'enterprise', titleKey: 'siteSearch.enterprise', href: '/enterprise', groupKey: 'siteSearch.groupPages' },
  { id: 'blog', titleKey: 'siteSearch.blog', href: '/blog', groupKey: 'siteSearch.groupPages' },
  { id: 'faq', titleKey: 'siteSearch.faq', href: '/faq', groupKey: 'siteSearch.groupPages' },
  { id: 'help', titleKey: 'siteSearch.help', href: '/help', groupKey: 'siteSearch.groupPages' },
  { id: 'status', titleKey: 'siteSearch.status', href: '/status', groupKey: 'siteSearch.groupPages' },
  { id: 'contact', titleKey: 'siteSearch.contact', href: '/contact', groupKey: 'siteSearch.groupPages' },
  { id: 'about', titleKey: 'siteSearch.about', href: '/about', groupKey: 'siteSearch.groupPages' },
  { id: 'security', titleKey: 'siteSearch.security', href: '/security', groupKey: 'siteSearch.groupPages' },
  { id: 'trust', titleKey: 'siteSearch.trust', href: '/trust', groupKey: 'siteSearch.groupPages' },
  {
    id: 'soc2-readiness',
    titleKey: 'siteSearch.soc2Readiness',
    href: '/trust/soc2-readiness',
    groupKey: 'siteSearch.groupPages',
    keywords: ['soc2', 'soc 2', 'compliance', 'audit', 'trust services', 'certification'],
  },
  {
    id: 'hipaa-readiness',
    titleKey: 'siteSearch.hipaaReadiness',
    href: '/trust/hipaa-readiness',
    groupKey: 'siteSearch.groupPages',
    keywords: ['hipaa', 'baa', 'phi', 'healthcare', 'compliance'],
  },
  {
    id: 'procurement-request',
    titleKey: 'siteSearch.procurementRequest',
    href: '/trust/procurement-request',
    groupKey: 'siteSearch.groupPages',
    keywords: ['baa', 'dpa', 'questionnaire', 'procurement', 'security'],
  },
  { id: 'dpa', titleKey: 'siteSearch.dpa', href: '/dpa', groupKey: 'siteSearch.groupPages' },
  { id: 'subprocessors', titleKey: 'siteSearch.subprocessors', href: '/sub-processors', groupKey: 'siteSearch.groupPages' },
  { id: 'refund', titleKey: 'siteSearch.refund', href: '/refund', groupKey: 'siteSearch.groupPages' },
  { id: 'developers', titleKey: 'siteSearch.developers', href: '/developers', groupKey: 'siteSearch.groupPages' },
  {
    id: 'developers-reference',
    titleKey: 'siteSearch.developersReference',
    href: '/developers/reference',
    groupKey: 'siteSearch.groupPages',
    keywords: ['openapi', 'swagger', 'api reference', 'rest'],
  },
  { id: 'apps', titleKey: 'siteSearch.apps', href: '/apps', groupKey: 'siteSearch.groupPages' },
  { id: 'hubspot', titleKey: 'siteSearch.hubspot', href: '/integrations/hubspot', groupKey: 'siteSearch.groupPages' },
  { id: 'salesforce', titleKey: 'siteSearch.salesforce', href: '/integrations/salesforce', groupKey: 'siteSearch.groupPages' },
  {
    id: 'make',
    titleKey: 'siteSearch.make',
    href: '/integrations/make',
    groupKey: 'siteSearch.groupPages',
    keywords: ['make.com', 'integromat', 'webhook', 'automation'],
  },
  { id: 'vs', titleKey: 'siteSearch.vs', href: '/vs', groupKey: 'siteSearch.groupPages' },
  { id: 'case-studies', titleKey: 'siteSearch.caseStudies', href: '/case-studies', groupKey: 'siteSearch.groupPages' },
  { id: 'geo', titleKey: 'siteSearch.geo', href: '/geo', groupKey: 'siteSearch.groupPages' },
  { id: 'create-qr', titleKey: 'siteSearch.createQr', href: '/qr/create', groupKey: 'siteSearch.groupActions' },
  { id: 'campaign', titleKey: 'siteSearch.campaign', href: '/qr/campaign', groupKey: 'siteSearch.groupActions' },
  { id: 'dashboard', titleKey: 'siteSearch.dashboard', href: '/dashboard', groupKey: 'siteSearch.groupApp' },
  { id: 'settings', titleKey: 'siteSearch.settings', href: '/settings', groupKey: 'siteSearch.groupApp' },
  { id: 'login', titleKey: 'siteSearch.login', href: '/login', groupKey: 'siteSearch.groupApp' },
  { id: 'signup', titleKey: 'siteSearch.signup', href: '/signup', groupKey: 'siteSearch.groupApp' },
];
