import type { BlogPost } from '../../types';

export const manufacturingQrCodesEs: BlogPost = {
  slug: 'manufacturing-qr-codes',
  title: 'Códigos QR en fabricación: instrucciones de trabajo, activos y controles de calidad',
  description:
    'Las fábricas usan QR dinámico en máquinas, órdenes de trabajo y estaciones de calidad — actualizan PDF de SOP y formularios de inspección sin reetiquetar equipos.',
  keywords: ['código QR fabricación', 'QR fábrica', 'QR instrucción de trabajo', 'QR etiqueta de activo', 'QR control de calidad'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Fabricación',
  sections: [
    {
      type: 'p',
      content:
        'Las plantas actualizan las SOP con frecuencia, pero las etiquetas de máquina duran años. El QR dinámico en etiquetas de equipos y paneles de estación mantiene a los técnicos en la URL de instrucción de trabajo más reciente.',
    },
    {
      type: 'h2',
      content: 'Ubicaciones en el taller',
    },
    {
      type: 'ul',
      items: [
        'Enlaces SOP en estaciones CNC y de ensamblaje',
        'Checklists de mantenimiento preventivo',
        'Portales de pedido de recambios',
        'Fichas de datos de seguridad (SDS) por zona química',
      ],
    },
    {
      type: 'h2',
      content: 'Gobernanza',
    },
    {
      type: 'p',
      content:
        'Protege con contraseña los códigos internos. Registra fechas de revisión en las landing pages. Usa etiquetas por lote y línea de producción para comparar la adopción de escaneos tras formaciones.',
    },
  ],
};
