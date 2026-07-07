'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { usePlanUsage } from '@/hooks/use-plan-usage';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { TeamWorkspaceState } from '@/hooks/use-team-workspace';

const STEPS = [1, 2, 3, 4] as const;

function isIdpConfigured(idpSsoUrl: string, idpCertificate: string): boolean {
  return Boolean(idpSsoUrl.trim() && idpCertificate.trim());
}

function buildSamlUrls(slug: string) {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://qrbanner.com';
  const entityId = `${base}/api/auth/saml/metadata?workspace=${encodeURIComponent(slug)}`;
  return {
    acsUrl: `${base}/api/auth/saml/acs`,
    entityId,
    metadataUrl: entityId,
    loginUrl: `${base}/api/auth/saml/login?workspace=${encodeURIComponent(slug)}`,
  };
}

type TeamSamlWizardProps = {
  team: TeamWorkspaceState;
};

function CopyRow({ label, value, onCopy }: { label: string; value: string; onCopy: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <p className="font-medium">{label}</p>
      <div className="flex gap-2">
        <code className="block flex-1 break-all rounded bg-background px-2 py-1.5 text-[11px]">{value}</code>
        <Button type="button" size="icon-sm" variant="outline" onClick={() => onCopy(value)} aria-label={label}>
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function TeamSamlWizard({ team }: TeamSamlWizardProps) {
  const {
    t,
    workspace,
    idpEntityId,
    setIdpEntityId,
    idpSsoUrl,
    setIdpSsoUrl,
    idpCertificate,
    setIdpCertificate,
    working,
    saveSsoSettings,
    toggleSso,
  } = team;
  const { locale } = useLanguage();
  const { data: planData } = usePlanUsage();
  const [step, setStep] = useState<(typeof STEPS)[number]>(1);

  const hasSsoPlan = planData?.plan.id === 'business' || planData?.plan.id === 'agency';
  const configured = useMemo(
    () => isIdpConfigured(idpSsoUrl, idpCertificate),
    [idpSsoUrl, idpCertificate],
  );

  if (!workspace?.slug) return null;

  const urls = buildSamlUrls(workspace.slug);

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t('settings.team.samlCopied'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const saveIdp = async () => {
    await saveSsoSettings();
    if (configured || (idpSsoUrl.trim() && idpCertificate.trim())) {
      setStep(4);
    }
  };

  return (
    <div id="saml-wizard" className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{t('settings.team.samlWizardTitle')}</p>
          <p className="text-xs text-muted-foreground">{t('settings.team.samlWizardDesc')}</p>
        </div>
        <Badge variant="secondary">
          {t('settings.team.samlWizardStep', {
            step: formatLocaleNumber(step, locale),
            total: formatLocaleNumber(STEPS.length, locale),
          })}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {STEPS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setStep(n)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              step === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {t(`settings.team.samlStep${n}Label`)}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">{t('settings.team.samlStep1Desc')}</p>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <CheckCircle2 className={`h-4 w-4 shrink-0 ${hasSsoPlan ? 'text-primary' : 'text-muted-foreground'}`} />
              <span>{t('settings.team.samlReqPlan')}</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              <span>{t('settings.team.samlReqTeam')}</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              <span>{t('settings.team.samlReqIdp')}</span>
            </li>
          </ul>
          {!hasSsoPlan && (
            <p className="text-xs text-muted-foreground">
              {t('settings.team.samlUpgradeHint')}{' '}
              <Link href="/pricing" className="text-primary hover:underline">
                {t('planUsage.viewPricing')}
              </Link>
            </p>
          )}
          <Button type="button" size="sm" onClick={() => setStep(2)}>
            {t('settings.team.samlContinue')}
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">{t('settings.team.samlStep2Desc')}</p>
          <div className="space-y-3 rounded-md bg-muted/40 p-3 text-xs">
            <CopyRow label={t('settings.team.samlAcsUrl')} value={urls.acsUrl} onCopy={copyValue} />
            <CopyRow label={t('settings.team.samlEntityId')} value={urls.entityId} onCopy={copyValue} />
            <CopyRow label={t('settings.team.samlMetadataUrl')} value={urls.metadataUrl} onCopy={copyValue} />
          </div>
          <Button type="button" size="sm" variant="outline" onClick={() => setStep(1)}>
            {t('common.back')}
          </Button>
          <Button type="button" size="sm" className="ml-2" onClick={() => setStep(3)}>
            {t('settings.team.samlContinue')}
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{t('settings.team.samlStep3Desc')}</p>
          <div className="space-y-2">
            <Label htmlFor="idp-entity-id">{t('settings.team.idpEntityId')}</Label>
            <Input
              id="idp-entity-id"
              value={idpEntityId}
              onChange={(e) => setIdpEntityId(e.target.value)}
              placeholder={t('settings.team.idpEntityIdPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idp-sso-url">{t('settings.team.idpSsoUrl')}</Label>
            <Input
              id="idp-sso-url"
              value={idpSsoUrl}
              onChange={(e) => setIdpSsoUrl(e.target.value)}
              placeholder={t('settings.team.idpSsoUrlPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idp-certificate">{t('settings.team.idpCertificate')}</Label>
            <Textarea
              id="idp-certificate"
              value={idpCertificate}
              onChange={(e) => setIdpCertificate(e.target.value)}
              placeholder={t('settings.team.idpCertificatePlaceholder')}
              rows={5}
              className="font-mono text-xs"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setStep(2)}>
              {t('common.back')}
            </Button>
            <Button type="button" size="sm" loading={working} onClick={saveIdp}>
              {t('settings.team.samlSaveIdp')}
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">{t('settings.team.samlStep4Desc')}</p>
          {!configured && (
            <p className="text-xs text-amber-600 dark:text-amber-400">{t('settings.team.samlIdpIncomplete')}</p>
          )}
          <CopyRow label={t('settings.team.samlLoginUrl')} value={urls.loginUrl} onCopy={copyValue} />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!configured}
              className="gap-2"
              onClick={() => window.open(urls.loginUrl, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="h-4 w-4" />
              {t('settings.team.samlTestLogin')}
            </Button>
            {hasSsoPlan && configured && (
              <Button
                type="button"
                size="sm"
                loading={working}
                onClick={() => toggleSso(true)}
                disabled={Boolean(workspace.ssoEnabled)}
              >
                {workspace.ssoEnabled ? t('settings.team.ssoEnabled') : t('settings.team.samlEnableSso')}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{t('settings.team.samlEnableHint')}</p>
        </div>
      )}
    </div>
  );
}
