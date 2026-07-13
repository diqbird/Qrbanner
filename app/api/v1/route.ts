export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { authenticateApiRequest, isAuthError, apiSuccess } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  const h = auth.rateLimitHeaders;
  return apiSuccess({
    api_version: 'v1',
    base_url: '/api/v1',
    authentication: 'Authorization: Bearer <api_key> or X-API-Key: <api_key>',
    rate_limits: {
      per_minute: Number(h['X-RateLimit-Limit'] ?? 0),
      per_minute_remaining: Number(h['X-RateLimit-Remaining'] ?? 0),
      monthly_quota: Number(h['X-RateLimit-Quota'] ?? 0),
      monthly_quota_remaining: Number(h['X-RateLimit-Quota-Remaining'] ?? 0),
      note: 'Limits are per plan. 429 responses include Retry-After.',
    },
    endpoints: [
      { method: 'GET', path: '/api/v1/qr', description: 'List QR codes' },
      { method: 'POST', path: '/api/v1/qr', description: 'Create QR code' },
      { method: 'GET', path: '/api/v1/qr/:id', description: 'Get QR code' },
      { method: 'GET', path: '/api/v1/qr/:id/analytics', description: 'QR scan analytics summary' },
      { method: 'PATCH', path: '/api/v1/qr/:id', description: 'Update QR code' },
      { method: 'DELETE', path: '/api/v1/qr/:id', description: 'Delete QR code' },
      { method: 'GET', path: '/api/v1/folders', description: 'List folders' },
      { method: 'POST', path: '/api/v1/folders', description: 'Create folder' },
      { method: 'GET', path: '/api/v1/folders/:id', description: 'Get folder' },
      { method: 'PATCH', path: '/api/v1/folders/:id', description: 'Update folder' },
      { method: 'DELETE', path: '/api/v1/folders/:id', description: 'Delete folder' },
    ],
    create_qr_example: {
      name: 'My Website QR',
      category: 'url',
      url: 'https://example.com',
      labels: ['marketing'],
      folder_id: 'optional-folder-id',
    },
  }, 200, auth.rateLimitHeaders);
}
