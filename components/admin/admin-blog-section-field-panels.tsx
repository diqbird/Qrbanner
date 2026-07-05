'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { BlogSection } from '@/lib/blog/types';

type AdminBlogSectionTextFieldsProps = {
  section: BlogSection;
  index: number;
  updateSection: (index: number, next: BlogSection) => void;
  listPlaceholder: string;
};

export function AdminBlogSectionTextFields({
  section,
  index,
  updateSection,
  listPlaceholder,
}: AdminBlogSectionTextFieldsProps) {
  if (section.type === 'h2' || section.type === 'h3' || section.type === 'p') {
    return (
      <Textarea
        value={section.content ?? ''}
        onChange={(e) => updateSection(index, { ...section, content: e.target.value })}
        rows={section.type === 'p' ? 4 : 2}
      />
    );
  }

  if (section.type === 'ul') {
    return (
      <Textarea
        value={(section.items ?? []).join('\n')}
        onChange={(e) =>
          updateSection(index, {
            ...section,
            items: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
          })
        }
        rows={4}
        placeholder={listPlaceholder}
      />
    );
  }

  return null;
}

type AdminBlogSectionFaqFieldsProps = {
  section: BlogSection;
  index: number;
  updateSection: (index: number, next: BlogSection) => void;
  questionPlaceholder: string;
  answerPlaceholder: string;
};

export function AdminBlogSectionFaqFields({
  section,
  index,
  updateSection,
  questionPlaceholder,
  answerPlaceholder,
}: AdminBlogSectionFaqFieldsProps) {
  if (section.type !== 'faq') return null;

  return (
    <>
      {(section.faq ?? []).map((item, fi) => (
        <div key={fi} className="space-y-1 rounded-md bg-muted/30 p-2">
          <Input
            value={item.question}
            placeholder={questionPlaceholder}
            onChange={(e) => {
              const faq = [...(section.faq ?? [])];
              faq[fi] = { ...faq[fi], question: e.target.value };
              updateSection(index, { ...section, faq });
            }}
          />
          <Textarea
            value={item.answer}
            placeholder={answerPlaceholder}
            rows={2}
            onChange={(e) => {
              const faq = [...(section.faq ?? [])];
              faq[fi] = { ...faq[fi], answer: e.target.value };
              updateSection(index, { ...section, faq });
            }}
          />
        </div>
      ))}
    </>
  );
}
