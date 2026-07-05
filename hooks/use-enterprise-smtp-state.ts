'use client';

import { useCallback, useState } from 'react';
import type { EnterpriseState } from '@/lib/enterprise-workspace-types';

export function useEnterpriseSmtpState() {
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  const [testEmail, setTestEmail] = useState('');

  const syncFromWorkspace = useCallback((ent: EnterpriseState) => {
    setSmtpHost(ent.workspace.smtpHost ?? '');
    setSmtpPort(String(ent.workspace.smtpPort ?? 587));
    setSmtpUser(ent.workspace.smtpUser ?? '');
    setSmtpFrom(ent.workspace.smtpFrom ?? '');
    setSmtpPassword('');
  }, []);

  return {
    smtpHost,
    setSmtpHost,
    smtpPort,
    setSmtpPort,
    smtpUser,
    setSmtpUser,
    smtpPassword,
    setSmtpPassword,
    smtpFrom,
    setSmtpFrom,
    testEmail,
    setTestEmail,
    syncFromWorkspace,
  };
}
