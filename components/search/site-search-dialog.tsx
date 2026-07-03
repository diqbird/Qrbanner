'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { SITE_SEARCH_INDEX } from '@/lib/site-search';

type SiteSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SiteSearchDialog({ open, onOpenChange }: SiteSearchDialogProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const localePath = useLocalePath();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = SITE_SEARCH_INDEX.filter((item) => {
      if (!q) return true;
      const title = t(item.titleKey).toLowerCase();
      const desc = item.descriptionKey ? t(item.descriptionKey).toLowerCase() : '';
      const kw = (item.keywords ?? []).join(' ').toLowerCase();
      return title.includes(q) || desc.includes(q) || kw.includes(q) || item.href.includes(q);
    });

    const byGroup = new Map<string, typeof filtered>();
    for (const item of filtered) {
      const list = byGroup.get(item.groupKey) ?? [];
      list.push(item);
      byGroup.set(item.groupKey, list);
    }
    return byGroup;
  }, [query, t]);

  const navigate = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(localePath(href));
    },
    [localePath, onOpenChange, router]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={t('siteSearch.placeholder')}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>{t('siteSearch.noResults')}</CommandEmpty>
        {Array.from(groups.entries()).map(([groupKey, items], i) => (
          <div key={groupKey}>
            {i > 0 && <CommandSeparator />}
            <CommandGroup heading={t(groupKey)}>
              {items.map((item) => (
                <CommandItem key={item.id} value={`${item.id} ${t(item.titleKey)}`} onSelect={() => navigate(item.href)}>
                  <span>{t(item.titleKey)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

/** Global Cmd+K / Ctrl+K shortcut hook. */
export function useSiteSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onOpen]);
}
