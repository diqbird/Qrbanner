'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { FileText, Plus, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useLanguage } from '@/components/i18n/language-provider';

interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
  readingMinutes: number;
}

export function AdminBlogPanel() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts ?? []);
      }
    } catch {
      toast.error(t('admin.blog.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async () => {
    if (!slug.trim() || !title.trim()) {
      toast.error(t('admin.blog.slugTitleRequired'));
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title,
          description: description || title,
          published: false,
          sections: [
            { type: 'p', content: 'Add your article content via admin API or database.' },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('admin.blog.createFailed'));
        return;
      }
      toast.success(t('admin.blog.draftCreated'));
      setSlug('');
      setTitle('');
      setDescription('');
      fetchPosts();
    } catch {
      toast.error(t('admin.blog.createFailed'));
    } finally {
      setCreating(false);
    }
  };

  const togglePublish = async (post: AdminBlogPost) => {
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      if (res.ok) {
        toast.success(post.published ? t('admin.blog.unpublished') : t('admin.blog.published'));
        fetchPosts();
      }
    } catch {
      toast.error(t('admin.blog.updateFailed'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-base">
          <FileText className="h-5 w-5 text-primary" /> {t('admin.blog.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {loading ? (
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('admin.blog.empty')}</p>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
