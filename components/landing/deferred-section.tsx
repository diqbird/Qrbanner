import type { ReactNode } from 'react';

/**
 * Wraps a below-the-fold landing section with `content-visibility: auto`
 * so the browser can skip rendering/layout work until it scrolls near the
 * viewport. `intrinsicHeight` reserves the expected size to avoid CLS and
 * scrollbar jumps (matches the section's rendered height).
 *
 * Unlike the global `.cv-auto` utility (fixed 420px), this lets each section
 * declare its own height, keeping Cumulative Layout Shift at zero.
 */
export function DeferredSection({
  children,
  intrinsicHeight,
}: {
  children: ReactNode;
  intrinsicHeight: string;
}) {
  return (
    <div
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: `auto ${intrinsicHeight}`,
        minHeight: intrinsicHeight,
      }}
    >
      {children}
    </div>
  );
}
