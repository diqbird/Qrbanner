import type { BlogPost } from '../../types';

export const universityWayfindingQrEs: BlogPost = {
  slug: 'university-campus-wayfinding-qr',
  title: 'QR en campus universitario: wayfinding, comedores y eventos sin reimpresiones',
  description:
    'Cómo las universidades usan QR dinámico en entradas de edificios y paradas de bus para orientación, horarios de comedor e inscripción en vivo a eventos.',
  keywords: ['código QR universidad', 'QR wayfinding campus', 'QR orientación universitaria', 'QR educación superior'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Educación',
  sections: [
    {
      type: 'p',
      content:
        'Los mapas del campus quedan obsoletos la semana en que se imprimen. El QR dinámico en entradas de edificios y paradas de transporte permite a los estudiantes abrir horarios en vivo, menús de comedor e inscripción a eventos en el móvil — mientras facilities actualiza las URLs cada semestre.',
    },
    {
      type: 'h2',
      content: 'Ubicaciones de alto impacto',
    },
    {
      type: 'ul',
      items: [
        'Entradas de edificios y lobbies de ascensor',
        'Paradas de shuttle y aparcamientos',
        'Comedores y mostradores de biblioteca',
        'Señalética de semana de orientación y residencias',
      ],
    },
    {
      type: 'h2',
      content: 'Enrutado para el calendario académico',
    },
    {
      type: 'p',
      content:
        'El enrutado programado cambia páginas de comedor y biblioteca automáticamente. Los overlays de eventos durante homecoming o exámenes redirigen al registro sin pedir pegatinas nuevas.',
    },
    {
      type: 'p',
      content:
        'Consulta nuestro caso de estudio universitario y la página de solución en /solutions/university-campus para plantillas de despliegue.',
    },
  ],
};
