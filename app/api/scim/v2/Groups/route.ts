export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import {
  SCIM_ROLE_GROUPS,
  authenticateScimRequest,
  isScimRoleGroupId,
  loadRoleGroupMembers,
  roleGroupToScim,
  scimError,
  scimJson,
  type ScimRoleGroupId,
} from '@/lib/scim';

function parseGroupFilter(filter: string): ScimRoleGroupId | null {
  const eq =
    filter.match(/(?:id|displayName)\s+eq\s+"([^"]+)"/i) ??
    filter.match(/(?:id|displayName)\s+eq\s+'([^']+)'/i);
  if (!eq?.[1]) return null;
  const id = eq[1].trim().toLowerCase();
  return isScimRoleGroupId(id) ? id : null;
}

export async function GET(req: NextRequest) {
  const auth = await authenticateScimRequest(req);
  if (!auth) return scimError('Unauthorized', 401);

  const filter = req.nextUrl.searchParams.get('filter') ?? '';
  const filtered = filter ? parseGroupFilter(filter) : null;
  if (filter && !filtered) {
    return scimJson({
      schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
      totalResults: 0,
      startIndex: 1,
      itemsPerPage: 0,
      Resources: [],
    });
  }

  const ids = filtered ? [filtered] : [...SCIM_ROLE_GROUPS];
  const Resources = await Promise.all(
    ids.map(async (id) => roleGroupToScim(id, await loadRoleGroupMembers(auth.workspaceId, id)))
  );

  return scimJson({
    schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
    totalResults: Resources.length,
    startIndex: 1,
    itemsPerPage: Resources.length,
    Resources,
  });
}

/** Idempotent: only fixed role groups exist; unknown names rejected. */
export async function POST(req: NextRequest) {
  const auth = await authenticateScimRequest(req);
  if (!auth) return scimError('Unauthorized', 401);

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const raw = String(body.displayName ?? body.id ?? '')
    .trim()
    .toLowerCase();
  if (!isScimRoleGroupId(raw)) {
    return scimError('Only virtual role groups admin, editor, viewer are supported', 400);
  }

  const members = await loadRoleGroupMembers(auth.workspaceId, raw);
  return scimJson(roleGroupToScim(raw, members), 201);
}
