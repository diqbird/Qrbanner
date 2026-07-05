import { buildQRPayload } from '@/lib/qr-utils';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { validateTemplateRequiredFields } from '@/lib/industry-templates';
import { hubLinksValid, firstHubUrl } from '@/components/qr/link-hub-editor';
import type { LandingPageData } from '@/components/qr/landing-page-editor';

export function canProceedCreateStep({
  step,
  category,
  name,
  qrData,
  payloadData,
  activeTemplate,
  landingPage,
}: {
  step: number;
  category: string;
  name: string;
  qrData: Record<string, string>;
  payloadData: () => Record<string, string>;
  activeTemplate: IndustryTemplate | null;
  landingPage: LandingPageData;
}) {
  if (step === 0) return Boolean(category);
  if (step === 1) {
    if (!name.trim()) return false;
    if (category === 'link_hub') {
      return hubLinksValid(landingPage.hubLinks) && Boolean(firstHubUrl(landingPage.hubLinks));
    }
    if (activeTemplate && !validateTemplateRequiredFields(activeTemplate, qrData)) return false;
    return Boolean(buildQRPayload(category, payloadData()).trim());
  }
  return true;
}
