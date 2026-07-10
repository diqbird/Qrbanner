export type StudioEntitlementStatus =
  | 'pending'
  | 'claimed'
  | 'exhausted'
  | 'revoked'
  | 'expired';

export type StudioDeliveryStatus = 'awaiting_approval' | 'sent';

export type StudioEntitlementView = {
  id: string;
  token: string;
  buyerEmail: string;
  buyerEmailMasked: string;
  maxQr: number;
  qrRemaining: number;
  status: StudioEntitlementStatus;
  deliveryStatus: StudioDeliveryStatus;
  source: string;
  externalOrderId: string | null;
  expiresAt: string | null;
  claimedAt: string | null;
  sentAt: string | null;
  isOwner: boolean;
  canCreate: boolean;
};
