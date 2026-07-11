import type { BlogPost } from '../../types';

export const agencyQrCodesEs: BlogPost = {
  slug: 'marketing-agency-qr-white-label-guide',
  title: 'Guía para agencias: códigos QR white-label para campañas de clientes',
  description:
    'Cómo las agencias entregan QR dinámico a escala — workspaces, dominios personalizados, branding oculto, importación masiva e informes para clientes en el plan Agency de QRbanner.',
  keywords: ['códigos QR agencia', 'QR white label', 'plataforma QR reseller', 'campañas QR clientes', 'QR agencia marketing'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Agencias',
  sections: [
    {
      type: 'p',
      content:
        'Las agencias gestionan docenas de campañas de clientes — cada una con dominios, landing pages y necesidades de reporting distintas. Una sola herramienta de QR con opciones white-label supera a encadenar generadores genéricos por proyecto.',
    },
    {
      type: 'h2',
      content: 'Flujo de trabajo Agency en QRbanner',
    },
    {
      type: 'ul',
      items: [
        'Crea una carpeta o workspace por cliente',
        'Importa en masa códigos de eventos o retail desde CSV',
        'Apunta scan.yourclient.com mediante verificación de dominio personalizado',
        'Oculta “Powered by QRbanner” en los planes Agency / Business',
        'Envía eventos de escaneo al Slack del cliente vía webhooks',
      ],
    },
    {
      type: 'h2',
      content: 'Qué facturar a los clientes',
    },
    {
      type: 'p',
      content:
        'Empaqueta la configuración de QR como partida: creativo, copy de landing, exportación de archivos de impresión y revisión mensual de analytics. Los códigos dinámicos justifican un retainer porque destinos y reglas de enrutado evolucionan sin costes de reimpresión.',
    },
    {
      type: 'h2',
      content: 'Crecimiento por referidos',
    },
    {
      type: 'p',
      content:
        'Comparte tu enlace de referido desde Settings — gana crédito cuando los clientes se registran y verifican. Combínalo con la calculadora de ROI en tu pitch deck para mostrar el ahorro de impresión frente a códigos estáticos.',
    },
  ],
};
