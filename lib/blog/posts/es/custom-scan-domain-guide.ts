import type { BlogPost } from '../../types';

export const customScanDomainGuideEs: BlogPost = {
  slug: 'custom-scan-domain-setup-guide',
  title: 'Dominios de escaneo personalizados: marca tus enlaces QR con scan.tumarca.com',
  description:
    'Cómo apuntar un subdominio de escaneo personalizado a QRbanner para enlaces cortos con marca en menús, packaging y campañas — incluido en el plan gratuito.',
  keywords: ['dominio QR personalizado', 'enlace QR con marca', 'subdominio de escaneo', 'URL QR white label', 'dominio QRbanner'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Guías prácticas',
  sections: [
    {
      type: 'p',
      content:
        'Los enlaces cortos por defecto funcionan en todas partes, pero las marcas prefieren scan.tumarca.com en packaging y menús. QRbanner permite añadir un dominio de escaneo personalizado en el plan gratuito — los visitantes ven tu hostname en cada redirección.',
    },
    {
      type: 'h2',
      content: 'Checklist de configuración',
    },
    {
      type: 'ul',
      items: [
        'Elige un subdominio (p. ej. scan.acme.com o qr.acme.com)',
        'Añade el registro CNAME que proporciona QRbanner en tu DNS',
        'Verifica el dominio en Ajustes → Dominios personalizados',
        'Los códigos dinámicos existentes usan automáticamente el host con tu marca',
      ],
    },
    {
      type: 'h2',
      content: 'Consejo para agencias',
    },
    {
      type: 'p',
      content:
        'Las agencias añaden un dominio por cliente en los planes Business y Agency. Combínalo con la marca powered-by oculta en las landings para una entrega totalmente white-label.',
    },
  ],
};
