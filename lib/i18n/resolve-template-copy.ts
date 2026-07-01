import type { TemplateFieldDef, TemplateSection } from '@/lib/industry-templates';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

/** Shared field keys → existing fields.* i18n paths */
const COMMON_FIELD_I18N: Record<string, string> = {
  firstName: 'fields.firstName',
  lastName: 'fields.lastName',
  phone: 'fields.phone',
  email: 'fields.yourEmail',
  website: 'fields.website',
  address: 'fields.addressOptional',
  ssid: 'fields.wifiName',
  password: 'fields.wifiPassword',
  encryption: 'fields.securityType',
  amount: 'fields.suggestedAmount',
  coin: 'fields.cryptocurrency',
  username: 'fields.username',
  startDate: 'fields.starts',
  endDate: 'fields.ends',
  location: 'fields.eventLocation',
  description: 'fields.descriptionOptional',
  org: 'fields.companyName',
};

function resolved(t: TranslateFn, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

export function resolveTemplateName(t: TranslateFn, templateId: string, fallback: string): string {
  return resolved(t, `templates.names.${templateId}`, fallback);
}

export function resolveTemplateSectionTitle(
  t: TranslateFn,
  templateId: string,
  section: TemplateSection,
): string {
  return resolved(t, `templates.sections.${templateId}.${section.id}.title`, section.title);
}

export function resolveTemplateSectionDescription(
  t: TranslateFn,
  templateId: string,
  section: TemplateSection,
): string {
  const desc = section.description ?? '';
  if (!desc) return desc;
  return resolved(t, `templates.sections.${templateId}.${section.id}.description`, desc);
}

export function resolveTemplateFieldLabel(
  t: TranslateFn,
  templateId: string,
  field: TemplateFieldDef,
): string {
  const specific = t(`templates.fields.${templateId}.${field.key}.label`);
  if (specific !== `templates.fields.${templateId}.${field.key}.label`) return specific;

  const commonTpl = COMMON_FIELD_I18N[field.key];
  if (commonTpl) {
    const v = t(commonTpl);
    if (v !== commonTpl) return v;
  }

  return field.label;
}

export function resolveTemplateFieldPlaceholder(
  t: TranslateFn,
  templateId: string,
  field: TemplateFieldDef,
): string | undefined {
  if (!field.placeholder) return field.placeholder;
  const key = `templates.fields.${templateId}.${field.key}.placeholder`;
  return resolved(t, key, field.placeholder);
}

export function resolveTemplateFieldHint(
  t: TranslateFn,
  templateId: string,
  field: TemplateFieldDef,
): string | undefined {
  if (!field.hint) return field.hint;
  const key = `templates.fields.${templateId}.${field.key}.hint`;
  return resolved(t, key, field.hint);
}

export function resolveTemplateTagline(t: TranslateFn, templateId: string, fallback: string): string {
  return resolved(t, `templates.meta.${templateId}.tagline`, fallback);
}

export function resolveTemplateUseCases(
  t: TranslateFn,
  templateId: string,
  fallbacks: string[],
): string[] {
  return fallbacks.map((fb, i) =>
    resolved(t, `templates.meta.${templateId}.useCases.${i}`, fb),
  );
}

export function resolveTemplateTips(
  t: TranslateFn,
  templateId: string,
  fallbacks: string[],
): string[] {
  return fallbacks.map((fb, i) =>
    resolved(t, `templates.meta.${templateId}.tips.${i}`, fb),
  );
}
