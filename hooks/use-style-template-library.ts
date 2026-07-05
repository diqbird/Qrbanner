'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { QRStyleConfig } from '@/lib/qr-style';
import { normalizeQRStyle } from '@/lib/qr-style';
import type { StyleTemplateRow } from '@/lib/style-template-types';

export function useStyleTemplateLibrary(
  currentStyle: Partial<QRStyleConfig>,
  logoPath: string | null,
) {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<StyleTemplateRow[]>([]);
  const [limit, setLimit] = useState(3);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const saveTemplate = async () => {
    if (!name.trim()) return toast.error(t('settings.templates.nameRequired'));
    setSaving(true);
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          style: normalizeQRStyle(currentStyle),
          logoPath,
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, data.error, 'settings.templates.saveFailed'));
      toast.success(t('settings.templates.saved'));
      setName('');
      fetchTemplates();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm(t('settings.templates.confirmDelete'))) return;
    const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(t('settings.templates.deleted'));
      fetchTemplates();
    }
  };

  return {
    t,
    templates,
    limit,
    name,
    setName,
    loading,
    saving,
    saveTemplate,
    deleteTemplate,
  };
}

export type StyleTemplateLibraryState = ReturnType<typeof useStyleTemplateLibrary>;
