import type { LandingTemplate } from '@/lib/landing-page';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

function resolved(t: TranslateFn, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

export function resolveLandingTemplateName(
  t: TranslateFn,
  id: LandingTemplate,
  fallback: string,
): string {
  return resolved(t, `landingEditor.templates.${id}.name`, fallback);
}

export function resolveLandingTemplateDescription(
  t: TranslateFn,
  id: LandingTemplate,
  fallback: string,
): string {
  return resolved(t, `landingEditor.templates.${id}.description`, fallback);
}
