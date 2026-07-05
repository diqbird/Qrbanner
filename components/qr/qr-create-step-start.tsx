'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { QR_CATEGORIES, QR_CATEGORY_GROUPS } from '@/lib/qr-utils';
import { QR_CATEGORY_ICONS } from '@/lib/qr-category-icons';
import { IndustryTemplatePicker } from '@/components/qr/industry-template-picker';
import type { QrCreateFormState } from '@/hooks/use-qr-create-form';

type QrCreateStepStartProps = {
  form: QrCreateFormState;
};

export function QrCreateStepStart({ form }: QrCreateStepStartProps) {
  const { t } = useLanguage();
  const { category, applyTemplate, selectCategory } = form;

  return (
    <div className="space-y-6">
      <IndustryTemplatePicker onApply={applyTemplate} />
      {QR_CATEGORY_GROUPS.map((group) => (
        <Card key={group.id}>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">{group.label}</CardTitle>
            {'subtitle' in group && group.subtitle && (
              <p className="text-xs text-muted-foreground">{group.subtitle}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {QR_CATEGORIES.filter((c) => c.group === group.id).map((cat) => {
                const Icon = QR_CATEGORY_ICONS[cat.id] ?? Globe;
                const isPopular = 'popular' in cat && cat.popular;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    data-testid={`qr-category-${cat.id}`}
                    onClick={() => selectCategory(cat.id)}
                    className={`relative flex items-center gap-3 rounded-lg border p-4 text-left transition-all hover:shadow-sm ${
                      category === cat.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border/50 hover:border-border'
                    }`}
                  >
                    {isPopular && (
                      <Badge className="absolute right-2 top-2 px-1.5 py-0 text-[10px]">
                        {t('create.popular')}
                      </Badge>
                    )}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        category === cat.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 pr-8">
                      <p className="text-sm font-medium">{cat.name}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{cat.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
      <p className="text-center text-xs text-muted-foreground">{t('create.templateHint')}</p>
    </div>
  );
}
