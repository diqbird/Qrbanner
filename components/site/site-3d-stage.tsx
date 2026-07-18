/** Fixed ambient stage behind public pages — Job Ticket paper grain, not blue SaaS blobs. */
export function Site3DStage() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#F5F1E8] dark:bg-[#1C1917]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(36,48,200,0.12),transparent_48%)] dark:bg-[radial-gradient(ellipse_at_50%_-10%,rgba(107,124,255,0.16),transparent_48%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_12%,rgba(166,124,82,0.14),transparent_36%)]" />
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(28,25,23,0.04) 27px, rgba(28,25,23,0.04) 28px)',
        }}
      />
      <div className="absolute -left-[18%] top-[8%] h-[42vmin] w-[42vmin] rounded-full bg-[#2430C8]/10 blur-[100px] motion-safe:animate-[auth-orb-a_18s_ease-in-out_infinite]" />
      <div className="absolute -right-[14%] top-[22%] h-[36vmin] w-[36vmin] rounded-full bg-[#A67C52]/15 blur-[110px] motion-safe:animate-[auth-orb-b_22s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(245,241,232,0.55)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(28,25,23,0.65)_100%)]" />
    </div>
  );
}
