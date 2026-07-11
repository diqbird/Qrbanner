import type { BlogPost } from '../../types';

export const developersApiGettingStartedEs: BlogPost = {
  slug: 'developers-api-getting-started',
  title: 'API REST v1 de QRbanner: primeros pasos en 10 minutos',
  description:
    'Crea tu primera clave API, lista códigos QR y recibe webhooks de escaneo con firmas HMAC — guía rápida para desarrolladores que automatizan operaciones QR.',
  keywords: ['API códigos QR', 'API QRbanner', 'API QR dinámico', 'webhooks QR', 'automatización QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Desarrolladores',
  sections: [
    {
      type: 'p',
      content:
        'La API REST v1 de QRbanner te permite crear, actualizar y organizar códigos QR desde scripts, backends y pipelines de CI. Las claves API están disponibles en el plan gratuito — sin llamada comercial.',
    },
    {
      type: 'h2',
      content: 'Crear una clave API',
    },
    {
      type: 'ul',
      items: [
        'Inicia sesión y abre Dashboard → Settings → API Keys',
        'Crea una clave con un nombre descriptivo (p. ej. «Production backend»)',
        'Copia la clave una sola vez — solo se muestra al crearla',
        'Envíala como Authorization: Bearer o X-API-Key en cada petición',
      ],
    },
    {
      type: 'h2',
      content: 'Crea tu primer código QR',
    },
    {
      type: 'p',
      content:
        'POST /api/v1/qr con un cuerpo JSON que incluya name, category y qr_data. Los códigos URL necesitan { "url": "https://..." }. La respuesta incluye short_code y la URL de escaneo.',
    },
    {
      type: 'h2',
      content: 'Recibir webhooks de escaneo',
    },
    {
      type: 'p',
      content:
        'Añade un endpoint HTTPS en Settings → Scan Webhooks. Cada escaneo hace POST de JSON con event, qr_code_id y metadatos del escaneo. Verifica X-QRbanner-Signature con HMAC-SHA256 usando el secreto del webhook. Consulta el historial de entregas en el mismo panel.',
    },
    {
      type: 'h2',
      content: 'Especificación OpenAPI',
    },
    {
      type: 'p',
      content:
        'Descarga openapi.json desde /developers o /api/openapi.json para importar la API REST v1 en Postman, Insomnia o tu API gateway — incluye esquemas de QR, carpetas y webhooks.',
    },
  ],
};
