'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

export default function InvitePage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;
  const [invite, setInvite] = useState<{ email: string; workspace: { name: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/invite/${token}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setInvite(data))
      .finally(() => setLoading(false));
  }, [token]);

  const acceptInvite = async () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/invite/${token}`)}`);
      return;
    }
    setJoining(true);
    try {
      const userId = (session.user as { id?: string }).id;
      const res = await fetch(`/api/invite/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'mfa_required') {
          router.push(`/mfa-verify?callbackUrl=${encodeURIComponent(`/invite/${token}`)}`);
          return;
        }
        return toast.error(resolveApiError(t, data.error, 'invite.joinFailed'));
      }
      toast.success(t('invite.joinSuccess'));
      router.replace('/dashboard');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-10 text-center text-muted-foreground">
            {t('invite.notFound')}
            <Link href="/" className="mt-4 block text-primary">
              {t('invite.goHome')}
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
          <CardTitle>{t('invite.title')}</CardTitle>
          <CardDescription>
            {t('invite.joinWorkspace', { name: invite.workspace.name })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            {t('invite.invitedAs', { email: invite.email })}
          </p>
          {status === 'authenticated' ? (
            (session as { mfaVerified?: boolean }).mfaVerified === false ? (
              <Button
                className="w-full"
                onClick={() =>
                  router.push(`/mfa-verify?callbackUrl=${encodeURIComponent(`/invite/${token}`)}`)
                }
              >
                {t('settings.mfa.verify')}
              </Button>
            ) : (
              <Button className="w-full" loading={joining} onClick={acceptInvite}>
                {t('invite.accept')}
              </Button>
            )
          ) : (
            <Button className="w-full" onClick={() => signIn(undefined, { callbackUrl: `/invite/${token}` })}>
              {t('invite.signInToAccept')}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
