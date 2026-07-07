import { QrCode, Route, BarChart3 } from 'lucide-react';

const HIGHLIGHT_ICONS = [QrCode, Route, BarChart3];
const HIGHLIGHT_KEYS = [
  { label: 'hero.highlightTypes', desc: 'hero.highlightTypesDesc' },
  { label: 'hero.highlightRouting', desc: 'hero.highlightRoutingDesc' },
  { label: 'hero.highlightAnalytics', desc: 'hero.highlightAnalyticsDesc' },
] as const;

export function LandingHeroHighlights({
  t,
  qrTypeCount,
}: {
  t: (key: string, vars?: Record<string, string | number>) => string;
  qrTypeCount: string;
}) {
  return (
    <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {HIGHLIGHT_KEYS.map((item, i) => {
        const Icon = HIGHLIGHT_ICONS[i];
        return (
          <div
            key={item.label}
            className="rounded-2xl border border-border/40 bg-card/80 p-5 shadow-sm backdrop-blur-sm"
          >
            <Icon className="mb-2 h-6 w-6 text-foreground" aria-hidden />
            <h2 className="font-display text-sm font-semibold">
              {item.label === 'hero.highlightTypes'
                ? t(item.label, { count: qrTypeCount })
                : t(item.label)}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{t(item.desc)}</p>
          </div>
        );
      })}
    </div>
  );
}
