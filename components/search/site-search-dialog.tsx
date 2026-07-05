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
import { filterSiteSearchGroups } from '@/lib/site-search-groups';

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

  const groups = useMemo(() => filterSiteSearchGroups(query, t), [query, t]);

  const navigate = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(localePath(href));
    },
    [localePath, onOpenChange, router],
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
                <CommandItem
                  key={item.id}
                  value={`${item.id} ${t(item.titleKey)}`}
                  onSelect={() => navigate(item.href)}
                >
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

export { useSiteSearchShortcut } from '@/hooks/use-site-search-shortcut';
