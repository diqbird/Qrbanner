import type { IndustryTemplate } from '@/lib/industry-templates';
import {
  resolveTemplateCtaSuggestions,
  resolveTemplateName,
  resolveTemplateTagline,
  resolveTemplateTips,
  resolveTemplateUseCases,
} from '@/lib/i18n/resolve-template-copy';
import { resolveVisualDesignStyle, resolveVisualPresetName } from '@/lib/i18n/resolve-visual-preset-copy';
import { computeScannability } from '@/lib/scannability';
import { getVisualPresetById } from '@/lib/visual-qr-presets';
import { PRINT_TEMPLATES } from '@/lib/print-banner';
import { resolveIndustryPrintNotes, resolvePrintTemplateName } from '@/lib/i18n/resolve-print-copy';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function resolveIndustryTemplateGuideCopy(t: Translate, template: IndustryTemplate) {
  const profile = template.designProfile;
  const scan = computeScannability(template.style);
  const visualPreset = template.visualPresetId ? getVisualPresetById(template.visualPresetId) : undefined;
  const recommendedPrint = template.printLayout
    ? PRINT_TEMPLATES.find((p) => p.id === template.printLayout?.recommended)
    : undefined;

  return {
    profile,
    scan,
    visualPreset,
    displayName: resolveTemplateName(t, template.id, template.name),
    tagline: resolveTemplateTagline(t, template.id, template.tagline),
    useCases: resolveTemplateUseCases(t, template.id, template.useCases),
    tips: resolveTemplateTips(t, template.id, template.tips),
    ctaSuggestions: profile
      ? resolveTemplateCtaSuggestions(t, template.id, profile.ctaSuggestions)
      : [],
    designStyleLabel: profile ? resolveVisualDesignStyle(t, profile.designStyle) : null,
    visualPresetLabel: visualPreset ? resolveVisualPresetName(t, visualPreset) : null,
    recommendedPrintName: recommendedPrint
      ? resolvePrintTemplateName(t, recommendedPrint.id, recommendedPrint.name)
      : template.printLayout?.recommended,
    printNotes: template.printLayout
      ? resolveIndustryPrintNotes(t, template.id, template.printLayout.notes)
      : null,
  };
}

export type IndustryTemplateGuideCopy = ReturnType<typeof resolveIndustryTemplateGuideCopy>;
