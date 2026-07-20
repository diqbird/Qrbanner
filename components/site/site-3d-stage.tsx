/** Fixed ambient stage behind public pages — Job Ticket paper grain. */
export function Site3DStage() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[var(--jt-paper,#F5F1E8)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(36,48,200,0.11),transparent_48%)] dark:bg-[radial-gradient(ellipse_at_50%_-10%,rgba(107,124,255,0.14),transparent_48%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_12%,rgba(166,124,82,0.14),transparent_36%)]" />
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.22]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(28,25,23,0.045) 27px, rgba(28,25,23,0.045) 28px)',
        }}
      />
      <div className="absolute -left-[18%] top-[8%] h-[42vmin] w-[42vmin] rounded-full bg-[var(--jt-ultramarine,#2430C8)]/10 blur-[100px] motion-safe:animate-[auth-orb-a_18s_ease-in-out_infinite]" />
      <div className="absolute -right-[14%] top-[22%] h-[36vmin] w-[36vmin] rounded-full bg-[var(--jt-kraft,#A67C52)]/18 blur-[110px] motion-safe:animate-[auth-orb-b_22s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,color-mix(in_srgb,var(--jt-paper,#F5F1E8)_70%,transparent)_100%)]" />
    </div>
  );
}
