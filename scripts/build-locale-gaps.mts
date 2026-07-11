/**
 * Extract missing i18n sections from en.ts for de/es gap files.
 * Run: npx tsx scripts/build-locale-gaps.mts
 */
import { readFileSync, writeFileSync } from 'node:fs';

const en = (await import('../lib/i18n/en.ts')).en;

function topLevelKeys(filePath: string): Set<string> {
  const src = readFileSync(filePath, 'utf8');
  const keys = new Set<string>();
  for (const m of src.matchAll(/^  ([a-zA-Z][a-zA-Z0-9]*): \{/gm)) {
    keys.add(m[1]);
  }
  return keys;
}

const deKeysExisting = topLevelKeys('lib/i18n/de.ts');
const esKeysExisting = topLevelKeys('lib/i18n/es.ts');

function toTsValue(value: unknown, depth: number): string {
  const pad = '  '.repeat(depth);
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return (
      '[\n' +
      value.map((item) => `${pad}  ${toTsValue(item, depth + 1)}`).join(',\n') +
      `\n${pad}]`
    );
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return (
      '{\n' +
      entries
        .map(([k, v]) => {
          const key = /^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
          return `${pad}  ${key}: ${toTsValue(v, depth + 1)}`;
        })
        .join(',\n') +
      `\n${pad}}`
    );
  }
  return String(value);
}

const SKIP_KEYS = new Set(['fields', 'templates']);
const FORCE_FULL = ['enterpriseWorkspace', 'superAdmin'] as const;

function missingKeys(existing: Set<string>): string[] {
  const keys = new Set([
    ...Object.keys(en).filter((k) => !existing.has(k) && !SKIP_KEYS.has(k)),
    ...FORCE_FULL.filter((k) => k in en),
  ]);
  return [...keys].sort();
}

function buildGapFile(locale: 'de' | 'es', keys: string[]): string {
  const templatesBlock =
    locale === 'de'
      ? `
import { industryTemplateCopyEn } from './industry-template-copy';
import { templateMetaEn } from './template-meta-copy';
import { templateCtaEn } from './template-cta-copy';
import { templatePrintCopyEn } from './template-print-copy';
import { printTemplateCopyEn } from './print-template-copy';
import { visualPresetCopyEn } from './visual-preset-copy';
`
      : `
import { industryTemplateCopyEn } from './industry-template-copy';
import { templateMetaEn } from './template-meta-copy';
import { templateCtaEn } from './template-cta-copy';
import { templatePrintCopyEn } from './template-print-copy';
import { printTemplateCopyEn } from './print-template-copy';
import { visualPresetCopyEn } from './visual-preset-copy';
`;

  const templatesSection =
    keys.includes('templates') || !SKIP_KEYS.has('templates')
      ? `
  templates: {
    ...industryTemplateCopyEn,
    meta: templateMetaEn,
    ctaSuggestions: templateCtaEn,
    printLayouts: templatePrintCopyEn,
    printFormats: printTemplateCopyEn,
    visualPresets: {
      ...(industryTemplateCopyEn.visualPresets as Record<string, unknown>),
      presets: visualPresetCopyEn.presets,
      designStyles: visualPresetCopyEn.designStyles,
    },
  },`
      : '';

  const header = `/** Locale gap sections for ${locale.toUpperCase()}. */
import type { TranslationTree } from './types';
${templatesBlock}
export const ${locale}LocaleGaps: TranslationTree = {
`;
  const body = keys
    .map((k) => {
      const val = (en as Record<string, unknown>)[k];
      return `  ${k}: ${toTsValue(val, 1)},`;
    })
    .join('\n');
  return `${header}${body}${templatesSection}\n};\n`;
}

const deKeys = missingKeys(deKeysExisting);
const esKeys = missingKeys(esKeysExisting);

writeFileSync('lib/i18n/de-locale-gaps.generated.ts', buildGapFile('de', deKeys));
writeFileSync('lib/i18n/es-locale-gaps.generated.ts', buildGapFile('es', esKeys));

console.log(`DE missing: ${deKeys.length} sections`);
console.log(deKeys.join(', '));
console.log(`ES missing: ${esKeys.length} sections`);
