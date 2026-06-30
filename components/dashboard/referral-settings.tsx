'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Gift, Copy, Loader2, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { ReferralRewardProgress } from './referral-reward-progress';
import { ReferralRewardClaim } from './referral-reward-claim';
import { getReferralRewardProgress } from '@/lib/referral-rewards';

export function ReferralSettings() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [link, setLink] = useState('');
  const [signupCount, setSignupCount] = useState(0);
  const [rewards, setRewards] = useState(() => getReferralRewardProgress(0));
  const [hidePoweredBy, setHidePoweredBy] = useState(false);
  const [agencyName, setAgencyName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [rewardEligible, setRewardEligible] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/referral');
      if (res.ok) {
        const data = await res.json();
        setLink(data.link ?? '');
        setSignupCount(data.signupCount ?? 0);
        if (data.rewards) {
          setRewards(data.rewards);
        } else {
          setRewards(getReferralRewardProgress(data.signupCount ?? 0));
        }
        const b = data.branding ?? {};
        setHidePoweredBy(Boolean(b.hidePoweredBy));
        setAgencyName(b.agencyName ?? '');
        setSupportEmail(b.supportEmail ?? '');
        setRewardEligible(Boolean(data.rewardEligible));
        setRewardClaimed(Boolean(data.rewardClaimed ?? b.referralRewardClaimed));
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const copyLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      toast.success(t('referral.copied'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const saveBranding = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/referral', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hidePoweredBy, agencyName, supportEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('settings.profileUpdateFailed'));
        return;
      }
      toast.success(t('referral.brandingSaved'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            {t('referral.title')}
          </CardTitle>
          <CardDescription>{t('referral.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input readOnly value={link} className="font-mono text-sm" />
            <Button type="button" variant="outline" size="icon" onClick={copyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('referral.signups', { count: signupCount })}
          </p>
          {rewards.nextMilestone !== null && (
            <div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('referral.progressLabel')}</span>
                <span>
                  {signupCount} / {rewards.nextMilestone}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${rewards.progressPercent}%` }}
                />
              </div>
            </div>
          )}
          <ReferralRewardProgress signupCount={signupCount} />
          <ReferralRewardClaim eligible={rewardEligible} claimed={rewardClaimed} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            {t('referral.brandingTitle')}
          </CardTitle>
          <CardDescription>{t('referral.brandingDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>{t('referral.hidePoweredBy')}</Label>
              <p className="text-xs text-muted-foreground">{t('referral.hidePoweredByDesc')}</p>
            </div>
            <Switch checked={hidePoweredBy} onCheckedChange={setHidePoweredBy} />
          </div>
          <div className="space-y-2">
            <Label>{t('referral.agencyName')}</Label>
            <Input
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder={t('referral.agencyNamePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('referral.supportEmail')}</Label>
            <Input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="support@youragency.com"
            />
          </div>
          <Button onClick={saveBranding} loading={saving}>
            {t('referral.saveBranding')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
