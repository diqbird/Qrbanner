import type { BlogPost } from '../../types';

export const veterinaryClinicQrEs: BlogPost = {
  slug: 'veterinary-clinic-qr',
  title: 'QR para clínica veterinaria: admisión, citas y cuidados posteriores',
  description:
    'Cómo las clínicas veterinarias usan QR dinámico para formularios de admisión, reserva online y recordatorios de vacunas sin reimprimir señalética del lobby.',
  keywords: ['código QR veterinaria', 'QR clínica vet', 'QR admisión mascotas', 'QR hospital animal', 'marketing veterinario'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Salud',
  sections: [
    {
      type: 'p',
      content:
        'Las clínicas veterinarias colocan QR en recepción, tarjetas de kennel y recordatorios de cita. Los dueños completan la admisión en el móvil antes de la visita y acceden a guías de cuidados posteriores tras los procedimientos.',
    },
    {
      type: 'h2',
      content: 'Ubicaciones habituales',
    },
    {
      type: 'ul',
      items: [
        'Mostrador del lobby y señalética en sala de consulta',
        'Postales de recordatorio de vacunación',
        'Planes de wellness y promos antipulgas/garrapatas',
        'Instrucciones de urgencias fuera de horario',
      ],
    },
    {
      type: 'h2',
      content: 'Mide lo que funciona',
    },
    {
      type: 'p',
      content:
        'Compara picos de escaneo tras mailings de recordatorio frente a señalética del lobby. Exporta CSV para revisiones del gerente de clínica y planificación de campañas de temporada.',
    },
  ],
};
