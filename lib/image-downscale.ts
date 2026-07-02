/**
 * Client-side image downscaling for logo/overlay uploads.
 *
 * Reading a raw 5MB image into a base64 data URL and handing it to
 * qr-code-styling makes every preview re-render decode the full-size bitmap,
 * which is slow and can silently fail to draw. We downscale to a small,
 * QR-appropriate bitmap first so previews stay fast and reliable.
 */

const DEFAULT_MAX_DIMENSION = 512;

export interface DownscaleResult {
  dataUrl: string;
  file: File;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image decode failed'));
    img.src = src;
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mime = /:(.*?);/.exec(header)?.[1] ?? 'image/png';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/**
 * Downscale an uploaded image to a compact PNG suitable for a QR logo overlay.
 * Preserves aspect ratio and transparency. Falls back to the original file's
 * data URL if canvas processing is unavailable (e.g. SVG uploads).
 */
export async function downscaleLogo(
  file: File,
  maxDimension = DEFAULT_MAX_DIMENSION
): Promise<DownscaleResult> {
  const originalDataUrl = await readFileAsDataUrl(file);

  // SVGs are already tiny/vector — keep as-is.
  if (file.type === 'image/svg+xml') {
    return { dataUrl: originalDataUrl, file };
  }

  try {
    const img = await loadImage(originalDataUrl);
    const { width, height } = img;
    if (!width || !height) return { dataUrl: originalDataUrl, file };

    const scale = Math.min(1, maxDimension / Math.max(width, height));
    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));

    // No downscaling needed and already small enough to embed.
    if (scale >= 1 && originalDataUrl.length < 200_000) {
      return { dataUrl: originalDataUrl, file };
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { dataUrl: originalDataUrl, file };

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const dataUrl = canvas.toDataURL('image/png');
    const blob = dataUrlToBlob(dataUrl);
    const downscaledFile = new File([blob], (file.name || 'logo').replace(/\.[^.]+$/, '') + '.png', {
      type: 'image/png',
    });

    return { dataUrl, file: downscaledFile };
  } catch {
    return { dataUrl: originalDataUrl, file };
  }
}
