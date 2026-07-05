import type { CategoryFieldConfig } from '@/lib/qr-category-field-registry';

export type CategoryFieldProps = {
  category: string;
  config: CategoryFieldConfig;
  data: Record<string, string>;
  updateField: (key: string, value: string) => void;
};

export type CategoryFieldPrimitiveProps = CategoryFieldProps & {
  t: (key: string) => string;
};
