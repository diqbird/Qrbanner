'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageIcon } from 'lucide-react';
import type { BlogSection } from '@/lib/blog/types';

type AdminBlogSectionImageFieldsProps = {
  section: BlogSection;
  index: number;
  updateSection: (index: number, next: BlogSection) => void;
  imageAltPlaceholder: string;
  onOpenMedia: () => void;
};

export function AdminBlogSectionImageFields({
  section,
  index,
  updateSection,
  imageAltPlaceholder,
  onOpenMedia,
}: AdminBlogSectionImageFieldsProps) {
  if (section.type !== 'img') return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={section.src ?? ''}
          placeholder="https://..."
          onChange={(e) => updateSection(index, { ...section, src: e.target.value })}
        />
        <Button type="button" variant="outline" size="icon" onClick={onOpenMedia}>
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      <Input
        value={section.alt ?? ''}
        placeholder={imageAltPlaceholder}
        onChange={(e) => updateSection(index, { ...section, alt: e.target.value })}
      />
      {section.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={section.src} alt={section.alt ?? ''} className="max-h-40 rounded-md object-cover" />
      ) : null}
    </div>
  );
}
