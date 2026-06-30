'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Target, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { categoryShortName } from '@/lib/qr-utils';

export function IndustryTemplateGuide({
  template,
  onDismiss,
}: {
  template: IndustryTemplate;
  onDismiss?: () => void;
}) {
  const [tipsOpen, setTipsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{template.name}</p>
            <Badge variant="secondary" className="text-[10px]">
              {categoryShortName(template.category)}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{template.tagline}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={onDismiss}
          aria-label="Dismiss template guide"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mt-2 h-7 gap-1 px-2 text-xs text-muted-foreground"
        onClick={() => setTipsOpen((v) => !v)}
      >
        {tipsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {tipsOpen ? 'Hide tips' : 'Show tips'}
      </Button>

      {tipsOpen && (
        <div className="mt-3 space-y-3 border-t border-primary/20 pt-3">
          <div>
            <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Target className="h-3.5 w-3.5" /> Best for
            </p>
            <div className="flex flex-wrap gap-1">
              {template.useCases.map((u) => (
                <Badge key={u} variant="outline" className="text-[10px] font-normal">
                  {u}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5" /> Helpful tips
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {template.tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="shrink-0 text-primary">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
