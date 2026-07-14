'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tilt3DProps = {
  children: ReactNode;
  className?: string;
  /** max rotation in degrees */
  maxTilt?: number;
  /** resting tilt (idle pose) */
  rest?: { rx: number; ry: number };
};

export function Tilt3D({
  children,
  className,
  maxTilt = 12,
  rest = { rx: 6, ry: -8 },
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState(rest);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Math.max(-maxTilt, Math.min(maxTilt, -py * maxTilt * 1.6)),
      ry: Math.max(-maxTilt, Math.min(maxTilt, px * maxTilt * 1.8)),
    });
  };

  return (
    <div
      ref={ref}
      className={cn('relative [perspective:1200px]', className)}
      onPointerMove={onPointerMove}
      onPointerLeave={() => !reduceMotion && setTilt(rest)}
    >
      <div
        className="relative will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          transform: reduceMotion
            ? undefined
            : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: reduceMotion ? undefined : 'transform 160ms ease-out',
        }}
      >
        <div
          className="pointer-events-none absolute -bottom-6 left-1/2 h-14 w-[70%] -translate-x-1/2 rounded-[100%] bg-black/30 blur-2xl dark:bg-black/55"
          aria-hidden
        />
        {children}
      </div>
    </div>
  );
}
