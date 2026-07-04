'use client';

import { useCallback, useEffect, useState } from 'react';
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
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  FileSpreadsheet,
  Search,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

type DashboardCommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFocusSearch?: () => void;
};

const NAV_ITEMS = [
  { id: 'dashboard', href: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard.title' },
  { id: 'create', href: '/qr/create?quick=1', icon: PlusCircle, labelKey: 'dashboard.createQr' },
  { id: 'bulk', href: '/qr/bulk', icon: FileSpreadsheet, labelKey: 'dashboard.bulkImport' },
  { id: 'campaign', href: '/qr/campaign', icon: Sparkles, labelKey: 'campaign.badge' },
  { id: 'settings', href: '/settings', icon: Settings, labelKey: 'dashboard.settings' },
] as const;

export function DashboardCommandPalette({
  open,
  onOpenChange,
  onFocusSearch,
}: DashboardCommandPaletteProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const navigate = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [onOpenChange, router]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={t('commandPalette.placeholder')}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>{t('commandPalette.noResults')}</CommandEmpty>
        <CommandGroup heading={t('commandPalette.actions')}>
          <CommandItem
            value="search qr codes"
            onSelect={() => {
              onOpenChange(false);
              onFocusSearch?.();
            }}
          >
            <Search className="mr-2 h-4 w-4" />
            {t('commandPalette.focusSearch')}
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={t('commandPalette.navigate')}>
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.id} ${t(item.labelKey)}`}
              onSelect={() => navigate(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {t(item.labelKey)}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useDashboardCommandShortcut(onOpen: () => void) {
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
