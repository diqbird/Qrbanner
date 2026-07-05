'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import type { AdminBlogPanelState } from '@/hooks/use-admin-blog-panel';

export function AdminBlogCreateForm({ panel }: { panel: AdminBlogPanelState }) {
  const { t, slug, setSlug, title, setTitle, description, setDescription, creating, createPost } = panel;

  return (
    <div className="rounded-xl border border-dashed border-border/60 p-4 space-y-3">
      <p className="text-sm font-medium">{t('admin.blog.newDraft')}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>{t('admin.blog.slug')}</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={t('admin.blog.slugPlaceholder')}
          />
        </div>
        <div className="space-y-1">
          <Label>{t('admin.blog.titleLabel')}</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('admin.articleTitlePlaceholder')}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label>{t('admin.blog.description')}</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      </div>
      <Button onClick={createPost} loading={creating} className="gap-2">
        <Plus className="h-4 w-4" /> {t('admin.blog.createDraft')}
      </Button>
    </div>
  );
}
