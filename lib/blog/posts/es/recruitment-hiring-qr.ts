import type { BlogPost } from '../../types';

export const recruitmentHiringQrEs: BlogPost = {
  slug: 'recruitment-hiring-qr',
  title: 'QR de reclutamiento: ofertas, enlaces de aplicación y ferias de empleo',
  description:
    'Cómo reclutadores y agencias de staffing usan QR dinámico en pósters de carreras y carpas de ferias para vacantes y candidaturas móviles.',
  keywords: ['código QR reclutamiento', 'QR hiring', 'QR feria de empleo', 'QR agencia de staffing', 'QR carreras'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Servicios profesionales',
  sections: [
    {
      type: 'p',
      content:
        'Los reclutadores colocan QR en señales del lobby, carpas de ferias de empleo y pósters de contratación en escaparates. Los candidatos ven vacantes y se postulan desde el móvil sin listados impresos desactualizados.',
    },
    {
      type: 'h2',
      content: 'Ubicaciones en carreras y ferias',
    },
    {
      type: 'ul',
      items: [
        'Señalética de carreras en el lobby de la oficina',
        'Carpas y banners del stand en ferias de empleo',
        'Carteles de «estamos contratando» en escaparates',
        'Tarjetas de visita del reclutador con enlaces personales de aplicación',
      ],
    },
    {
      type: 'h2',
      content: 'Conéctalo a tu ATS',
    },
    {
      type: 'p',
      content:
        'Los webhooks envían eventos de candidatura a tu ATS. Mide qué reclutadores y eventos aportan más candidatos cualificados.',
    },
  ],
};
