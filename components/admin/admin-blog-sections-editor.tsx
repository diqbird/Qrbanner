'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ImageIcon, Plus, Trash2 } from 'lucide-react';
import type { BlogSection } from '@/lib/blog/types';
import { emptyBlogSection } from '@/lib/blog-editor-utils';
import type { AdminBlogEditorState } from '@/hooks/use-admin-blog-editor';

type AdminBlogSectionsEditorProps = {
  editor: AdminBlogEditorState;
};

export function AdminBlogSectionsEditor({ editor }: AdminBlogSectionsEditorProps) {
  const { t, post, addSection, updateSection, removeSection, setMediaTarget, setMediaOpen } = editor;
  if (!post) return null;

  return (
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
                  onValueChange={(type) => updateSection(index, emptyBlogSection(type as BlogSection['type']))}
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
  );
}
