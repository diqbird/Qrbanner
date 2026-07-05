'use client';

import { useState } from 'react';
import type { DnsInstructions } from '@/lib/custom-domain-types';
import { useCustomDomainAddVerify } from '@/hooks/use-custom-domain-add-verify';
import { useCustomDomainManage } from '@/hooks/use-custom-domain-manage';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useCustomDomainMutations({
  t,
  reload,
}: {
  t: Translate;
  reload: () => void;
}) {
  const [working, setWorking] = useState(false);
  const [pendingDns, setPendingDns] = useState<DnsInstructions | null>(null);

  const addVerify = useCustomDomainAddVerify({ t, reload, setWorking, setPendingDns });
  const manage = useCustomDomainManage({ t, reload });

  return {
    newDomain: addVerify.newDomain,
    setNewDomain: addVerify.setNewDomain,
    working,
    pendingDns,
    addDomain: addVerify.addDomain,
    verifyDomain: addVerify.verifyDomain,
    setPrimary: manage.setPrimary,
    removeDomain: manage.removeDomain,
    copy: manage.copy,
  };
}
