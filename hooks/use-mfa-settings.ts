'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { useMfaSettingsActions } from '@/hooks/use-mfa-settings-actions';
import { parseMfaStatus, type MfaSetupData } from '@/lib/mfa-types';

export function useMfaSettings() {
  const { t } = useLanguage();
  const { data, loading, reload } = useSettingsResource({
    url: '/api/auth/mfa',
    parse: parseMfaStatus,
  });
  const [working, setWorking] = useState(false);
  const [setup, setSetup] = useState<MfaSetupData | null>(null);
  const [password, setPassword] = useState('');
  const [enableCode, setEnableCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');

  const enabled = data?.enabled ?? false;
  const hasPassword = data?.hasPassword ?? false;

  const actions = useMfaSettingsActions({
    t,
    hasPassword,
    password,
    enableCode,
    disableCode,
    disablePassword,
    setup,
    setSetup,
    setPassword,
    setEnableCode,
    setDisableCode,
    setDisablePassword,
    setWorking,
    reload,
  });

  return {
    t,
    loading,
    enabled,
    hasPassword,
    working,
    setup,
    setSetup,
    password,
    setPassword,
    enableCode,
    setEnableCode,
    disableCode,
    setDisableCode,
    disablePassword,
    setDisablePassword,
    ...actions,
  };
}

export type MfaSettingsState = ReturnType<typeof useMfaSettings>;
