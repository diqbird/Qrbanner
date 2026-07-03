export const dynamic = 'force-dynamic';

import { SCIM_SCHEMAS, scimJson } from '@/lib/scim';

export async function GET() {
  return scimJson(SCIM_SCHEMAS);
}
