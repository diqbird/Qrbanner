'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { INDUSTRY_TEMPLATES, type IndustryTemplate } from '@/lib/industry-templates';
import { categoryShortName } from '@/lib/qr-utils';
import { LayoutTemplate, ChevronDown, ChevronUp } from 'lucide-react';

function TemplateCard({
  template,
  onApply,
}: {
  template: IndustryTemplate;
  onApply: (t: IndustryTemplate) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border overflow-hidden">
      <button
        type="button"
        onClick={() => onApply(template)}
        className="w-full p-3 text-left hover:bg-primary/5 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium">{template.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{template.tagline}</p>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0">
            {categoryShortName(template.category)}
          </Badge>
        </div>
      </button>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-1 border-t py-1.5 text-[10px] text-muted-foreground hover:bg-muted/50"
      >
        {template.sections.length} sections
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <div className="border-t bg-muted/30 px-3 py-2 space-y-2">
          {template.sections.map((s) => (
            <div key={s.id}>
              <p className="text-xs font-medium">{s.title}</p>
              <p className="text-[10px] text-muted-foreground">{s.description}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {s.fields.map((f) => f.label).join(' · ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function IndustryTemplatePicker({
  onApply,
}: {
  onApply: (template: IndustryTemplate) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4 text-primary" /> Quick-start templates
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Ready-made setups for restaurants, business cards, events and more — customize everything in the next step.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 max-h-[360px] overflow-y-auto pr-1">
          {INDUSTRY_TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} onApply={onApply} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
