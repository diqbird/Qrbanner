'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRight, Save, Loader2 } from 'lucide-react';
import type { QrQuickCreateState } from '@/hooks/use-qr-quick-create';
import { normalizeQRStyle } from '@/lib/qr-style';

export function QrQuickCreateForm({
  quick,
  onAdvanced,
}: {
  quick: QrQuickCreateState;
  onAdvanced: () => void;
}) {
  const { t, session, url, setUrl, name, setName, isValid, saving, handleSave } = quick;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg">{t('quick.urlLabel')}</CardTitle>
        <CardDescription>{t('create.steps.content')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quick-url">{t('quick.urlLabel')}</Label>
          <Input
            id="quick-url"
            type="url"
            inputMode="url"
            placeholder={t('quick.urlPlaceholder')}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quick-name">{t('quick.nameLabel')}</Label>
          <Input
            id="quick-name"
            placeholder={t('quick.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          {session?.user ? (
            <Button
              type="button"
              className="w-full gap-2"
              disabled={!isValid || saving}
              onClick={handleSave}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <Save className="h-4 w-4 shrink-0" />
              )}
              {saving ? t('quick.saving') : t('quick.saveToDashboard')}
            </Button>
          ) : (
            <Button type="button" className="w-full gap-2" asChild>
              <Link href={`/signup?callbackUrl=${encodeURIComponent('/qr/create?quick=1')}`}>
                <Save className="h-4 w-4 shrink-0" />
                {t('quick.signUpToSave')}
              </Link>
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="h-auto w-full gap-2 whitespace-normal px-4 py-2.5 text-sm leading-snug"
            onClick={onAdvanced}
          >
            <span className="min-w-0 flex-1 text-center">{t('quick.advancedEditor')}</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Button>
        </div>
        {!isValid && url.trim().length > 3 && (
          <p className="text-xs text-amber-700 dark:text-amber-300">{t('quick.invalidUrl')}</p>
        )}
      </CardContent>
    </Card>
  );
}
