import type { BlogPost } from '../../types';

export const bulkQrGuideEs: BlogPost = {
  slug: 'bulk-qr-codes-csv-import',
  title: 'Códigos QR masivos: importación CSV para despliegues multi-ubicación',
  description:
    'Crea cientos de códigos QR dinámicos desde una hoja de cálculo — ideal para cadenas retail, eventos y packaging de producto. Formato CSV, nomenclatura y checklist de QA.',
  keywords: ['códigos QR masivos', 'importación CSV QR', 'generador QR masivo', 'despliegue QR retail', 'lote QR'],
  publishedAt: '2026-06-22',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Operaciones',
  sections: [
    {
      type: 'p',
      content:
        'Lanzar QR en docenas de tiendas o SKUs a mano es lento y propenso a errores. La importación masiva de QRbanner lee un CSV, crea códigos dinámicos en un solo lote y asigna un ID de batch compartido para filtrarlos después como campaña.',
    },
    {
      type: 'h2',
      content: 'Columnas del CSV',
    },
    {
      type: 'ul',
      items: [
        'name — etiqueta que verás en el panel (p. ej. «Tienda 042 – Entrada»).',
        'category — url, menu, vcard, wifi, etc.',
        'content — URL de destino o payload según la categoría.',
        'Opcional: carpeta, etiquetas y UTM por fila.',
      ],
    },
    {
      type: 'h2',
      content: 'Checklist previa al import',
    },
    {
      type: 'ul',
      items: [
        'Valida que las URLs respondan HTTP 200 antes de importar.',
        'Usa una nomenclatura coherente para el reporting.',
        'Exporta el CSV de resultados con short codes para tu impresor.',
        'Tras el import, prueba 5 códigos al azar en iOS y Android.',
      ],
    },
    {
      type: 'h2',
      content: 'Después del import',
    },
    {
      type: 'p',
      content:
        'Abre el filtro de campaña del panel para ver el lote completo. Aplica una plantilla de estilo compartida para exportaciones PNG/SVG listas para imprimir. Los límites del plan limitan filas — actualiza el plan antes de despliegues grandes.',
    },
  ],
};
