import { ImageResponse } from 'next/og';

/** Shared QRbanner mark for favicon, PWA and Apple touch icons. */
export function renderBrandIcon(size: number) {
  const radius = Math.max(4, Math.round(size * 0.22));
  const outer = Math.round(size * 0.62);
  const inner = Math.round(size * 0.38);
  const core = Math.round(size * 0.24);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #004080 0%, #4f46e5 100%)',
          borderRadius: radius,
        }}
      >
        <div
          style={{
            width: outer,
            height: outer,
            background: '#ffffff',
            borderRadius: Math.max(3, Math.round(radius * 0.65)),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: inner,
              height: inner,
              border: `${Math.max(2, Math.round(size * 0.04))}px solid #004080`,
              borderRadius: Math.max(2, Math.round(radius * 0.35)),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: core,
                height: core,
                background: '#004080',
                borderRadius: Math.max(2, Math.round(radius * 0.25)),
              }}
            />
          </div>
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
