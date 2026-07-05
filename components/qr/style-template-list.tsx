'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Save, Trash2 } from 'lucide-react';
import { normalizeQRStyle, type QRStyleConfig } from '@/lib/qr-style';
import type { StyleTemplateLibraryState } from '@/hooks/use-style-template-library';

export function StyleTemplateList({
  library,
  onApply,
}: {
  library: StyleTemplateLibraryState;
  onApply: (style: QRStyleConfig, logoPath: string | null) => void;
}) {
  const { t, templates, limit, name, setName, saving, saveTemplate, deleteTemplate } = library;

  return (
    <div className="rounded-lg border border-border/50 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Bookmark className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">{t('settings.templates.title')}</p>
        <Badge variant="secondary" className="ml-auto text-xs">
          {templates.length} / {limit}
        </Badge>
      </div>

      {templates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {templates.map((tpl) => (
            <div key={tpl.id} className="flex items-center gap-1 rounded-md border border-border/50 pl-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => onApply(normalizeQRStyle(tpl.style), tpl.logoPath)}
              >
                {tpl.name}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => deleteTemplate(tpl.id)}
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {templates.length < limit && (
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-1 min-w-[140px] space-y-1">
            <Label className="text-xs">{t('settings.templates.saveAs')}</Label>
            <Input
              placeholder={t('settings.templates.placeholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9"
            />
          </div>
          <Button type="button" size="sm" loading={saving} onClick={saveTemplate} className="gap-1">
            <Save className="h-3.5 w-3.5" /> {t('settings.templates.save')}
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        <Link href="/settings?tab=brand" className="text-primary hover:underline">
          {t('settings.templates.manageAll')}
        </Link>
      </p>
    </div>
  );
}
