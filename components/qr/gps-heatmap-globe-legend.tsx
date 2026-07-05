export function GpsHeatmapGlobeLegend() {
  return (
    <div className="pointer-events-none absolute bottom-2 left-2 flex gap-3 text-[10px] text-slate-300">
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-red-500" /> GPS
      </span>
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-blue-500" /> IP approx.
      </span>
    </div>
  );
}
