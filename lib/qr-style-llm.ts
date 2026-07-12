import type { QRStyleConfig, DotStyle, CornerStyle, FrameStyle } from '@/lib/qr-style';
import { normalizeQRStyle, DOT_STYLES, CORNER_STYLES, FRAME_STYLES } from '@/lib/qr-style';
import { suggestStyleForCategory } from '@/lib/qr-ai';
import { aiLanguageName, type AiLocale } from '@/lib/i18n/ai-locale';

export type QrStyleLlmLocale = AiLocale;

export type QrStyleLlmInput = {
  category: string;
  qrName?: string;
  locale: QrStyleLlmLocale;
  businessContext?: string;
  currentStyle?: Partial<QRStyleConfig>;
};

export type QrStyleLlmResult = {
  style: Partial<QRStyleConfig>;
  source: 'llm' | 'template';
};

const DOT_IDS = new Set(DOT_STYLES.map((d) => d.id));
const CORNER_IDS = new Set(CORNER_STYLES.map((d) => d.id));
const FRAME_IDS = new Set(FRAME_STYLES.map((d) => d.id));

type LlmPayload = {
  fgColor?: string;
  bgColor?: string;
  dotStyle?: string;
  cornerStyle?: string;
  cornerDotStyle?: string;
  gradientEnabled?: boolean;
  gradientColor2?: string;
  frameStyle?: string;
  frameColor?: string;
  frameText?: string;
  frameTextColor?: string;
  errorCorrection?: string;
};

function isHexColor(v: string | undefined): v is string {
  return Boolean(v && /^#[0-9a-fA-F]{6}$/.test(v));
}

function pickEnum<T extends string>(value: string | undefined, allowed: Set<string>, fallback: T): T {
  if (value && allowed.has(value)) return value as T;
  return fallback;
}

function sanitizePayload(raw: LlmPayload, fallback: Partial<QRStyleConfig>): Partial<QRStyleConfig> {
  const patch: Partial<QRStyleConfig> = {};
  if (isHexColor(raw.fgColor)) patch.fgColor = raw.fgColor;
  if (isHexColor(raw.bgColor)) patch.bgColor = raw.bgColor;
  if (isHexColor(raw.gradientColor2)) patch.gradientColor2 = raw.gradientColor2;
  if (isHexColor(raw.frameColor)) patch.frameColor = raw.frameColor;
  if (isHexColor(raw.frameTextColor)) patch.frameTextColor = raw.frameTextColor;
  if (typeof raw.gradientEnabled === 'boolean') patch.gradientEnabled = raw.gradientEnabled;
  patch.dotStyle = pickEnum<DotStyle>(raw.dotStyle, DOT_IDS, (fallback.dotStyle as DotStyle) ?? 'rounded');
  patch.cornerStyle = pickEnum<CornerStyle>(
    raw.cornerStyle,
    CORNER_IDS,
    (fallback.cornerStyle as CornerStyle) ?? 'extra-rounded'
  );
  patch.cornerDotStyle = pickEnum<CornerStyle>(
    raw.cornerDotStyle,
    CORNER_IDS,
    (fallback.cornerDotStyle as CornerStyle) ?? patch.cornerStyle
  );
  patch.frameStyle = pickEnum<FrameStyle>(
    raw.frameStyle,
    FRAME_IDS,
    (fallback.frameStyle as FrameStyle) ?? 'badge'
  );
  if (raw.frameText?.trim()) patch.frameText = raw.frameText.trim().slice(0, 24);
  if (['L', 'M', 'Q', 'H'].includes(raw.errorCorrection ?? '')) {
    patch.errorCorrection = raw.errorCorrection as QRStyleConfig['errorCorrection'];
  }
  return patch;
}

function buildSystemPrompt(locale: QrStyleLlmLocale): string {
  const lang = `${aiLanguageName(locale)} frame text when frameText is set`;
  return `You are a QR code brand designer for QRbanner. Return ONLY valid JSON with optional keys:
fgColor, bgColor, dotStyle, cornerStyle, cornerDotStyle, gradientEnabled, gradientColor2,
frameStyle, frameColor, frameText, frameTextColor, errorCorrection.
dotStyle: square|dots|rounded|extra-rounded|classy|classy-rounded
cornerStyle/cornerDotStyle: square|dot|rounded|extra-rounded|dots|classy|classy-rounded
frameStyle: none|border|rounded|badge|scan-me|shadow|double|sticker|coupon
errorCorrection: L|M|Q|H
Colors must be #RRGGBB hex. High scan contrast. ${lang}. No markdown.`;
}

function buildUserPrompt(input: QrStyleLlmInput): string {
  const parts = [
    `QR category: ${input.category}`,
    input.qrName ? `Name: ${input.qrName}` : null,
    input.businessContext ? `Context: ${input.businessContext}` : null,
    'Suggest a cohesive on-brand QR style for print and digital.',
  ].filter(Boolean);
  return parts.join('\n');
}

export function isQrStyleLlmConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function generateQrStyleWithLlm(input: QrStyleLlmInput): Promise<QrStyleLlmResult> {
  const fallbackStyle = suggestStyleForCategory(input.category, input.qrName);
  const fallback = (): QrStyleLlmResult => ({
    style: normalizeQRStyle({ ...fallbackStyle, errorCorrection: 'H' }),
    source: 'template',
  });

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return fallback();

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildSystemPrompt(input.locale) },
          { role: 'user', content: buildUserPrompt(input) },
        ],
      }),
    });

    if (!res.ok) {
      console.error('[qr-style-llm] OpenAI error', res.status);
      return fallback();
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return fallback();

    const parsed = JSON.parse(content) as LlmPayload;
    const patch = sanitizePayload(parsed, fallbackStyle);
    if (!patch.fgColor && !patch.bgColor && !patch.dotStyle) return fallback();

    return {
      style: normalizeQRStyle({ ...fallbackStyle, ...patch, errorCorrection: patch.errorCorrection ?? 'H' }),
      source: 'llm',
    };
  } catch (err) {
    console.error('[qr-style-llm]', err);
    return fallback();
  }
}
