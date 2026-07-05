export function SettingsSection({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-t border-border/50 pt-6 first:border-0 first:pt-0">
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
