export function SectionSkeleton({
  rows = 3,
  minHeight,
}: {
  rows?: number;
  /** Reserve vertical space to prevent CLS when lazy content mounts */
  minHeight?: string;
}) {
  return (
    <div
      className="py-20 sm:py-28"
      style={minHeight ? { minHeight } : undefined}
      aria-hidden
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mx-auto h-8 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="mx-auto mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-xl bg-muted/80" />
          ))}
        </div>
      </div>
    </div>
  );
}
