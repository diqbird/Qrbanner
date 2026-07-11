import type { BlogPost } from '../../types';

export const webhookAutomationGuideEs: BlogPost = {
  slug: 'qr-scan-webhook-automation-guide',
  title: 'Webhooks de escaneo QR: automatiza Slack, Sheets y CRM con cada escaneo',
  description:
    'Guía paso a paso de los webhooks firmados con HMAC de QRbanner — conecta escaneos a Zapier, Slack, Google Sheets, HubSpot y backends personalizados.',
  keywords: ['webhook QR', 'automatización escaneo QR', 'Zapier código QR', 'webhook QRbanner', 'API de escaneo'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Desarrolladores',
  sections: [
    {
      type: 'p',
      content:
        'Cada escaneo puede disparar un payload de webhook firmado con id del QR, marca temporal, dispositivo y campos de geolocalización. Los equipos lo usan para alertar canales de Slack, añadir filas a Google Sheets o actualizar leads del CRM en tiempo real.',
    },
    {
      type: 'h2',
      content: 'Configuración en tres pasos',
    },
    {
      type: 'ul',
      items: [
        'Ajustes → Webhooks → Añade el endpoint y copia el secreto de firma',
        'Verifica firmas HMAC en tu servidor o usa Zapier Catch Hook',
        'Mapea campos a tu acción — mensaje de Slack, fila de Sheet o actualización de CRM',
      ],
    },
    {
      type: 'h2',
      content: 'Zapier y no-code',
    },
    {
      type: 'p',
      content:
        'Consulta /integrations/zapier para un recorrido visual. Para apps personalizadas, combina webhooks con nuestra API REST documentada en /developers.',
    },
    {
      type: 'h2',
      content: 'Logs de entrega y depuración',
    },
    {
      type: 'p',
      content:
        'Ajustes → Scan Webhooks muestra intentos de entrega recientes con códigos de estado HTTP. Úsalo para depurar Zapier o endpoints personalizados sin adivinar si los escaneos llegaron a tu stack.',
    },
    {
      type: 'h2',
      content: 'Consejos de fiabilidad',
    },
    {
      type: 'p',
      content:
        'Devuelve 2xx con rapidez y procesa de forma asíncrona. Reintentamos entregas fallidas con backoff exponencial. Filtra webhooks por QR o campaña para reducir ruido en códigos de alto tráfico.',
    },
  ],
};
