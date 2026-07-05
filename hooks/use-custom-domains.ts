'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { parseDomains } from '@/lib/custom-domain-types';
import { useCustomDomainMutations } from '@/hooks/use-custom-domain-mutations';

export function useCustomDomains() {
  const { t } = useLanguage();
  const { data, loading, reload } = useSettingsResource({
    url: '/api/domains',
    parse: parseDomains,
  });
  const mutations = useCustomDomainMutations({ t, reload });

  const domains = data?.domains ?? [];
  const scanBaseUrl = data?.scanBaseUrl ?? 'https://qrbanner.com';
  const cnameTarget = data?.cnameTarget ?? 'qrbanner.com';

  return {
    t,
    loading,
    domains,
    scanBaseUrl,
    cnameTarget,
    ...mutations,
  };
}

export type CustomDomainsState = ReturnType<typeof useCustomDomains>;
