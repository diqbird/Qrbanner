import type { BlogPost } from '../../types';

export const accountingFirmQrEs: BlogPost = {
  slug: 'accounting-firm-qr',
  title: 'QR para asesorías: captación de clientes, portales fiscales y subida de documentos',
  description:
    'Cómo las asesorías usan QR dinámicos para captación en temporada fiscal, subidas seguras de documentos y reserva de citas sin reimprimir mailings.',
  keywords: ['QR asesoría contable', 'código QR CPA', 'QR captación clientes fiscales', 'marketing contable', 'QR portal cliente'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Servicios profesionales',
  sections: [
    {
      type: 'p',
      content:
        'Las asesorías colocan QR en mostradores del lobby, sobres fiscales y mailings de fin de año. Los clientes completan la captación en el móvil y suben documentos a portales seguros antes de la cita.',
    },
    {
      type: 'h2',
      content: 'Ubicaciones en temporada fiscal',
    },
    {
      type: 'ul',
      items: [
        'Mostrador del lobby y señalización de la sala de espera',
        'Sobres de declaración y mailings de organizadores',
        'Postales de recordatorio de plazos',
        'Tarjetas de visita de socios con enlaces de captación personales',
      ],
    },
    {
      type: 'h2',
      content: 'Conecta con tu software de despacho',
    },
    {
      type: 'p',
      content:
        'Los webhooks envían los envíos de formularios a tu sistema de gestión del despacho. Exporta registros de escaneo para informes de socios y revisiones de campañas estacionales.',
    },
  ],
};
