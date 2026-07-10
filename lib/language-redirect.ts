export interface LanguageRedirectRule {
  id: string;
  language: string;
  url: string;
  label?: string;
}

export interface LanguageRedirectData {
  rules: LanguageRedirectRule[];
}

export const emptyLanguageRedirectData: LanguageRedirectData = {
  rules: [],
};

export const MAX_LANGUAGE_REDIRECT_RULES = 15;

export const LANGUAGE_OPTIONS: { code: string; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'tr', name: 'Turkish' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: '*', name: 'Fallback (other languages)' },
];

function normalizeLanguage(code: string): string {
  return code.trim().toLowerCase().slice(0, 8);
}

export function parseLanguageRedirectData(raw: unknown): LanguageRedirectData {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return emptyLanguageRedirectData;
  }
  const rulesRaw = (raw as { rules?: unknown }).rules;
  if (!Array.isArray(rulesRaw)) return emptyLanguageRedirectData;

  const rules: LanguageRedirectRule[] = [];
  for (const item of rulesRaw) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const language = normalizeLanguage(String(row.language ?? ''));
    const url = typeof row.url === 'string' ? row.url.trim() : '';
    if (!language || !url) continue;
    rules.push({
      id: typeof row.id === 'string' ? row.id : `lang-${rules.length}`,
      language,
      url: url.slice(0, 2048),
      label: typeof row.label === 'string' ? row.label.slice(0, 80) : undefined,
    });
    if (rules.length >= MAX_LANGUAGE_REDIRECT_RULES) break;
  }
  return { rules };
}

export function sanitizeLanguageRedirectData(raw: unknown): LanguageRedirectData {
  return parseLanguageRedirectData(raw);
}

/** Parse primary language tags from Accept-Language (e.g. "tr-TR,tr;q=0.9,en;q=0.8" → ["tr","en"]). */
export function parseAcceptLanguageTags(header: string | null): string[] {
  if (!header?.trim()) return [];
  const tags: string[] = [];
  for (const part of header.split(',')) {
    const token = part.split(';')[0]?.trim().toLowerCase();
    if (!token) continue;
    const primary = token.split('-')[0];
    if (primary && !tags.includes(primary)) tags.push(primary);
  }
  return tags;
}

/** Returns matched URL or null to keep current redirect. */
export function resolveLanguageRedirectUrl(
  languageRedirectData: unknown,
  acceptLanguageHeader: string | null
): string | null {
  const data = parseLanguageRedirectData(languageRedirectData);
  if (!data.rules.length) return null;

  const tags = parseAcceptLanguageTags(acceptLanguageHeader);
  for (const tag of tags) {
    const exact = data.rules.find((r) => r.language === tag);
    if (exact) return exact.url;
  }

  const wildcard = data.rules.find((r) => r.language === '*');
  return wildcard?.url ?? null;
}
