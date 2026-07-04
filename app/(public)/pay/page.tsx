'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { openPaddleCheckout } from '@/lib/paddle-client';
import { useLanguage } from '@/components/i18n/language-provider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function PayLoading() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<PayLoading />}>
      <PayContent />
    </Suspense>
  );
}

function PayContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const transactionId = searchParams.get('_ptxn');
    if (!transactionId) {
      setError('missing_transaction');
      return;
    }

    let cancelled = false;
    openPaddleCheckout(transactionId)
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'checkout_failed';
        setError(message);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  if (error) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <p className="text-muted-foreground">
          {error === 'paddle_client_token_missing'
            ? t('pricing.checkoutUnavailable')
            : t('auth.somethingWrong')}
        </p>
        <Button asChild className="mt-6">
          <Link href="/pricing">{t('pricing.title')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">{t('pricing.checkoutLoading')}</p>
    </div>
  );
}
