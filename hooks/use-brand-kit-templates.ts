'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import type { BrandKitTemplate } from '@/lib/brand-kit-types';

export function useBrandKitTemplates() {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<BrandKitTemplate[]>([]);
  const [limit, setLimit] = useState(3);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch('/api/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates ?? []);
        setLimit(data.limit ?? 3);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const deleteTemplate = async (id: string) => {
    if (!confirm(t('settings.templates.confirmDelete'))) return;
    const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(t('settings.templates.deleted'));
      fetchTemplates();
    }
  };

  return { t, templates, limit, loading, deleteTemplate };
}

export type BrandKitTemplatesState = ReturnType<typeof useBrandKitTemplates>;
