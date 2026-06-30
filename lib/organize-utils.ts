export const MAX_LABELS_PER_QR = 10;
export const MAX_LABEL_LENGTH = 30;
export const MAX_FOLDER_NAME_LENGTH = 60;

export const FOLDER_COLORS = [
  '#4f46e5', '#0071e3', '#059669', '#d97706',
  '#dc2626', '#7c3aed', '#0891b2', '#64748b',
];

export function normalizeLabels(input: unknown): string[] {
  let raw: string[] = [];
  if (Array.isArray(input)) {
    raw = input.map(String);
  } else if (typeof input === 'string') {
    raw = input.split(/[,;]+/);
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    const label = item.trim().slice(0, MAX_LABEL_LENGTH);
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(label);
    if (out.length >= MAX_LABELS_PER_QR) break;
  }
  return out;
}

export function normalizeFolderName(name: string): string {
  return name.trim().slice(0, MAX_FOLDER_NAME_LENGTH);
}
