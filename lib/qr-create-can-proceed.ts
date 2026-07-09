import { buildQRPayload } from '@/lib/qr-utils';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { validateTemplateRequiredFields } from '@/lib/industry-templates';
import { hubLinksValid, firstHubUrl } from '@/components/qr/link-hub-editor';
import type { LandingPageData } from '@/components/qr/landing-page-editor';

export type CreateStepBlockerArgs = {
  step: number;
  category: string;
  name: string;
  qrData: Record<string, string>;
  payloadData: () => Record<string, string>;
  activeTemplate: IndustryTemplate | null;
  landingPage: LandingPageData;
};

/** Human-readable missing-field labels for the current wizard step (empty when ready). */
export function getCreateStepBlockers({
  step,
  category,
  name,
  qrData,
  payloadData,
  activeTemplate,
  landingPage,
}: CreateStepBlockerArgs): string[] {
  if (step === 0) {
    return category ? [] : ['category'];
  }
  if (step !== 1) return [];

  const blockers: string[] = [];
  if (!name.trim()) blockers.push('name');

  if (category === 'link_hub') {
    if (!hubLinksValid(landingPage.hubLinks) || !firstHubUrl(landingPage.hubLinks)) {
      blockers.push('hubLinks');
    }
    return blockers;
  }

  if (activeTemplate) {
    for (const section of activeTemplate.sections) {
      for (const field of section.fields) {
        if (field.required && !(qrData[field.key] ?? '').trim()) {
          blockers.push(field.label);
        }
      }
    }
  }

  if (!buildQRPayload(category, payloadData()).trim()) {
    if (!activeTemplate) blockers.push('content');
  }

  return blockers;
}

export function canProceedCreateStep(args: CreateStepBlockerArgs) {
  if (args.step === 0) return Boolean(args.category);
  if (args.step === 1) {
    if (!args.name.trim()) return false;
    if (args.category === 'link_hub') {
      return (
        hubLinksValid(args.landingPage.hubLinks) && Boolean(firstHubUrl(args.landingPage.hubLinks))
      );
    }
    if (args.activeTemplate && !validateTemplateRequiredFields(args.activeTemplate, args.qrData)) {
      return false;
    }
    return Boolean(buildQRPayload(args.category, args.payloadData()).trim());
  }
  return true;
}
