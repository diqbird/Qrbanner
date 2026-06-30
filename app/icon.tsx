import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#4f46e5',
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            background: '#ffffff',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              background: '#4f46e5',
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
