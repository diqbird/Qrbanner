import { toast } from 'sonner';

export async function uploadQrLogoFile(
  logoFile: File,
  t: (key: string) => string,
  errorKey = 'editQr.logoUploadPartialFail',
): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', logoFile);
  const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
  if (uploadRes.ok) {
    const { path } = await uploadRes.json();
    return path as string;
  }
  toast.error(t(errorKey));
  return null;
}

export async function resolveQrCreateLogoPath({
  logoFile,
  logoPreview,
  storedLogoPath,
  uploadLogo,
  t,
}: {
  logoFile: File | null;
  logoPreview: string | null;
  storedLogoPath: string | null;
  uploadLogo: (file: File) => Promise<{ cloud_storage_path?: string } | null | undefined>;
  t: (key: string) => string;
}): Promise<string | null> {
  let logoPath = storedLogoPath;
  let fileToUpload: File | null = logoFile;
  if (!fileToUpload && logoPreview?.startsWith('data:')) {
    const blob = await fetch(logoPreview).then((r) => r.blob());
    fileToUpload = new File([blob], 'logo.png', { type: blob.type || 'image/png' });
  }
  if (fileToUpload) {
    const result = await uploadLogo(fileToUpload);
    logoPath = result?.cloud_storage_path ?? null;
    if (!logoPath) toast.error(t('create.logoUploadFailed'));
  } else if (!logoPath && logoPreview && !logoPreview.startsWith('data:')) {
    logoPath = logoPreview;
  }
  return logoPath;
}
