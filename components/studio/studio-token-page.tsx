'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { Button } from '@/components/ui/button';
import { StudioClaimForm } from '@/components/studio/studio-claim-form';
import { StudioCreateProvider } from '@/components/studio/studio-create-context';
import type { StudioEntitlementView } from '@/lib/studio-types';

const QRCreateWizard = dynamic(
  () => import('@/components/qr/qr-create-wizard').then((m) => ({ default: m.QRCreateWizard })),
  {
    loading: () => (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  },
);

function StudioStatusCard({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm">
      <h1 className="font-display text-xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground">{body}</p>
      {children}
    </div>
  );
}

export function StudioTokenPage({ token }: { token: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession() || {};
  const [entitlement, setEntitlement] = useState<StudioEntitlementView | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [lastQrId, setLastQrId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/studio/${encodeURIComponent(token)}`);
      if (!res.ok) {
        setEntitlement(null);
        return;
      }
      const json = (await res.json()) as { entitlement: StudioEntitlementView };
      setEntitlement(json.entitlement);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load, authStatus]);

  const sessionClaim = async () => {
    setClaiming(true);
    try {
      const res = await fetch(`/api/studio/${encodeURIComponent(token)}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim' }),
      });
      const json = (await res.json()) as { error?: string; entitlement?: StudioEntitlementView };
      if (!res.ok || !json.entitlement) {
        toast.error(t(`studio.errors.${json.error ?? 'unknown'}`));
        return;
      }
      setEntitlement(json.entitlement);
      router.refresh();
    } finally {
      setClaiming(false);
    }
  };

  const onQrCreated = useCallback(
    (qrId: string, remaining: number) => {
      setLastQrId(qrId);
      setEntitlement((prev) =>
        prev
          ? {
              ...prev,
              qrRemaining: remaining,
              canCreate: remaining > 0,
              status: remaining > 0 ? 'claimed' : 'exhausted',
            }
          : prev,
      );
    },
    [],
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!entitlement) {
    return (
      <StudioStatusCard title={t('studio.errors.invalid_token')} body={t('studio.errors.invalid_token_body')} />
    );
  }

  if (entitlement.deliveryStatus === 'awaiting_approval') {
    return (
      <StudioStatusCard
        title={t('studio.errors.not_delivered')}
        body={t('studio.errors.not_delivered_body')}
      />
    );
  }

  if (entitlement.status === 'revoked') {
    return (
      <StudioStatusCard title={t('studio.errors.revoked')} body={t('studio.errors.revoked_body')} />
    );
  }

  if (entitlement.status === 'expired') {
    return (
      <StudioStatusCard title={t('studio.errors.expired')} body={t('studio.errors.expired_body')} />
    );
  }

  if (
    (entitlement.status === 'claimed' || entitlement.status === 'exhausted') &&
    !entitlement.isOwner
  ) {
    return (
      <StudioStatusCard title={t('studio.errors.link_already_used')} body={t('studio.errors.link_already_used_body')}>
        <Button asChild variant="outline">
          <Link href="/login">{t('common.signIn')}</Link>
        </Button>
      </StudioStatusCard>
    );
  }

  if (entitlement.status === 'pending') {
    if (session?.user?.email?.toLowerCase() === entitlement.buyerEmail) {
      return (
        <StudioStatusCard title={t('studio.activateTitle')} body={t('studio.activateBody', { max: entitlement.maxQr })}>
          <Button disabled={claiming} onClick={() => void sessionClaim()}>
            {claiming ? t('common.loading') : t('studio.activateCta')}
          </Button>
        </StudioStatusCard>
      );
    }

    return (
      <StudioClaimForm
        token={token}
        buyerEmail={entitlement.buyerEmail}
        buyerEmailMasked={entitlement.buyerEmailMasked}
        maxQr={entitlement.maxQr}
        onClaimed={(e) => {
          setEntitlement(e);
          router.refresh();
        }}
      />
    );
  }

  if (entitlement.status === 'exhausted' || entitlement.qrRemaining <= 0) {
    return (
      <StudioStatusCard title={t('studio.completeTitle')} body={t('studio.completeBody', { max: entitlement.maxQr })}>
        {lastQrId ? (
          <Button asChild>
            <Link href={`/qr/${lastQrId}`}>{t('studio.viewLastQr')}</Link>
          </Button>
        ) : null}
        <Button asChild variant="outline">
          <Link href="/pricing">{t('studio.upgradeCta')}</Link>
        </Button>
      </StudioStatusCard>
    );
  }

  if (entitlement.canCreate) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-6">
        {lastQrId ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
            <p className="font-medium">{t('studio.savedBanner')}</p>
            <Link href={`/qr/${lastQrId}`} className="text-primary underline-offset-2 hover:underline">
              {t('studio.viewLastQr')}
            </Link>
            {entitlement.qrRemaining > 0 ? (
              <span className="text-muted-foreground"> · {t('studio.createAnother')}</span>
            ) : null}
          </div>
        ) : null}

        <StudioCreateProvider
          value={{
            entitlementId: entitlement.id,
            token,
            qrRemaining: entitlement.qrRemaining,
            maxQr: entitlement.maxQr,
            onQrCreated,
          }}
        >
          <QRCreateWizard />
        </StudioCreateProvider>
      </div>
    );
  }

  return (
    <StudioStatusCard title={t('studio.errors.unknown')} body={t('studio.errors.invalid_token_body')} />
  );
}
