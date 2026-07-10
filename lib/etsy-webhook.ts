import { z } from 'zod';

const directSchema = z.object({
  buyerEmail: z.string().email(),
  externalOrderId: z.string().max(120).optional(),
  notes: z.string().max(500).optional(),
});

const etsyReceiptSchema = z.object({
  buyer_email: z.string().email().optional(),
  receipt_id: z.union([z.string(), z.number()]).optional(),
  receipt_type: z.string().optional(),
});

const nestedSchema = z.object({
  event_type: z.string().optional(),
  data: etsyReceiptSchema.optional(),
  buyerEmail: z.string().email().optional(),
  externalOrderId: z.string().optional(),
});

export type EtsyWebhookOrder = {
  buyerEmail: string;
  externalOrderId?: string;
  notes?: string;
};

export function verifyEtsyWebhookAuth(req: Request): boolean {
  const secret = process.env.ETSY_WEBHOOK_SECRET?.trim();
  if (!secret) return false;

  const auth = req.headers.get('authorization')?.trim();
  if (auth === `Bearer ${secret}`) return true;

  const header = req.headers.get('x-etsy-webhook-secret')?.trim();
  return header === secret;
}

export function isEtsyWebhookConfigured(): boolean {
  return Boolean(process.env.ETSY_WEBHOOK_SECRET?.trim());
}

export function parseEtsyWebhookBody(body: unknown): EtsyWebhookOrder | null {
  const direct = directSchema.safeParse(body);
  if (direct.success) {
    return {
      buyerEmail: direct.data.buyerEmail,
      externalOrderId: direct.data.externalOrderId,
      notes: direct.data.notes,
    };
  }

  const nested = nestedSchema.safeParse(body);
  if (!nested.success) return null;

  const email =
    nested.data.buyerEmail ??
    nested.data.data?.buyer_email;
  if (!email) return null;

  const receiptId = nested.data.data?.receipt_id;
  const externalOrderId =
    nested.data.externalOrderId ??
    (receiptId != null ? String(receiptId) : undefined);

  const notes =
    nested.data.event_type != null
      ? `etsy webhook · ${nested.data.event_type}`
      : undefined;

  return { buyerEmail: email, externalOrderId, notes };
}
