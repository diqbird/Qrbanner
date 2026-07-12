import type { SolutionPage } from '@/lib/solutions';
import { SOLUTION_PLATFORM_FEATURES_ES } from './solution-sector-es';

/** Hand-curated Spanish copy for high-traffic solution pages. */
export const SOLUTION_COPY_ES: Record<string, Partial<SolutionPage>> = {
  'restaurant-menu': {
    title: 'Código QR de menú de restaurante',
    headline: 'Menús digitales que se escanean en la mesa',
    description:
      'Sustituya los menús en papel por un código QR dinámico. Actualice precios, alérgenos y especiales sin reimprimir.',
    metaDescription:
      'Cree un código QR de menú para mesas y barras. Actualice el menú online y rastree escaneos. Generador gratis con analítica.',
    keywords: ['QR menú restaurante', 'menú digital QR', 'QR menú mesa', 'QR menú café'],
    benefits: [
      'Actualice precios y especiales al instante',
      'Rastree aperturas de menú por ubicación y hora',
      'Funciona en cualquier teléfono — sin app',
      'Enrutado almuerzo/cena para menús distintos',
    ],
    features: [
      'Landing con PDF de menú o URL web',
      'Protección por contraseña para menús de personal',
      'GA4 y Meta Pixel en el escaneo',
      ...SOLUTION_PLATFORM_FEATURES_ES,
    ],
    steps: [
      { title: 'Elija la plantilla de restaurante', description: 'Campos para URL del menú, nombre del local y notas Wi‑Fi.' },
      { title: 'Añada el enlace del menú', description: 'Conecte su web, PDF o plataforma de menús.' },
      { title: 'Imprima displays de mesa', description: 'Descargue PNG o banner listo para imprimir y colóquelos.' },
    ],
    faq: [
      {
        q: '¿Puedo usar el mismo QR en cada mesa?',
        a: 'Sí. Un código dinámico funciona en todas partes. Para analítica detallada use códigos por zona.',
      },
      {
        q: '¿Y si el menú cambia a diario?',
        a: 'Actualice la URL o el PDF en el panel; el patrón QR impreso no cambia.',
      },
    ],
  },
  'business-card': {
    title: 'Código QR de tarjeta de visita digital',
    headline: 'Un escaneo guarda el contacto en el teléfono',
    description:
      'Convierta su tarjeta en un QR escaneable. Nombre, teléfono, correo y web se guardan con un toque.',
    metaDescription:
      'Cree códigos QR de tarjeta de visita digital. Compártalos en tarjetas, credenciales y firmas; rastree escaneos.',
    keywords: ['QR tarjeta de visita', 'generador vCard QR', 'tarjeta digital QR'],
    benefits: [
      'Sin teclear — el contacto se guarda en el teléfono',
      'Actualice datos sin reimprimir',
      'Vea con qué frecuencia se escanea la tarjeta',
      'QR de tarjetas en lote para equipos',
    ],
    features: [
      'Guardado de contacto en formato vCard',
      'Personalización con logo y colores de marca',
      'Analítica de escaneos y webhooks',
      ...SOLUTION_PLATFORM_FEATURES_ES,
    ],
    steps: [
      { title: 'Abra la plantilla de tarjeta', description: 'Complete nombre, cargo, teléfono y correo.' },
      { title: 'Elija el estilo', description: 'Adapte color, logo y marco a su marca.' },
      { title: 'Imprima en tarjetas y credenciales', description: 'Descargue PNG o exporte banner de impresión.' },
    ],
    faq: [
      {
        q: '¿Funciona en iPhone y Android?',
        a: 'Sí. Los QR vCard abren el guardado de contactos en ambas plataformas.',
      },
      {
        q: '¿Debo reimprimir si cambio de trabajo?',
        a: 'No. Actualice los datos en el panel; el mismo QR sigue vigente.',
      },
    ],
  },
};
