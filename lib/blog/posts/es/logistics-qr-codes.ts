import type { BlogPost } from '../../types';

export const logisticsQrCodesEs: BlogPost = {
  slug: 'logistics-warehouse-qr-codes',
  title: 'Códigos QR para logística y almacén: tracking, pick lists y seguridad',
  description:
    'Almacenes y equipos de logística usan QR dinámico para pick lists, horarios de muelle, checklists de seguridad y tracking de activos — actualizan enlaces SOP sin reetiquetar.',
  keywords: ['código QR almacén', 'QR logística', 'QR pick list', 'código QR muelle', 'QR cadena de suministro'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Logística',
  sections: [
    {
      type: 'p',
      content:
        'Los centros de distribución reetiquetan ubicaciones y puertas de muelle cuando cambian las SOP o los portales de transportistas. El QR dinámico en marcadores de pasillo y etiquetas de palé mantiene al personal de planta en la URL de checklist más reciente.',
    },
    {
      type: 'h2',
      content: 'Casos de uso en planta',
    },
    {
      type: 'ul',
      items: [
        'Horarios de puerta de muelle y enlaces de recogida de transportista',
        'PDF de checklist de seguridad en estaciones de equipos',
        'Mapas de pick-path para layouts estacionales de SKU',
        'QR de portal de devoluciones en estaciones de packing',
      ],
    },
    {
      type: 'h2',
      content: 'Consejos de operaciones',
    },
    {
      type: 'p',
      content:
        'Protege con contraseña los códigos SOP internos. Usa etiquetas por lote y turno para comparar tasas de escaneo. Conecta webhooks con tu WMS cuando un escaneo dispare una actualización de estado.',
    },
  ],
};
