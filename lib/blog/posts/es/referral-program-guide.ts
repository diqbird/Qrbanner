import type { BlogPost } from '../../types';

export const referralProgramGuideEs: BlogPost = {
  slug: 'qrbanner-referral-program-guide',
  title: 'Programa de referidos de QRbanner: comparte enlaces, sigue altas y reclama recompensas',
  description:
    'Cómo funciona el programa de referidos de QRbanner — enlaces personales, altas por OAuth y email con ?ref=, hitos de recompensas y crédito de prueba Pro a los 5 referidos.',
  keywords: ['referidos QRbanner', 'programa de referidos QR', 'enlace referidos SaaS', 'afiliado QR dinámico'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 5,
  author: 'QRbanner Team',
  category: 'Producto',
  sections: [
    {
      type: 'p',
      content:
        'Cada cuenta de QRbanner incluye un enlace personal de referidos en Ajustes → Programa de referidos. Compártelo con colegas, clientes o tu audiencia — las altas que usen ?ref=YOURCODE cuentan en tus estadísticas.',
    },
    {
      type: 'h2',
      content: 'Altas por email y OAuth',
    },
    {
      type: 'ul',
      items: [
        'Alta por email: añade ?ref=CODE a /signup — el código se guarda en el registro.',
        'Google, GitHub o Microsoft: el mismo enlace ?ref= establece una cookie de corta duración para que las altas OAuth también te acrediten.',
        'Los referidos son de una sola vez por cuenta nueva — las altas duplicadas no inflan el contador.',
      ],
    },
    {
      type: 'h2',
      content: 'Hitos y crédito de prueba Pro',
    },
    {
      type: 'p',
      content:
        'Sigue el progreso en 1, 3, 5 y 10 altas verificadas. Con cinco referidos puedes reclamar un upgrade gratuito al plan Pro. Los partners de Agency con diez altas pueden optar a una revisión de partner.',
    },
    {
      type: 'h2',
      content: 'Consejos para agencias',
    },
    {
      type: 'p',
      content:
        'Combina tu enlace de referidos con casos de éxito y la calculadora de ROI al presentar a clientes. Las landing pages white-label en los planes Business y Agency hacen las entregas profesionales mientras los referidos aumentan los beneficios de tu cuenta.',
    },
  ],
};
