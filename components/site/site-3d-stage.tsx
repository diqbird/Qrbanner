/** Fixed ambient 3D stage behind public pages (orbs + perspective floor). */
export function Site3DStage() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-8%,hsl(var(--primary)/0.28),transparent_52%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,hsl(var(--primary)/0.12),transparent_35%)]" />
      <div className="absolute -left-[22%] top-[4%] h-[52vmin] w-[52vmin] rounded-full bg-primary/35 blur-[110px] auth-orb-a motion-safe:animate-[auth-orb-a_14s_ease-in-out_infinite]" />
      <div className="absolute -right-[18%] top-[18%] h-[44vmin] w-[44vmin] rounded-full bg-foreground/[0.1] blur-[120px] auth-orb-b motion-safe:animate-[auth-orb-b_18s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-12%] left-[20%] h-[40vmin] w-[40vmin] rounded-full bg-primary/20 blur-[100px] auth-orb-a motion-safe:animate-[auth-orb-a_22s_ease-in-out_infinite_reverse]" />
      <div className="absolute bottom-[-8%] left-1/2 h-[55vmin] w-[85vmin] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]" />
      <div
        className="absolute inset-x-0 bottom-0 h-[50vh] origin-bottom scale-x-[1.4] opacity-40 dark:opacity-30"
        style={{
          background:
            'linear-gradient(to top, hsl(var(--foreground) / 0.1), transparent), repeating-linear-gradient(90deg, hsl(var(--foreground) / 0.08) 0 1px, transparent 1px 52px), repeating-linear-gradient(0deg, hsl(var(--foreground) / 0.06) 0 1px, transparent 1px 52px)',
          transform: 'perspective(1100px) rotateX(66deg) translateY(20%)',
          maskImage: 'linear-gradient(to top, black 10%, transparent 90%)',
          WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 90%)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background)/0.55)_100%)]" />
    </div>
  );
}
