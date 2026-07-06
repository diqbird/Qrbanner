import { DEFAULT_QR_STYLE, normalizeQRStyle } from '@/components/qr/qr-style-editor';
import type { QRStyleConfig } from '@/lib/qr-style';
import { buildLandingFromTemplate, type IndustryTemplate } from '@/lib/industry-templates';
import { emptyLandingPage } from '@/components/qr/landing-page-editor';
import { defaultLeadForm } from '@/lib/landing-page';
import type { LandingPageData } from '@/lib/landing-page';

export function buildLandingPageFromIndustryTemplate(
  template: IndustryTemplate,
): { enabled: boolean; page: LandingPageData; hubUrl?: string } {
  const built = buildLandingFromTemplate(template, template.qrData);
  const hubLinks = template.landingPage?.hubLinks;
  const wantsLanding = built.enabled || template.category === 'link_hub';

  if (!wantsLanding) {
    return { enabled: false, page: emptyLandingPage };
  }

  const page: LandingPageData = {
    ...emptyLandingPage,
    template: built.template ?? (template.category === 'link_hub' ? 'hotel' : 'minimal'),
    title: built.title ?? template.suggestedQrName,
    subtitle: built.subtitle ?? '',
    accentColor: built.accentColor ?? emptyLandingPage.accentColor,
    ctaLabel: built.ctaLabel ?? '',
    leadFormEnabled: built.leadFormEnabled ?? false,
    leadForm: { ...defaultLeadForm, ...built.leadForm },
    ...(hubLinks?.length ? { hubMode: true, hubLinks: [...hubLinks] } : {}),
  };

  let hubUrl: string | undefined;
  if (template.category === 'link_hub' && hubLinks?.length) {
    hubUrl = hubLinks.find((l) => l.url?.trim())?.url ?? '';
  }

  return { enabled: true, page, hubUrl: hubUrl || undefined };
}

export function applyIndustryTemplateToForm(
  template: IndustryTemplate,
  actions: {
    setActiveTemplate: (template: IndustryTemplate) => void;
    setTemplateGuideDismissed: (dismissed: boolean) => void;
    setCategory: (category: string) => void;
    setQrData: (data: Record<string, string>) => void;
    resetStyleHistory: (style: QRStyleConfig) => void;
    setName: (name: string) => void;
    setLandingEnabled: (enabled: boolean) => void;
    setLandingPage: (page: LandingPageData) => void;
    setStep: (step: number) => void;
  },
) {
  const { enabled, page, hubUrl } = buildLandingPageFromIndustryTemplate(template);

  actions.setActiveTemplate(template);
  actions.setTemplateGuideDismissed(false);
  actions.setCategory(template.category);
  actions.setQrData({ ...template.qrData });
  actions.resetStyleHistory(normalizeQRStyle({ ...DEFAULT_QR_STYLE, ...template.style }));
  actions.setName(template.suggestedQrName);

  if (enabled) {
    actions.setLandingEnabled(true);
    actions.setLandingPage(page);
    if (hubUrl) actions.setQrData({ url: hubUrl });
  }

  actions.setStep(1);
}

export function linkHubCategoryDefaults(): LandingPageData {
  return {
    ...emptyLandingPage,
    template: 'minimal',
    hubMode: true,
    hubLinks: [
      { label: 'Website', url: '' },
      { label: 'Instagram', url: '' },
    ],
  };
}
