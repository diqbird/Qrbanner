'use client';

import { useEffect, useState } from 'react';

export function useGpsHeatmapGlobeResize() {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef) return;
    const update = () => setWidth(containerRef.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef);
    return () => ro.disconnect();
  }, [containerRef]);

  return { setContainerRef, width };
}
