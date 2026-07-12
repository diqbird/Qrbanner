import { QR_CATEGORIES } from '@/lib/qr-utils';
import { emptyLandingPage, type LandingTemplate } from '@/lib/landing-page';
import { getTemplateById } from '@/lib/industry-templates';
import { DEFAULT_QR_STYLE, normalizeQRStyle } from '@/lib/qr-style';
import { generateCampaignFallback } from '@/lib/campaign-fallback';
import type { CampaignGenerateInput, CampaignPlan, CampaignQrItem } from '@/lib/campaign-types';
import { MAX_CAMPAIGN_ITEMS as MAX_ITEMS } from '@/lib/campaign-types';
import { aiLanguageName, pickAiText, type AiLocale } from '@/lib/i18n/ai-locale';

const VALID_CATEGORIES = new Set(QR_CATEGORIES.map((c) => c.id));
const LANDING_TEMPLATES = new Set(['minimal', 'restaurant', 'hotel', 'event', 'business']);

type LlmItem = {
  name?: string;
  category?: string;
  purpose?: string;
  qrData?: Record<string, string>;
  templateId?: string;
  landingEnabled?: boolean;
  landingTitle?: string;
  landingSubtitle?: string;
  landingTemplate?: string;
};

type LlmPayload = {
  businessName?: string;
  industry?: string;
  summary?: string;
  accentColor?: string;
  items?: LlmItem[];
  printSuggestions?: string[];
};

function clip(value: string | undefined, max: number): string | undefined {
  if (!value) return undefined;
  const t = value.trim().replace(/\s+/g, ' ');
  if (!t) return undefined;
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

function newKey(prefix: string, index: number): string {
  return `${prefix}-${index}`;
}

function sanitizeItem(raw: LlmItem, index: number, accent: string): CampaignQrItem | null {
  const category = String(raw.category ?? '').trim();
  if (!VALID_CATEGORIES.has(category as (typeof QR_CATEGORIES)[number]['id'])) {
    return null;
  }
  const name = clip(raw.name, 80);
  if (!name) return null;

  const qrData: Record<string, string> = {};
  if (raw.qrData && typeof raw.qrData === 'object') {
    for (const [k, v] of Object.entries(raw.qrData)) {
      if (typeof v === 'string' && k.length <= 40) {
        qrData[k] = v.slice(0, 500);
      }
    }
  }

  const templateId = raw.templateId?.trim();
  const tmpl = templateId ? getTemplateById(templateId) : undefined;

  let landingPage: CampaignQrItem['landingPage'];
  const landingEnabled = Boolean(raw.landingEnabled);
  if (landingEnabled) {
    const template =
      raw.landingTemplate && LANDING_TEMPLATES.has(raw.landingTemplate)
        ? (raw.landingTemplate as LandingTemplate)
        : 'minimal';
    landingPage = {
      ...emptyLandingPage,
      template,
      title: clip(raw.landingTitle, 80) ?? name,
      subtitle: clip(raw.landingSubtitle, 200) ?? '',
      accentColor: accent,
      ctaLabel: 'Continue',
    };
  }

  return {
    key: newKey(category, index),
    name,
    category,
    purpose: clip(raw.purpose, 160) ?? name,
    qrData: Object.keys(qrData).length ? qrData : tmpl?.qrData ?? { url: 'https://example.com' },
    templateId: tmpl ? templateId : undefined,
    landingEnabled,
    landingPage,
    style: tmpl ? normalizeQRStyle({ ...DEFAULT_QR_STYLE, ...tmpl.style }) : undefined,
    enabled: true,
  };
}

function buildSystemPrompt(locale: AiLocale): string {
  const categories = QR_CATEGORIES.map((c) => c.id).join(', ');
  const lang = aiLanguageName(locale);
  return `You are a QR marketing strategist for QRbanner (${lang}).
Given a one-sentence business goal, design a practical QR campaign kit (3–6 QR codes).
Return ONLY valid JSON with keys:
businessName, industry, summary, accentColor (hex), items[], printSuggestions[].

Each item: name, category, purpose, qrData (object), optional templateId, optional landingEnabled, landingTitle, landingSubtitle, landingTemplate.

category must be one of: ${categories}.
templateId optional — use when matching: restaurant-menu, wifi-guest, hotels-hospitality, event-registration, business-card, instagram-bio.
Use realistic placeholder URLs (https://...) where needed. WiFi items need ssid, password, encryption (WPA|WEP|nopass).
Keep summary under 200 chars. printSuggestions: 3–4 short print asset ideas.
Do not include markdown or emojis in JSON string values.`;
}

export function isCampaignLlmConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function generateCampaignPlan(input: CampaignGenerateInput): Promise<CampaignPlan> {
  const prompt = input.prompt.trim().slice(0, 500);
  const locale = input.locale;

  if (!prompt) {
    return generateCampaignFallback(
      input.businessName ?? 'business',
      locale,
      input.businessName
    );
  }

  if (!isCampaignLlmConfigured()) {
    return generateCampaignFallback(prompt, locale, input.businessName);
  }

  const fallback = () => generateCampaignFallback(prompt, locale, input.businessName);

  try {
    const apiKey = process.env.OPENAI_API_KEY!.trim();
    const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini';

    const userParts = [
      `Goal: ${prompt}`,
      input.businessName ? `Business name: ${input.businessName}` : null,
      input.websiteUrl ? `Website: ${input.websiteUrl}` : null,
      `Language: ${aiLanguageName(locale)}`,
    ].filter(Boolean);

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 1800,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildSystemPrompt(locale) },
          { role: 'user', content: userParts.join('\n') },
        ],
      }),
      signal: AbortSignal.timeout(35_000),
    });

    if (!res.ok) {
      console.error('[campaign-ai] OpenAI error', res.status);
      return fallback();
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return fallback();

    const parsed = JSON.parse(content) as LlmPayload;
    const accent = /^#[0-9a-fA-F]{6}$/.test(parsed.accentColor ?? '')
      ? parsed.accentColor!
      : '#0071e3';

    const items: CampaignQrItem[] = [];
    const rawItems = parsed.items ?? [];
    for (let i = 0; i < rawItems.length; i++) {
      if (items.length >= MAX_ITEMS) break;
      const item = sanitizeItem(rawItems[i], i, accent);
      if (item) items.push(item);
    }

    if (items.length < 2) return fallback();

    return {
      businessName: clip(parsed.businessName, 80) ?? input.businessName ?? items[0].name,
      industry: clip(parsed.industry, 40) ?? 'general',
      summary:
        clip(parsed.summary, 220) ??
        pickAiText(locale, {
          en: 'AI campaign suggestion',
          tr: 'AI kampanya önerisi',
          de: 'KI-Kampagnenvorschlag',
          es: 'Sugerencia de campaña con IA',
        }),
      accentColor: accent,
      items,
      printSuggestions: (parsed.printSuggestions ?? [])
        .map((s) => clip(String(s), 60))
        .filter(Boolean)
        .slice(0, 4) as string[],
      source: 'llm',
    };
  } catch (err) {
    console.error('[campaign-ai] generate', err);
    return fallback();
  }
}
