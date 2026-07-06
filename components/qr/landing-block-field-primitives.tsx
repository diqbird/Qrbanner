'use client';

import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

type AlignFieldProps = {
  value: string | undefined;
  onChange: (v: 'left' | 'center' | 'right') => void;
  t: (key: string) => string;
};

export function LandingBlockAlignField({ value, onChange, t }: AlignFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{t('landingBuilder.align')}</Label>
      <Select value={value ?? 'center'} onValueChange={(v) => onChange(v as 'left' | 'center' | 'right')}>
        <SelectTrigger className="h-9">
          <SelectValue>
            {(value ?? 'center') === 'left'
              ? t('landingBuilder.alignLeft')
              : (value ?? 'center') === 'right'
                ? t('landingBuilder.alignRight')
                : t('landingBuilder.alignCenter')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="left">{t('landingBuilder.alignLeft')}</SelectItem>
          <SelectItem value="center">{t('landingBuilder.alignCenter')}</SelectItem>
          <SelectItem value="right">{t('landingBuilder.alignRight')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
