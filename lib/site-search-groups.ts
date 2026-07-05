import { SITE_SEARCH_INDEX } from '@/lib/site-search';

type SearchItem = (typeof SITE_SEARCH_INDEX)[number];

export function filterSiteSearchGroups(
  query: string,
  t: (key: string) => string,
): Map<string, SearchItem[]> {
  const q = query.trim().toLowerCase();
  const filtered = SITE_SEARCH_INDEX.filter((item) => {
    if (!q) return true;
    const title = t(item.titleKey).toLowerCase();
    const desc = item.descriptionKey ? t(item.descriptionKey).toLowerCase() : '';
    const kw = (item.keywords ?? []).join(' ').toLowerCase();
    return title.includes(q) || desc.includes(q) || kw.includes(q) || item.href.includes(q);
  });

  const byGroup = new Map<string, SearchItem[]>();
  for (const item of filtered) {
    const list = byGroup.get(item.groupKey) ?? [];
    list.push(item);
    byGroup.set(item.groupKey, list);
  }
  return byGroup;
}
