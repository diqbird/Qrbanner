import type { BlogPost } from '../../types';

export const restaurantMenuQrEs: BlogPost = {
  slug: 'restaurant-menu-qr-codes',
  title: 'Códigos QR para menús de restaurante: configuración, diseño y mejores prácticas (2026)',
  description:
    'Cómo sustituir menús en papel por códigos QR dinámicos — consejos de ubicación, tamaños, diseño higiénico y actualización de platos sin volver a imprimir.',
  keywords: ['QR menú restaurante', 'menú digital QR', 'código QR menú', 'QR hostelería', 'QR triángulo de mesa'],
  publishedAt: '2026-06-10',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Hostelería',
  sections: [
    {
      type: 'p',
      content:
        'Los menús en papel son caros de reimprimir y lentos de actualizar cuando cambian precios o alérgenos. Un código QR de menú dinámico en cada mesa permite a los comensales escanear una vez y ver siempre tu PDF o menú web más reciente — mientras tú monitorizas qué ubicaciones generan más escaneos.',
    },
    {
      type: 'h2',
      content: '¿Por qué usar QR de menú dinámicos (y no estáticos)?',
    },
    {
      type: 'ul',
      items: [
        'Cambia la URL del menú o el PDF tras imprimir — sin nuevos adhesivos.',
        'Consulta recuentos de escaneos por mesa, franja horaria o campaña.',
        'Añade una landing page con tu marca antes de que se abra el menú.',
        'Enruta menús de comida o cena con reglas de horario.',
      ],
    },
    {
      type: 'h2',
      content: 'Ubicación y tamaño',
    },
    {
      type: 'p',
      content:
        'Coloca los códigos a la altura de los ojos en triángulos de mesa, portamenús o vinilos de escaparate. El tamaño mínimo de impresión es aproximadamente 2×2 cm (0,8 pulg.) con margen de zona tranquila. Usa alto contraste (código oscuro sobre fondo claro) y prueba escaneos desde 30–50 cm bajo la iluminación de tu restaurante.',
    },
    {
      type: 'h2',
      content: 'Contenido que convierte',
    },
    {
      type: 'p',
      content:
        'Abre con un titular breve en tu landing page («Menú de esta noche») y un solo botón claro. Mantén el menú final mobile-first: zonas táctiles amplias, iconos de alérgenos e imágenes de carga rápida. Actualiza platos de temporada desde tu panel QRbanner en segundos.',
    },
    {
      type: 'faq',
      faq: [
        {
          question: '¿Puedo usar un solo QR para todas las mesas?',
          answer:
            'Sí. Un código dinámico funciona en todas partes. Usa códigos separados por ubicación solo si quieres analítica granular por sala o terraza.',
        },
        {
          question: '¿Qué pasa si el Wi‑Fi es débil?',
          answer:
            'Aloja los menús en una CDN rápida o una página HTML ligera. Ofrece un PDF descargable como alternativa en el mismo destino del QR.',
        },
      ],
    },
  ],
};
