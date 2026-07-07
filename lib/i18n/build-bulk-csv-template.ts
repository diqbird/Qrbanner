import type { TranslateFn } from './resolve-enum-label';

const BULK_CSV_HEADERS =
  'name,category,url,phone,email,ssid,wifi_password,qr_password,expires_at,scan_limit';

export function buildBulkCsvTemplate(t: TranslateFn): string {
  return `${BULK_CSV_HEADERS}
${t('bulk.templateExampleStore1')},url,https://example.com/istanbul,,,,,,,
${t('bulk.templateExampleStore2')},url,https://example.com/ankara,,,,,,,
${t('bulk.templateExampleWifi')},wifi,,,,"GuestNetwork","welcome123",,,
`;
}
