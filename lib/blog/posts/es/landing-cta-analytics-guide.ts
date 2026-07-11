import type { BlogPost } from '../../types';

export const landingCtaAnalyticsGuideEs: BlogPost = {
  slug: 'landing-page-cta-analytics-guide',
  title: 'Analítica de CTA en landing pages: mide la conversión de escaneo a clic',
  description:
    'Los escaneos en bruto solo cuentan la mitad de la historia. Aprende cómo QRbanner rastrea los clics en botones de la landing para optimizar menús, cupones e instalaciones de apps.',
  keywords: ['analítica CTA QR', 'conversión landing page', 'ROI marketing QR', 'seguimiento clics botón'],
  publishedAt: '2026-07-01',
  updatedAt: '2026-07-01',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Analítica',
  sections: [
    {
      type: 'p',
      content:
        'Un QR de restaurante puede recibir 500 escaneos a la semana — pero ¿cuántos comensales pulsan realmente «Ver menú» o «Pedir ahora»? QRbanner separa los eventos de escaneo de los clics en CTA de las landing pages con marca.',
    },
    {
      type: 'h2',
      content: 'Métricas a vigilar',
    },
    {
      type: 'ul',
      items: [
        'Tasa de clic CTA por código QR (clics ÷ escaneos).',
        'Compara variantes cuando el enrutado A/B está activado.',
        'Combínalo con GA4 o Meta Pixel para el ingreso posterior.',
      ],
    },
    {
      type: 'h2',
      content: 'Dónde encontrar los datos',
    },
    {
      type: 'p',
      content:
        'Abre cualquier QR → Analytics. El panel Landing CTA muestra clics totales, clics únicos y eventos recientes. Exporta CSV junto con desgloses por país, dispositivo y hora para informes de campaña.',
    },
    {
      type: 'h2',
      content: 'Guía de optimización',
    },
    {
      type: 'ul',
      items: [
        'Prueba etiquetas CTA más cortas («Pedir» vs «Pulsa para pedir online»).',
        'Alinea los colores de acento con la señalética impresa para generar confianza.',
        'Reubica códigos con CTR bajo o renueva el copy de la landing sin reimprimir la imagen del QR.',
      ],
    },
  ],
};
