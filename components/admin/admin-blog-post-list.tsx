'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ExternalLink, Pencil } from 'lucide-react';
import type { AdminBlogPanelState } from '@/hooks/use-admin-blog-panel';

export function AdminBlogPostList({ panel }: { panel: AdminBlogPanelState }) {
  const { t, posts, loading, setEditingId, togglePublish } = panel;

  if (loading) {
    return <p className="text-sm text-muted-foreground">{t('common.loading')}</p>;
  }

  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('admin.blog.empty')}</p>;
  }

  return (
    <ul className="space-y-3">
      {posts.map((post) => (
        <li
          key={post.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 p-3"
        >
          <div>
            <p className="font-medium">{post.title}</p>
            <p className="text-xs text-muted-foreground">/{post.slug}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={post.published ? 'default' : 'secondary'}>
              {post.published ? t('admin.blog.statusPublished') : t('admin.blog.statusDraft')}
            </Badge>
            <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => setEditingId(post.id)}>
              <Pencil className="h-3.5 w-3.5" /> {t('admin.blog.edit')}
            </Button>
            <label className="flex items-center gap-2 text-xs">
              <Switch checked={post.published} onCheckedChange={() => togglePublish(post)} />
              {t('admin.blog.live')}
            </label>
            {post.published && (
              <Link href={`/blog/${post.slug}`} target="_blank">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
