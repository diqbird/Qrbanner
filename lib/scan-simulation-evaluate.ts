import { payloadsMatch, type DecodeConfidence } from '@/lib/qr-scan-decode';
import type { ScannabilityResult } from '@/lib/scannability';
import type { ScanResult } from '@/lib/scan-simulation-types';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { Locale } from '@/lib/i18n/types';

type Translate = (key: string, params?: Record<string, string | number>) => string;

export function evaluateScanDecode({
  decoded,
  source,
  confidence,
  expectedContent,
  scannability,
  t,
  locale,
}: {
  decoded: string | null;
  source: 'digital' | 'camera';
  confidence?: DecodeConfidence;
  expectedContent?: string;
  scannability: ScannabilityResult;
  t: Translate;
  locale: Locale;
}): ScanResult {
  const confidenceNote = (c: DecodeConfidence) => {
    if (c === 'high') return t('scan.confidenceHigh');
    if (c === 'medium') return t('scan.confidenceMedium');
    return t('scan.confidenceLow');
  };

  if (!decoded) {
    return {
      status: 'fail',
      title: source === 'digital' ? t('scan.failDecode') : t('scan.failNoQr'),
      detail: source === 'digital' ? t('scan.failDecodeDetail') : t('scan.failNoQrDetail'),
    };
  }

  if (expectedContent && !payloadsMatch(decoded, expectedContent)) {
    const preview = `${decoded.slice(0, 120)}${decoded.length > 120 ? '…' : ''}`;
    return {
      status: 'warn',
      title: t('scan.warnPayload'),
      detail: t('scan.decodedDetail', { payload: preview }),
      decoded,
      confidence,
    };
  }

  const gradeNote =
    scannability.grade === 'A' || scannability.grade === 'B'
      ? t('scan.gradeGood')
      : t('scan.gradeWarn', { grade: scannability.grade });

  const dpiNote = t('scan.minDpi', { dpi: formatLocaleNumber(scannability.printDpiRecommendation, locale) });
  const confNote = confidence ? confidenceNote(confidence) : '';

  return {
    status: confidence === 'low' && source === 'digital' ? 'warn' : 'pass',
    title: source === 'digital' ? t('scan.passDigital') : t('scan.passCamera'),
    detail: [confNote, gradeNote, dpiNote].filter(Boolean).join(' '),
    decoded,
    confidence,
  };
}
