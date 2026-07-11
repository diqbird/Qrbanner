import type { BlogPost } from '../../types';

export const governmentQrCodesEs: BlogPost = {
  slug: 'government-public-service-qr-codes',
  title: 'Códigos QR para gobierno y servicios públicos: acceso seguro para la ciudadanía',
  description:
    'Cómo municipios y agencias públicas usan QR para formularios, directorios de servicios e información multilingüe — con buenas prácticas de accesibilidad y seguridad.',
  keywords: ['código QR gobierno', 'QR servicios públicos', 'QR municipal', 'QR servicios ciudadanos', 'QR digital administración'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Administración pública',
  sections: [
    {
      type: 'p',
      content:
        'La ciudadanía espera tramitar permisos, pagar tasas y consultar horarios de servicio desde el móvil. Los códigos QR en carteles, autobuses y ayuntamientos conectan la señalética offline con contenido web siempre actualizado — sin reimprimir cuando cambian teléfonos o URLs.',
    },
    {
      type: 'h2',
      content: 'Casos de uso habituales',
    },
    {
      type: 'ul',
      items: [
        'Directorio de servicios: horarios, ubicaciones y reserva de citas',
        'Enrutado multilingüe por país o preferencia de idioma',
        'Calendarios de eventos para plenos y programas comunitarios',
        'Encuestas de feedback y satisfacción tras visitas presenciales',
      ],
    },
    {
      type: 'h2',
      content: 'Seguridad y confianza',
    },
    {
      type: 'p',
      content:
        'Usa dominios personalizados oficiales (estilo scan.cityname.gov mediante DNS verificado), destinos solo HTTPS y branding claro en las landing pages. Evita acortadores de URL que la ciudadanía no pueda verificar. La protección por contraseña y la caducidad de QRbanner ayudan a limitar abusos en campañas temporales.',
    },
  ],
};
