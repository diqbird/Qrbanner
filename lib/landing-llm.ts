import type { LandingPageData } from '@/lib/landing-page';
import { generateLandingPageCopy } from '@/lib/landing-ai';

export type LandingLlmLocale = 'en' | 'tr';

export type LandingLlmInput = {
  category: string;
  qrName?: string;
  targetUrl?: string;
  locale: LandingLlmLocale;
  businessContext?: string;
};

export type LandingLlmResult = {
  copy: Partial<LandingPageData>;
  source: 'llm' | 'template';
};

type LlmPayload = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  metaTitle?: string;
  metaDescription?: string;
  template?: string;
};

const TEMPLATE_IDS = new Set(['minimal', 'restaurant', 'hotel', 'event', 'business']);

function clip(value: string | undefined, max: number): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/\s+/g, ' ');
  if (!trimmed) return undefined;
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

function sanitizePayload(raw: LlmPayload, locale: LandingLlmLocale): Partial<LandingPageData> {
  const title = clip(raw.title, 80);
  const subtitle = clip(raw.subtitle, 200);
  const ctaLabel = clip(raw.ctaLabel, 40);
  const metaTitle = clip(raw.metaTitle, 70);
  const metaDescription = clip(raw.metaDescription, 160);
  const template = raw.template && TEMPLATE_IDS.has(raw.template) ? raw.template : undefined;

  const copy: Partial<LandingPageData> = {
    ...(title ? { title } : {}),
    ...(subtitle ? { subtitle } : {}),
    ...(ctaLabel ? { ctaLabel } : {}),
    ...(template ? { template: template as LandingPageData['template'] } : {}),
    seo: {
      ...(metaTitle ? { metaTitle } : {}),
      ...(metaDescription ? { metaDescription } : {}),
      indexable: false,
    },
  };

  if (!copy.title && locale === 'tr') {
    copy.title = 'Hoş geldiniz';
  }
  if (!copy.title) {
    copy.title = 'Welcome';
  }

  return copy;
}

function buildSystemPrompt(locale: LandingLlmLocale): string {
  const lang = locale === 'tr' ? 'Turkish' : 'English';
  return `You write concise QR scan landing page copy for QRbanner (${lang}).
Return ONLY valid JSON with keys: title, subtitle, ctaLabel, metaTitle, metaDescription, template.
template must be one of: minimal, restaurant, hotel, event, business.
Keep title under 80 chars, subtitle under 200, ctaLabel under 40, metaTitle under 70, metaDescription under 160.
Tone: clear, friendly, conversion-focused. No markdown, no emojis unless culturally natural.`;
}

function buildUserPrompt(input: LandingLlmInput): string {
  const parts = [
    `Category: ${input.category || 'url'}`,
    input.qrName ? `QR name: ${input.qrName}` : null,
    input.targetUrl ? `Destination URL: ${input.targetUrl}` : null,
    input.businessContext ? `Extra context: ${input.businessContext}` : null,
    `Language: ${input.locale === 'tr' ? 'Turkish' : 'English'}`,
  ].filter(Boolean);

  return parts.join('\n');
}

export function isLandingLlmConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function generateLandingCopyWithLlm(input: LandingLlmInput): Promise<LandingLlmResult> {
  const fallback = generateLandingPageCopy(input.category, input.qrName, input.locale);

  if (!isLandingLlmConfigured()) {
    return { copy: fallback, source: 'template' };
  }

  const apiKey = process.env.OPENAI_API_KEY!.trim();
  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini';

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.65,
        max_tokens: 450,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildSystemPrompt(input.locale) },
          { role: 'user', content: buildUserPrompt(input) },
        ],
      }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) {
      console.error('[landing-llm] OpenAI error', res.status, await res.text().catch(() => ''));
      return { copy: fallback, source: 'template' };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return { copy: fallback, source: 'template' };
    }

    const parsed = JSON.parse(content) as LlmPayload;
    const sanitized = sanitizePayload(parsed, input.locale);

    return {
      copy: {
        ...fallback,
        ...sanitized,
        seo: {
          ...fallback.seo,
          ...sanitized.seo,
        },
      },
      source: 'llm',
    };
  } catch (err) {
    console.error('[landing-llm] generate', err);
    return { copy: fallback, source: 'template' };
  }
}
