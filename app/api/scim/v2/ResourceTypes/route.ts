export const dynamic = 'force-dynamic';

import { SCIM_RESOURCE_TYPES, scimJson } from '@/lib/scim';

export async function GET() {
  return scimJson(SCIM_RESOURCE_TYPES);
}
