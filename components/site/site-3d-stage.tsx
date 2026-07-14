/** Fixed ambient 3D stage behind public pages (orbs + perspective floor). */
export function Site3DStage() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-5%,hsl(var(--primary)/0.22),transparent_55%)]" />
      <div className="absolute -left-[20%] top-[8%] h-[48vmin] w-[48vmin] rounded-full bg-primary/30 blur-[100px] auth-orb-a motion-safe:animate-[auth-orb-a_16s_ease-in-out_infinite]" />
      <div className="absolute -right-[16%] top-[22%] h-[40vmin] w-[40vmin] rounded-full bg-foreground/[0.08] blur-[110px] auth-orb-b motion-safe:animate-[auth-orb-b_20s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-8%] left-1/2 h-[50vmin] w-[80vmin] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div
        className="absolute inset-x-0 bottom-0 h-[46vh] origin-bottom scale-x-[1.35] opacity-35 dark:opacity-25"
        style={{
          background:
            'linear-gradient(to top, hsl(var(--foreground) / 0.09), transparent), repeating-linear-gradient(90deg, hsl(var(--foreground) / 0.07) 0 1px, transparent 1px 56px), repeating-linear-gradient(0deg, hsl(var(--foreground) / 0.05) 0 1px, transparent 1px 56px)',
          transform: 'perspective(1000px) rotateX(64deg) translateY(22%)',
          maskImage: 'linear-gradient(to top, black 8%, transparent 88%)',
          WebkitMaskImage: 'linear-gradient(to top, black 8%, transparent 88%)',
        }}
      />
    </div>
  );
}
