'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/i18n/language-provider';
import { Button } from '@/components/ui/button';

export default function StudioContinuePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/studio/active');
        if (res.ok) {
          const json = (await res.json()) as { entitlement?: { token: string } | null };
          if (json.entitlement?.token) {
            setToken(json.entitlement.token);
            router.replace(`/studio/${json.entitlement.token}`);
            return;
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-border/60 bg-card p-6 text-center">
      <h1 className="font-display text-xl font-bold">{t('studio.continueEmptyTitle')}</h1>
      <p className="text-sm text-muted-foreground">{t('studio.continueEmptyBody')}</p>
      <Button asChild variant="outline">
        <Link href="/login">{t('common.signIn')}</Link>
      </Button>
    </div>
  );
}
