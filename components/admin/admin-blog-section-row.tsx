'use client';

import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import type { BlogSection } from '@/lib/blog/types';
import { emptyBlogSection } from '@/lib/blog-editor-utils';
import type { AdminBlogEditorState } from '@/hooks/use-admin-blog-editor';
import {
  AdminBlogSectionTextFields,
  AdminBlogSectionFaqFields,
} from './admin-blog-section-field-panels';
import { AdminBlogSectionImageFields } from './admin-blog-section-image-fields';

type AdminBlogSectionRowProps = {
  editor: AdminBlogEditorState;
  section: BlogSection;
  index: number;
};

export function AdminBlogSectionRow({ editor, section, index }: AdminBlogSectionRowProps) {
  const { t, updateSection, removeSection, setMediaTarget, setMediaOpen } = editor;

  return (
    <div className="rounded-lg border border-border/50 p-3 space-y-2">
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

      <AdminBlogSectionTextFields
        section={section}
        index={index}
        updateSection={updateSection}
        listPlaceholder={t('admin.blog.listPlaceholder')}
      />

      <AdminBlogSectionFaqFields
        section={section}
        index={index}
        updateSection={updateSection}
        questionPlaceholder={t('admin.blog.faqQuestion')}
        answerPlaceholder={t('admin.blog.faqAnswer')}
      />

      <AdminBlogSectionImageFields
        section={section}
        index={index}
        updateSection={updateSection}
        imageAltPlaceholder={t('admin.blog.imageAlt')}
        onOpenMedia={() => {
          setMediaTarget(index);
          setMediaOpen(true);
        }}
      />
    </div>
  );
}
