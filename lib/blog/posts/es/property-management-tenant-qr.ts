import type { BlogPost } from '../../types';

export const propertyManagementTenantQrEs: BlogPost = {
  slug: 'property-management-tenant-qr',
  title: 'QR para gestión inmobiliaria: portales de inquilinos, mantenimiento y contratos',
  description:
    'Cómo los gestores inmobiliarios usan QR dinámico en señalética del lobby y mailings de unidad para portales de inquilinos, solicitudes de mantenimiento y PDFs de contrato sin reimprimir.',
  keywords: ['QR gestión inmobiliaria', 'QR portal inquilinos', 'código QR apartamento', 'QR solicitud mantenimiento', 'QR documento arrendamiento'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Inmobiliaria',
  sections: [
    {
      type: 'p',
      content:
        'Los gestores inmobiliarios imprimen el QR una sola vez en pósters del lobby, señales de ascensor y packs de bienvenida. Los enlaces dinámicos mantienen portales de inquilinos, formularios de mantenimiento y guías de amenidades al día cuando cambian políticas o proveedores.',
    },
    {
      type: 'h2',
      content: 'Dónde colocar códigos QR',
    },
    {
      type: 'ul',
      items: [
        'Mostrador del lobby y señalética en rellanos de ascensor',
        'Packs de bienvenida de mudanza y mailings de unidad',
        'Normas de salas de amenidades y permisos de aparcamiento',
        'Instrucciones del cuarto de mantenimiento para el personal',
      ],
    },
    {
      type: 'h2',
      content: 'Analíticas por edificio',
    },
    {
      type: 'p',
      content:
        'Crea códigos por propiedad y agrupa carteras en carpetas. Compara picos de escaneo tras emails de política frente a señalética del lobby. Exporta CSV para reporting a propietarios.',
    },
  ],
};
