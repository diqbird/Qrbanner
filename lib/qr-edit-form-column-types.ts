import type { useQrEditForm } from '@/hooks/use-qr-edit-form';

export type QrEditFormState = ReturnType<typeof useQrEditForm>;

export type QrEditFormColumnProps = {
  form: QrEditFormState;
};
