export {
  useMfaSetupAction,
  useMfaEnableAction,
  useMfaDisableAction,
} from '@/hooks/use-mfa-setup-enable-actions';

import {
  useMfaSetupAction,
  useMfaEnableAction,
  useMfaDisableAction,
} from '@/hooks/use-mfa-setup-enable-actions';
import type { MfaSetupData } from '@/lib/mfa-types';

type Translate = (key: string) => string;

export function useMfaSettingsActions({
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
}: {
  t: Translate;
  hasPassword: boolean;
  password: string;
  enableCode: string;
  disableCode: string;
  disablePassword: string;
  setup: MfaSetupData | null;
  setSetup: (setup: MfaSetupData | null) => void;
  setPassword: (password: string) => void;
  setEnableCode: (code: string) => void;
  setDisableCode: (code: string) => void;
  setDisablePassword: (password: string) => void;
  setWorking: (working: boolean) => void;
  reload: () => void;
}) {
  const { startSetup } = useMfaSetupAction({ t, hasPassword, password, setSetup, setPassword, setWorking });
  const { confirmEnable } = useMfaEnableAction({ t, enableCode, setSetup, setEnableCode, setWorking, reload });
  const { disableMfa, copySecret } = useMfaDisableAction({
    t,
    hasPassword,
    disableCode,
    disablePassword,
    setup,
    setDisableCode,
    setDisablePassword,
    setWorking,
    reload,
  });

  return { startSetup, confirmEnable, disableMfa, copySecret };
}
