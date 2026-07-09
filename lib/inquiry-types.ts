export const PROCUREMENT_INQUIRY_TYPES = [
  'security_questionnaire',
  'baa',
  'dpa_request',
] as const;

export const SALES_INQUIRY_TYPES = [
  'enterprise',
  'demo',
  'general',
  ...PROCUREMENT_INQUIRY_TYPES,
] as const;

export type SalesInquiryType = (typeof SALES_INQUIRY_TYPES)[number];
export type ProcurementInquiryType = (typeof PROCUREMENT_INQUIRY_TYPES)[number];

export function parseInquiryType(raw: unknown): SalesInquiryType {
  const value = String(raw ?? '');
  return (SALES_INQUIRY_TYPES as readonly string[]).includes(value)
    ? (value as SalesInquiryType)
    : 'general';
}

export function isProcurementInquiryType(type: string): type is ProcurementInquiryType {
  return (PROCUREMENT_INQUIRY_TYPES as readonly string[]).includes(type);
}
