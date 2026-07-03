export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

/** Android App Links for future native app. Set ANDROID_PACKAGE_NAME + SHA256 on VPS. */
export async function GET() {
  const packageName = process.env.ANDROID_PACKAGE_NAME ?? 'com.qrbanner.app';
  const sha256 = process.env.ANDROID_SHA256_CERT_FINGERPRINT ?? '';

  const body = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: packageName,
        ...(sha256
          ? {
              sha256_cert_fingerprints: sha256.split(',').map((s) => s.trim()).filter(Boolean),
            }
          : {}),
      },
    },
  ];

  return NextResponse.json(body);
}
