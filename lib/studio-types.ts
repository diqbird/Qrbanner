export type StudioEntitlementStatus =
  | 'pending'
  | 'claimed'
  | 'exhausted'
  | 'revoked'
  | 'expired';

export type StudioEntitlementView = {
  id: string;
  token: string;
  buyerEmail: string;
  buyerEmailMasked: string;
  maxQr: number;
  qrRemaining: number;
  status: StudioEntitlementStatus;
  source: string;
  externalOrderId: string | null;
  expiresAt: string | null;
  claimedAt: string | null;
  isOwner: boolean;
  canCreate: boolean;
};
