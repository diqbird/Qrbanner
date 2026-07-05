export type StyleEditorTabProps = {
  style: import('@/lib/qr-style').QRStyleConfig;
  update: (patch: Partial<import('@/lib/qr-style').QRStyleConfig>) => void;
};
