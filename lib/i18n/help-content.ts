export type HelpTopic = {
  id: string;
  titleKey: string;
  descKey: string;
  href: string;
};

export type HelpSection = {
  id: string;
  titleKey: string;
  descKey: string;
  topics: HelpTopic[];
};

export const HELP_SECTIONS: HelpSection[] = [
  {
    id: 'start',
    titleKey: 'help.sectionStartTitle',
    descKey: 'help.sectionStartDesc',
    topics: [
      {
        id: 'create',
        titleKey: 'help.topicCreateTitle',
        descKey: 'help.topicCreateDesc',
        href: '/qr/create?quick=1',
      },
      {
        id: 'templates',
        titleKey: 'nav.templates',
        descKey: 'help.topicTemplatesDesc',
        href: '/templates',
      },
      {
        id: 'use-cases',
        titleKey: 'nav.useCases',
        descKey: 'help.topicUseCasesDesc',
        href: '/use-cases',
      },
    ],
  },
  {
    id: 'account',
    titleKey: 'help.sectionAccountTitle',
    descKey: 'help.sectionAccountDesc',
    topics: [
      {
        id: 'pricing',
        titleKey: 'nav.pricing',
        descKey: 'help.topicPricingDesc',
        href: '/pricing',
      },
      {
        id: 'faq',
        titleKey: 'nav.faq',
        descKey: 'help.topicFaqDesc',
        href: '/faq',
      },
      {
        id: 'refund',
        titleKey: 'footer.refund',
        descKey: 'help.topicRefundDesc',
        href: '/refund',
      },
    ],
  },
  {
    id: 'technical',
    titleKey: 'help.sectionTechnicalTitle',
    descKey: 'help.sectionTechnicalDesc',
    topics: [
      {
        id: 'developers',
        titleKey: 'footer.apiWebhooks',
        descKey: 'help.topicDevelopersDesc',
        href: '/developers',
      },
      {
        id: 'integrations',
        titleKey: 'nav.integrations',
        descKey: 'help.topicIntegrationsDesc',
        href: '/integrations',
      },
      {
        id: 'security',
        titleKey: 'nav.security',
        descKey: 'help.topicSecurityDesc',
        href: '/security',
      },
      {
        id: 'saml',
        titleKey: 'help.topicSamlTitle',
        descKey: 'help.topicSamlDesc',
        href: '/login?callbackUrl=%2Fsettings%3Ftab%3Dsaml',
      },
    ],
  },
];
