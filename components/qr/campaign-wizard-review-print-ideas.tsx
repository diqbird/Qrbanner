'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

export function CampaignWizardReviewPrintIdeas({ suggestions }: { suggestions: string[] }) {
  const { t } = useLanguage();

  if (suggestions.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 font-display text-base">
          <Printer className="h-4 w-4 text-primary" />
          {t('campaign.printIdeas')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {suggestions.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
