'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { StudioEntitlementView } from '@/lib/studio-types';

type Props = {
  token: string;
  buyerEmail: string;
  buyerEmailMasked: string;
  maxQr: number;
  onClaimed: (entitlement: StudioEntitlementView) => void;
};

export function StudioClaimForm({ token, buyerEmail, buyerEmailMasked, maxQr, onClaimed }: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState(buyerEmail);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const finishSignIn = async (signInEmail: string, signInPassword: string) => {
    const result = await signIn('credentials', {
      email: signInEmail,
      password: signInPassword,
      redirect: false,
    });
    if (result?.error) {
      toast.error(t('studio.errors.signInFailed'));
      return false;
    }
    router.refresh();
    return true;
  };

  const submit = async (action: 'register' | 'login') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/studio/${encodeURIComponent(token)}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          email,
          password,
          name: action === 'register' ? name : undefined,
        }),
      });
      const json = (await res.json()) as { error?: string; entitlement?: StudioEntitlementView };

      if (!res.ok) {
        const key = `studio.errors.${json.error ?? 'unknown'}`;
        toast.error(t(key));
        return;
      }

      if (json.entitlement) {
        const signedIn = await finishSignIn(email.trim().toLowerCase(), password);
        if (signedIn) {
          onClaimed(json.entitlement);
        }
      }
    } catch {
      toast.error(t('studio.errors.unknown'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="space-y-1 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">{t('studio.claimTitle')}</h1>
        <p className="text-sm text-muted-foreground">{t('studio.claimSubtitle', { max: maxQr })}</p>
        <p className="text-xs text-muted-foreground">{t('studio.claimEmailHint', { email: buyerEmailMasked })}</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'register' | 'login')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">{t('studio.tabRegister')}</TabsTrigger>
          <TabsTrigger value="login">{t('studio.tabLogin')}</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studio-email">{t('common.email')}</Label>
            <Input
              id="studio-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={buyerEmail}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studio-name">{t('common.name')}</Label>
            <Input
              id="studio-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studio-password">{t('common.password')}</Label>
            <Input
              id="studio-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <Button className="w-full" disabled={loading} onClick={() => void submit('register')}>
            {loading ? t('common.loading') : t('studio.claimCta')}
          </Button>
        </TabsContent>

        <TabsContent value="login" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studio-login-email">{t('common.email')}</Label>
            <Input
              id="studio-login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studio-login-password">{t('common.password')}</Label>
            <Input
              id="studio-login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <Button className="w-full" disabled={loading} onClick={() => void submit('login')}>
            {loading ? t('common.loading') : t('studio.claimCtaLogin')}
          </Button>
        </TabsContent>
      </Tabs>

      <p className="text-center text-xs text-muted-foreground">{t('studio.claimFinePrint')}</p>
    </div>
  );
}
