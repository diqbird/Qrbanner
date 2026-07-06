'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { GeofenceRuleRow } from './geofence-rule-row';
import { MAX_GEOFENCE_RULES, type GeofenceData } from '@/lib/geofence-shared';

export function GeofenceRulesList({
  data,
  onUpdateRule,
  onRemoveRule,
  onAddRule,
}: {
  data: GeofenceData;
  onUpdateRule: (id: string, patch: Partial<GeofenceData['rules'][0]>) => void;
  onRemoveRule: (id: string) => void;
  onAddRule: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {data.rules.length === 0 ? (
        <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-4 text-center">
          {t('qrFeatures.geofenceEmpty')}
        </p>
      ) : (
        <div className="space-y-3">
          {data.rules.map((rule, index) => (
            <GeofenceRuleRow
              key={rule.id}
              rule={rule}
              index={index}
              onUpdate={(patch) => onUpdateRule(rule.id, patch)}
              onRemove={() => onRemoveRule(rule.id)}
            />
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddRule}
        disabled={data.rules.length >= MAX_GEOFENCE_RULES}
        className="gap-2"
      >
        <Plus className="h-4 w-4" /> {t('qrFeatures.geofenceAddRule')}
      </Button>

      <p className="text-xs text-muted-foreground">
        {t('qrFeatures.geofencePriority', { max: MAX_GEOFENCE_RULES })}
      </p>
    </div>
  );
}
