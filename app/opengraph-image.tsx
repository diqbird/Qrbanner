import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/seo';

export const runtime = 'edge';
export const alt = `${SITE_NAME} — Dynamic QR Platform`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: '#4f46e5',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                background: '#fff',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 14, height: 14, background: '#4f46e5', borderRadius: 3 }} />
            </div>
          </div>
          <span style={{ fontSize: 36, fontWeight: 700 }}>{SITE_NAME}</span>
        </div>
        <div>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, maxWidth: 900 }}>
            Dynamic QR Platform
          </div>
          <div style={{ marginTop: 20, fontSize: 28, color: '#c7d2fe', maxWidth: 800 }}>
            A/B routing · Webhooks · Teams · Geofencing · API
          </div>
        </div>
        <div style={{ fontSize: 22, color: '#94a3b8' }}>qrbanner.com</div>
      </div>
    ),
    { ...size }
  );
}
