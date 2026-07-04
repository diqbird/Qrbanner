'use client';

import { useRef, type ReactNode } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const ROW_HEIGHT = 88;
const ROW_GAP = 12;
const VIRTUALIZE_THRESHOLD = 12;

export function VirtualizedQrList({
  count,
  renderRow,
  className = '',
}: {
  count: number;
  renderRow: (index: number) => ReactNode;
  className?: string;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    gap: ROW_GAP,
    overscan: 6,
  });

  if (count < VIRTUALIZE_THRESHOLD) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }, (_, index) => renderRow(index))}
      </div>
    );
  }

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={`overflow-auto rounded-lg ${className}`}
      style={{ maxHeight: 'min(70vh, 640px)' }}
    >
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.key}
            className="absolute left-0 top-0 w-full"
            style={{ transform: `translateY(${virtualRow.start}px)` }}
          >
            {renderRow(virtualRow.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
