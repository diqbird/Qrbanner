import type { BlogPost } from '../../types';

export const foodTrucksQrEs: BlogPost = {
  slug: 'food-trucks-qr',
  title: 'QR para food trucks: menús diarios, ubicaciones y pedidos anticipados en festivales',
  description:
    'Cómo los operadores de food trucks usan QR dinámicos en carteles de ventanilla y carpas de festival para menús del día, horarios de ubicación y pedidos anticipados desde el móvil.',
  keywords: ['código QR food truck', 'QR comida móvil', 'QR menú food truck', 'QR comida festival', 'marketing food truck'],
  publishedAt: '2026-06-30',
  updatedAt: '2026-06-30',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Alimentación y bebidas',
  sections: [
    {
      type: 'p',
      content:
        'Los food trucks imprimen el QR una sola vez en carteles de ventanilla, banners de carpa de festival y tarjetas de visita. Los clientes ven el menú de hoy, encuentran la ubicación actual del camión y hacen pedidos anticipados sin señalética de ventanilla desactualizada.',
    },
    {
      type: 'h2',
      content: 'Puntos de contacto en ventanilla y festival',
    },
    {
      type: 'ul',
      items: [
        'Carteles de menú diario en la ventanilla de servicio',
        'Páginas de ubicación en vivo y horarios',
        'Formularios de pedido anticipado en festivales',
        'Alta en fidelización en tarjetas de visita',
      ],
    },
    {
      type: 'h2',
      content: 'Operadores con varios camiones',
    },
    {
      type: 'p',
      content:
        'Actualiza las URLs de menú y ubicación cada mañana desde un solo panel. Las carpetas por camión muestran qué festivales generan más escaneos de pedidos anticipados.',
    },
  ],
};
