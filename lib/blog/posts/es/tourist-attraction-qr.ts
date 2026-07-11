import type { BlogPost } from '../../types';

export const touristAttractionQrEs: BlogPost = {
  slug: 'tourist-attraction-qr',
  title: 'QR para atracciones turísticas: audioguías, entradas y wayfinding',
  description:
    'Cómo museos, monumentos y atracciones usan QR dinámico en señalética de entrada para audioguías, entradas móviles y mapas de orientación.',
  keywords: ['QR atracción turística', 'código QR museo', 'QR monumento', 'QR audioguía', 'QR ticketing atracción'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Hostelería',
  sections: [
    {
      type: 'p',
      content:
        'Las atracciones imprimen el QR una sola vez en paneles de acceso, ventanillas de taquilla y marcas de sendero. Los visitantes acceden a audioguías, entradas móviles y mapas interactivos sin señalética de entrada desactualizada.',
    },
    {
      type: 'h2',
      content: 'Puntos de contacto en entrada y senderos',
    },
    {
      type: 'ul',
      items: [
        'Señalética de acceso y ventanilla de taquilla',
        'Landing pages de audioguía',
        'Enlaces de entrada móvil y pases',
        'Actualizaciones de exposiciones de temporada y horarios',
      ],
    },
    {
      type: 'h2',
      content: 'Visitas multilingües',
    },
    {
      type: 'p',
      content:
        'Enruta los escaneos por idioma o enlaza a landing pages multilingües. Compara picos de escaneo en la entrada para planificar personal y flujo de aforo.',
    },
  ],
};
