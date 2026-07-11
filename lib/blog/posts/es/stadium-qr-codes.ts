import type { BlogPost } from '../../types';

export const stadiumQrCodesEs: BlogPost = {
  slug: 'stadium-event-qr-codes',
  title: 'Códigos QR para estadios y eventos: concesiones, programas y engagement de aficionados',
  description:
    'Usa QR dinámico en estadios y festivales para pedidos móviles, programas digitales, parking y ofertas de sponsors — cambia el contenido entre jornadas.',
  keywords: ['código QR estadio', 'QR evento', 'QR venue deportivo', 'código QR festival', 'QR menú concesiones'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Eventos',
  sections: [
    {
      type: 'p',
      content:
        'Los venues compaginan rivales, sponsors y menús de concesiones distintos en cada evento. Los pegatinas QR estáticos quedan obsoletos tras un partido. Los códigos dinámicos en respaldos de asiento, pilares del concourse y señales de parking mantienen a los aficionados en el enlace correcto toda la temporada.',
    },
    {
      type: 'h2',
      content: 'Casos de uso el día del partido',
    },
    {
      type: 'ul',
      items: [
        'Menús móviles de concesiones con enlaces de pedido por sección',
        'Programas digitales del evento en lugar de libretos impresos',
        'Mapas de zonas de parking que se actualizan cuando hay lotes agotados',
        'Landing pages de sponsors con ofertas de duración limitada',
        'Encuestas post-partido y altas en newsletter',
      ],
    },
    {
      type: 'h2',
      content: 'Operaciones a escala',
    },
    {
      type: 'p',
      content:
        'Crea códigos en masa por sección (101–120, 201–220) mediante importación CSV. Usa lotes de campaña para activar cambios de sponsors al pitido inicial. Compara el volumen de escaneos por nivel de concourse para optimizar personal y señalética.',
    },
  ],
};
