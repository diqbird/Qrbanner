'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Languages, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import {
  emptyLanguageRedirectData,
  LANGUAGE_OPTIONS,
  MAX_LANGUAGE_REDIRECT_RULES,
  type LanguageRedirectData,
} from '@/lib/language-redirect';
import { useLanguageRedirectRuleActions } from '@/hooks/use-language-redirect-rule-actions';

export function LanguageRedirectSettings({
  enabled,
  onEnabledChange,
  data,
  onChange,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  data: LanguageRedirectData;
  onChange: (v: LanguageRedirectData) => void;
}) {
  const { t, locale } = useLanguage();
  const { addRule, updateRule, removeRule } = useLanguageRedirectRuleActions(data, onChange);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display flex items-center gap-2 text-base">
            <Languages className="h-5 w-5 text-primary" />
            {t('qrFeatures.languageRedirectTitle')}
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
        <p className="text-sm text-muted-foreground">{t('qrFeatures.languageRedirectSubtitle')}</p>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          {data.rules.length === 0 ? (
            <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              {t('qrFeatures.languageRedirectEmpty')}
            </p>
          ) : (
            <div className="space-y-3">
              {data.rules.map((rule, index) => (
                <div
                  key={rule.id}
                  className="space-y-3 rounded-lg border border-border/50 bg-muted/20 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      {t('qrFeatures.languageRedirectRule', {
                        n: formatLocaleNumber(index + 1, locale),
                      })}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeRule(rule.id)}
                      aria-label={t('qrFeatures.geofenceRule', { n: String(index + 1) })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>{t('qrFeatures.languageRedirectLanguage')}</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                        value={rule.language}
                        onChange={(e) => updateRule(rule.id, { language: e.target.value })}
                      >
                        {LANGUAGE_OPTIONS.map((opt) => (
                          <option key={opt.code} value={opt.code}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('qrFeatures.languageRedirectLabel')}</Label>
                      <Input
                        value={rule.label ?? ''}
                        placeholder={t('qrFeatures.languageRedirectLabelPlaceholder')}
                        onChange={(e) => updateRule(rule.id, { label: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('qrFeatures.languageRedirectUrl')}</Label>
                    <Input
                      value={rule.url}
                      placeholder={t('qrFeatures.languageRedirectUrlPlaceholder')}
                      onChange={(e) => updateRule(rule.id, { url: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRule}
            disabled={data.rules.length >= MAX_LANGUAGE_REDIRECT_RULES}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> {t('qrFeatures.languageRedirectAddRule')}
          </Button>

          <p className="text-xs text-muted-foreground">
            {t('qrFeatures.languageRedirectQuota', {
              count: formatLocaleNumber(data.rules.length, locale),
              max: formatLocaleNumber(MAX_LANGUAGE_REDIRECT_RULES, locale),
            })}
          </p>
        </CardContent>
      )}
    </Card>
  );
}

export { emptyLanguageRedirectData };
export type { LanguageRedirectData };
