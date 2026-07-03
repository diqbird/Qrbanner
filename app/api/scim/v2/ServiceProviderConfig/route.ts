export const dynamic = 'force-dynamic';

import { SERVICE_PROVIDER_CONFIG, scimJson } from '@/lib/scim';

export async function GET() {
  return scimJson(SERVICE_PROVIDER_CONFIG);
}
