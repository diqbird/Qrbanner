import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd } from '@/lib/seo';
import { ChevronRight } from 'lucide-react';

export function PublicBreadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  const trail = [{ label: 'Home', href: '/' }, ...items];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(trail.map((item) => ({ name: item.label, path: item.href })))}
      />
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-[1200px] px-4 pt-6 sm:px-6"
      >
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />}
                {isLast ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
