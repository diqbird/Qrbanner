import type { HubLink } from '@/lib/landing-page';

export const DEFAULT_HUB_LINKS: HubLink[] = [
  { label: 'Website', url: '' },
  { label: 'Instagram', url: '' },
];

export function hubLinksValid(links?: HubLink[]): boolean {
  return Boolean(
    links?.some((l) => {
      const label = l.label?.trim();
      const url = l.url?.trim();
      if (!label || !url) return false;
      const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      try {
        const u = new URL(normalized);
        return u.hostname.includes('.');
      } catch {
        return false;
      }
    }),
  );
}

export function firstHubUrl(links?: HubLink[]): string {
  const hit = links?.find((l) => l.url.trim());
  const raw = hit?.url.trim() ?? '';
  if (!raw) return '';
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}
