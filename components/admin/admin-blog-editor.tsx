'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageIcon, Plus, Save, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import type { BlogSection } from '@/lib/blog/types';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { SeoPreviewCard } from '@/components/seo/seo-preview-card';

interface BlogPostRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  keywords: string[];
  readingMinutes: number;
  published: boolean;
  sections: BlogSection[];
}

interface AdminBlogEditorProps {
  postId: string;
  onClose: () => void;
  onSaved: () => void;
}

function emptySection(type: BlogSection['type']): BlogSection {
  if (type === 'ul') return { type, items: [''] };
  if (type === 'faq') return { type, faq: [{ question: '', answer: '' }] };
  if (type === 'img') return { type, src: '', alt: '' };
  return { type, content: '' };
}

export function AdminBlogEditor({ postId, onClose, onSaved }: AdminBlogEditorProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<number | 'new' | null>(null);
  const [post, setPost] = useState<BlogPostRecord | null>(null);

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('admin.blog.loadFailed'));
        onClose();
        return;
      }
      setPost({
        ...data.post,
        sections: (data.post.sections as BlogSection[]) ?? [],
        keywords: data.post.keywords ?? [],
      });
    } catch {
      toast.error(t('admin.blog.loadFailed'));
      onClose();
    } finally {
      setLoading(false);
    }
  }, [postId, onClose, t]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const updateSection = (index: number, next: BlogSection) => {
    if (!post) return;
    const sections = [...post.sections];
    sections[index] = next;
    setPost({ ...post, sections });
  };

  const removeSection = (index: number) => {
    if (!post) return;
    setPost({ ...post, sections: post.sections.filter((_, i) => i !== index) });
  };

  const addSection = (type: BlogSection['type']) => {
    if (!post) return;
    setPost({ ...post, sections: [...post.sections, emptySection(type)] });
  };

  const insertImage = (url: string) => {
    if (!post) return;
    const section: BlogSection = { type: 'img', src: url, alt: post.title };
    if (mediaTarget === 'new') {
      setPost({ ...post, sections: [...post.sections, section] });
    } else if (typeof mediaTarget === 'number') {
      updateSection(mediaTarget, section);
    }
    setMediaTarget(null);
    setMediaOpen(false);
  };

  const save = async () => {
    if (!post) return;
    if (!post.slug.trim() || !post.title.trim()) {
      toast.error(t('admin.blog.slugTitleRequired'));
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: post.slug,
          title: post.title,
          description: post.description,
          category: post.category,
          author: post.author,
          readingMinutes: post.readingMinutes,
          keywords: post.keywords,
          sections: post.sections,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('admin.blog.updateFailed'));
        return;
      }
      toast.success(t('admin.blog.saved'));
      onSaved();
      onClose();
    } catch {
      toast.error(t('admin.blog.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async () => {
    if (!post || !window.confirm(t('admin.blog.deleteConfirm'))) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error(t('admin.blog.deleteFailed'));
        return;
      }
      toast.success(t('admin.blog.deleted'));
      onSaved();
      onClose();
    } catch {
      toast.error(t('admin.blog.deleteFailed'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !post) {
    return (
      <div className="rounded-xl border border-border/60 bg-muted/20 p-6 text-sm text-muted-foreground">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-4 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display font-semibold">{t('admin.blog.editTitle')}</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>{t('admin.blog.titleLabel')}</Label>
          <Input value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>{t('admin.blog.slug')}</Label>
          <Input value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>{t('admin.blog.description')}</Label>
          <Textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-1">
          <Label>{t('admin.blog.category')}</Label>
          <Input value={post.category} onChange={(e) => setPost({ ...post, category: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>{t('admin.blog.readingMinutes')}</Label>
          <Input
            type="number"
            min={1}
            max={60}
            value={post.readingMinutes}
            onChange={(e) => setPost({ ...post, readingMinutes: Number(e.target.value) || 8 })}
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>{t('admin.blog.keywords')}</Label>
          <Input
            value={post.keywords.join(', ')}
            onChange={(e) =>
              setPost({
                ...post,
                keywords: e.target.value
                  .split(',')
                  .map((k) => k.trim())
                  .filter(Boolean),
              })
            }
            placeholder={t('admin.blog.keywordsPlaceholder')}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>{t('admin.blog.seoPreview')}</Label>
          <SeoPreviewCard
            title={post.title}
            description={post.description}
            url={`/blog/${post.slug || 'slug'}`}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">{t('admin.blog.sectionsTitle')}</p>
          <div className="flex flex-wrap gap-1">
            {(['h2', 'h3', 'p', 'ul', 'faq', 'img'] as const).map((type) => (
              <Button key={type} variant="outline" size="sm" className="h-7 text-xs" onClick={() => addSection(type)}>
                <Plus className="h-3 w-3 mr-1" />
                {type.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {post.sections.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('admin.blog.sectionsEmpty')}</p>
        ) : (
          <div className="space-y-3">
            {post.sections.map((section, index) => (
              <div key={index} className="rounded-lg border border-border/50 p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Select
                    value={section.type}
                    onValueChange={(type) => updateSection(index, emptySection(type as BlogSection['type']))}
                  >
                    <SelectTrigger className="h-8 w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h2">H2</SelectItem>
                      <SelectItem value="h3">H3</SelectItem>
                      <SelectItem value="p">Paragraph</SelectItem>
                      <SelectItem value="ul">List</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="img">Image</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSection(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                {(section.type === 'h2' || section.type === 'h3' || section.type === 'p') && (
                  <Textarea
                    value={section.content ?? ''}
                    onChange={(e) => updateSection(index, { ...section, content: e.target.value })}
                    rows={section.type === 'p' ? 4 : 2}
                  />
                )}

                {section.type === 'ul' && (
                  <Textarea
                    value={(section.items ?? []).join('\n')}
                    onChange={(e) =>
                      updateSection(index, {
                        ...section,
                        items: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
                      })
                    }
                    rows={4}
                    placeholder={t('admin.blog.listPlaceholder')}
                  />
                )}

                {section.type === 'faq' &&
                  (section.faq ?? []).map((item, fi) => (
                    <div key={fi} className="space-y-1 rounded-md bg-muted/30 p-2">
                      <Input
                        value={item.question}
                        placeholder={t('admin.blog.faqQuestion')}
                        onChange={(e) => {
                          const faq = [...(section.faq ?? [])];
                          faq[fi] = { ...faq[fi], question: e.target.value };
                          updateSection(index, { ...section, faq });
                        }}
                      />
                      <Textarea
                        value={item.answer}
                        placeholder={t('admin.blog.faqAnswer')}
                        rows={2}
                        onChange={(e) => {
                          const faq = [...(section.faq ?? [])];
                          faq[fi] = { ...faq[fi], answer: e.target.value };
                          updateSection(index, { ...section, faq });
                        }}
                      />
                    </div>
                  ))}

                {section.type === 'img' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={section.src ?? ''}
                        placeholder="https://..."
                        onChange={(e) => updateSection(index, { ...section, src: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setMediaTarget(index);
                          setMediaOpen(true);
                        }}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      value={section.alt ?? ''}
                      placeholder={t('admin.blog.imageAlt')}
                      onChange={(e) => updateSection(index, { ...section, alt: e.target.value })}
                    />
                    {section.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={section.src} alt={section.alt ?? ''} className="max-h-40 rounded-md object-cover" />
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button onClick={save} loading={saving} className="gap-2">
          <Save className="h-4 w-4" /> {t('admin.blog.save')}
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            setMediaTarget('new');
            setMediaOpen(true);
          }}
        >
          <ImageIcon className="h-4 w-4" /> {t('admin.blog.insertImage')}
        </Button>
        <Button variant="destructive" onClick={deletePost} loading={deleting} className="gap-2 ml-auto">
          <Trash2 className="h-4 w-4" /> {t('admin.blog.delete')}
        </Button>
      </div>

      <MediaPickerDialog open={mediaOpen} onOpenChange={setMediaOpen} onSelect={insertImage} />
    </div>
  );
}
