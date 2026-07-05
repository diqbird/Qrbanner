'use client';

export function PlanUsageMeter({
  label,
  used,
  limit,
  warningLabel,
  fullLabel,
}: {
  label: string;
  used: number;
  limit: number;
  warningLabel: string;
  fullLabel: string;
}) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const barColor = pct >= 100 ? 'bg-amber-500' : pct >= 80 ? 'bg-amber-400' : 'bg-primary';
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-muted-foreground">
          {used} / {limit}
          {pct >= 100 && <span className="ml-2 text-amber-600">{fullLabel}</span>}
          {pct >= 80 && pct < 100 && <span className="ml-2 text-amber-600">{warningLabel}</span>}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
