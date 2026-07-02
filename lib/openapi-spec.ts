const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  'https://qrbanner.com'
).replace(/\/$/, '');

export function buildOpenApiSpec() {
  return {
    openapi: '3.0.3',
    info: {
      title: 'QRbanner REST API',
      version: '1.0.0',
      description:
        'Programmatic access to QR codes and folders. Authenticate with an API key from Dashboard → Settings.\n\n' +
        '## Rate limits\n' +
        'Requests are limited per plan on two axes: a per-minute burst limit and a monthly quota.\n\n' +
        '| Plan | Per minute | Monthly quota |\n' +
        '| --- | --- | --- |\n' +
        '| Free | 60 | 1,000 |\n' +
        '| Pro | 120 | 10,000 |\n' +
        '| Business | 300 | 100,000 |\n' +
        '| Agency | 600 | 500,000 |\n\n' +
        'Every response includes `X-RateLimit-*` headers (limit, remaining, reset) and `X-RateLimit-Quota-*` for the monthly quota. ' +
        'Exceeding a limit returns HTTP 429 with a `Retry-After` header.',
      contact: { name: 'QRbanner Support', url: `${SITE_URL}/contact` },
    },
    servers: [{ url: SITE_URL }],
    tags: [
      { name: 'Meta', description: 'API discovery' },
      { name: 'QR Codes', description: 'Create and manage dynamic QR codes' },
      { name: 'Folders', description: 'Organize QR codes into folders' },
      { name: 'Webhooks', description: 'Outbound scan event notifications (configured in dashboard)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'API key from Dashboard → Settings',
        },
        apiKeyHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'Alternative to Authorization: Bearer',
        },
      },
      schemas: {
        ApiError: {
          type: 'object',
          properties: { error: { type: 'string' } },
        },
        QrCode: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            short_code: { type: 'string' },
            scan_url: { type: 'string', format: 'uri' },
            category: { type: 'string' },
            target_url: { type: 'string' },
            qr_data: { type: 'object', additionalProperties: true },
            is_active: { type: 'boolean' },
            total_scans: { type: 'integer' },
            folder_id: { type: 'string', nullable: true },
            labels: { type: 'array', items: { type: 'string' } },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Folder: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            color: { type: 'string' },
            qr_count: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        ScanWebhookPayload: {
          type: 'object',
          required: ['event', 'qr_code_id', 'short_code', 'scan'],
          properties: {
            event: { type: 'string', enum: ['scan'] },
            qr_code_id: { type: 'string' },
            qr_name: { type: 'string' },
            short_code: { type: 'string' },
            scan: {
              type: 'object',
              properties: {
                country: { type: 'string', nullable: true },
                city: { type: 'string', nullable: true },
                device: { type: 'string', nullable: true },
                browser: { type: 'string', nullable: true },
                os: { type: 'string', nullable: true },
                scanned_at: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }, { apiKeyHeader: [] }],
    paths: {
      '/api/v1': {
        get: {
          tags: ['Meta'],
          summary: 'API discovery',
          responses: {
            '200': { description: 'Endpoint list and examples' },
            '401': { description: 'Missing or invalid API key' },
          },
        },
      },
      '/api/v1/qr': {
        get: {
          tags: ['QR Codes'],
          summary: 'List QR codes',
          parameters: [
            { name: 'folder_id', in: 'query', schema: { type: 'string' } },
            { name: 'label', in: 'query', schema: { type: 'string' } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 50, maximum: 100 } },
            { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
            { name: 'unfiled', in: 'query', schema: { type: 'string', enum: ['1'] } },
          ],
          responses: {
            '200': {
              description: 'Paginated QR list',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: { $ref: '#/components/schemas/QrCode' } },
                      pagination: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer' },
                          limit: { type: 'integer' },
                          offset: { type: 'integer' },
                          count: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['QR Codes'],
          summary: 'Create QR code',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'category'],
                  properties: {
                    name: { type: 'string' },
                    category: { type: 'string', example: 'url' },
                    url: { type: 'string', format: 'uri' },
                    qr_data: { type: 'object', additionalProperties: true },
                    folder_id: { type: 'string' },
                    labels: { type: 'array', items: { type: 'string' } },
                    is_active: { type: 'boolean' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'QR created' },
            '400': { description: 'Validation error' },
            '403': { description: 'Plan limit reached' },
          },
        },
      },
      '/api/v1/qr/{id}': {
        get: {
          tags: ['QR Codes'],
          summary: 'Get QR code',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'QR details' }, '404': { description: 'Not found' } },
        },
        patch: {
          tags: ['QR Codes'],
          summary: 'Update QR code',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    qr_data: { type: 'object' },
                    folder_id: { type: 'string', nullable: true },
                    labels: { type: 'array', items: { type: 'string' } },
                    is_active: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: { '200': { description: 'Updated' }, '404': { description: 'Not found' } },
        },
        delete: {
          tags: ['QR Codes'],
          summary: 'Delete QR code',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } },
        },
      },
      '/api/v1/folders': {
        get: {
          tags: ['Folders'],
          summary: 'List folders',
          responses: { '200': { description: 'Folder list' } },
        },
        post: {
          tags: ['Folders'],
          summary: 'Create folder',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                    color: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Created' }, '409': { description: 'Duplicate name' } },
        },
      },
      '/api/v1/folders/{id}': {
        get: {
          tags: ['Folders'],
          summary: 'Get folder',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Folder' }, '404': { description: 'Not found' } },
        },
        patch: {
          tags: ['Folders'],
          summary: 'Update folder',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Folders'],
          summary: 'Delete folder',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
    },
    'x-webhooks': {
      scan: {
        post: {
          summary: 'QR scan event (outbound)',
          description:
            'Configured in Dashboard → Settings → Scan Webhooks. QRbanner POSTs to your HTTPS URL with HMAC-SHA256 signature in X-QRbanner-Signature.',
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ScanWebhookPayload' },
              },
            },
          },
          responses: { '2XX': { description: 'Your server acknowledged the event' } },
        },
      },
    },
  };
}
