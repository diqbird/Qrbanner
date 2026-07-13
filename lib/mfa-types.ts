export type MfaStatus = {
  enabled: boolean;
  hasPassword: boolean;
  recoveryCodesRemaining: number;
};

export type MfaSetupData = {
  qrDataUrl: string;
  secret: string;
  otpauthUrl: string;
};

export function parseMfaStatus(json: unknown): MfaStatus {
  const data = json as Record<string, unknown>;
  return {
    enabled: Boolean(data.enabled),
    hasPassword: Boolean(data.hasPassword),
    recoveryCodesRemaining:
      typeof data.recoveryCodesRemaining === 'number' ? data.recoveryCodesRemaining : 0,
  };
}
