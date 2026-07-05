'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resolveUrlLabelKey } from '@/lib/qr-category-field-registry';

type UrlFieldProps = {
  category: string;
  data: Record<string, string>;
  updateField: (key: string, value: string) => void;
  t: (key: string) => string;
  placeholder?: string;
  label?: string;
};

export function CategoryUrlField({
  category,
  data,
  updateField,
  t,
  placeholder,
  label,
}: UrlFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label ?? t(resolveUrlLabelKey(category))}</Label>
      <Input
        placeholder={placeholder ?? t('fields.urlPlaceholder')}
        value={data?.url ?? ''}
        onChange={(e) => updateField('url', e.target.value)}
      />
    </div>
  );
}

type UsernameFieldProps = {
  data: Record<string, string>;
  updateField: (key: string, value: string) => void;
  label: string;
  placeholder: string;
  hint?: string;
};

export function CategoryUsernameField({ data, updateField, label, placeholder, hint }: UsernameFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        placeholder={placeholder}
        value={data?.username ?? ''}
        onChange={(e) => updateField('username', e.target.value)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
