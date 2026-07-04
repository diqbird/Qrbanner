import { QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

type SiteLogoProps = {
  /** stacked: white QR icon on blue tile, brand name below in primary blue */
  layout?: 'stacked' | 'inline';
  className?: string;
  nameClassName?: string;
};

export function SiteLogo({ layout = 'stacked', className, nameClassName }: SiteLogoProps) {
  if (layout === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-2.5', className)}>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
          <QrCode className="h-4 w-4 text-primary-foreground" aria-hidden strokeWidth={2.25} />
        </span>
        <span
          className={cn(
            'font-display text-[17px] font-semibold tracking-tight text-foreground',
            nameClassName
          )}
        >
          QRbanner
        </span>
      </span>
    );
  }

  return (
    <span className={cn('inline-flex flex-col items-center gap-1', className)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
        <QrCode className="h-[18px] w-[18px] text-primary-foreground" aria-hidden strokeWidth={2.25} />
      </span>
      <span
        className={cn(
          'font-display text-[15px] font-bold leading-none tracking-tight text-foreground sm:text-[17px]',
          nameClassName
        )}
      >
        QRbanner
      </span>
    </span>
  );
}
