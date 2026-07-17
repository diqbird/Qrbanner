import { QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

type SiteLogoProps = {
  /** stacked: QR tile above brand name; inline: tile + name in one row */
  layout?: 'stacked' | 'inline';
  /** sm fits compact public header chrome */
  size?: 'sm' | 'md';
  className?: string;
  nameClassName?: string;
};

export function SiteLogo({
  layout = 'stacked',
  size = 'md',
  className,
  nameClassName,
}: SiteLogoProps) {
  const tile = size === 'sm' ? 'h-7 w-7 rounded-lg' : 'h-8 w-8 rounded-xl';
  const icon = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const name =
    size === 'sm'
      ? 'text-[13px] sm:text-sm font-semibold'
      : 'text-[17px] font-semibold';

  if (layout === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-2', className)}>
        <span
          className={cn(
            'flex shrink-0 items-center justify-center bg-primary shadow-sm',
            tile,
          )}
        >
          <QrCode
            className={cn(icon, 'text-primary-foreground')}
            aria-hidden
            strokeWidth={2.25}
          />
        </span>
        <span
          className={cn(
            'font-display tracking-tight text-foreground',
            name,
            nameClassName,
          )}
        >
          QRbanner
        </span>
      </span>
    );
  }

  const stackedTile = size === 'sm' ? 'h-7 w-7 rounded-lg' : 'h-9 w-9 rounded-xl';
  const stackedIcon = size === 'sm' ? 'h-3.5 w-3.5' : 'h-[18px] w-[18px]';
  const stackedName =
    size === 'sm'
      ? 'text-[12px] sm:text-[13px] font-semibold'
      : 'text-[15px] font-bold sm:text-[17px]';

  return (
    <span className={cn('inline-flex flex-col items-center gap-0.5', className)}>
      <span
        className={cn(
          'flex shrink-0 items-center justify-center bg-primary shadow-sm',
          stackedTile,
        )}
      >
        <QrCode
          className={cn(stackedIcon, 'text-primary-foreground')}
          aria-hidden
          strokeWidth={2.25}
        />
      </span>
      <span
        className={cn(
          'font-display leading-none tracking-tight text-foreground',
          stackedName,
          nameClassName,
        )}
      >
        QRbanner
      </span>
    </span>
  );
}
