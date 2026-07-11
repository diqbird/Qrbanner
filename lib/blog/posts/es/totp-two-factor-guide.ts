import type { BlogPost } from '../../types';

export const totpTwoFactorGuideEs: BlogPost = {
  slug: 'qr-account-two-factor-authentication',
  title: 'Protege tu cuenta de QRbanner con autenticación en dos factores',
  description:
    'Activa apps autenticadoras TOTP en QRbanner para proteger dashboards, claves API y facturación — guía práctica de configuración para equipos.',
  keywords: ['autenticación en dos factores', 'código QR TOTP', 'seguridad QRbanner', 'app autenticadora'],
  publishedAt: '2026-07-01',
  updatedAt: '2026-07-01',
  readingMinutes: 5,
  author: 'QRbanner Team',
  category: 'Seguridad',
  sections: [
    {
      type: 'p',
      content:
        'Los códigos QR a menudo controlan el acceso a menús, pagos y documentos internos. La cuenta que gestiona esos códigos debe estar al menos tan protegida como tu correo. QRbanner admite autenticación en dos factores TOTP en todos los planes.',
    },
    {
      type: 'h2',
      content: '¿Por qué activar 2FA para la gestión de QR?',
    },
    {
      type: 'ul',
      items: [
        'Evita el secuestro de la cuenta si la contraseña se reutiliza o se phishea.',
        'Protege claves API, webhooks y ajustes de facturación.',
        'Se combina con SSO/SAML del workspace Business para equipos grandes.',
      ],
    },
    {
      type: 'h2',
      content: 'Configuración en menos de dos minutos',
    },
    {
      type: 'ul',
      items: [
        'Abre Dashboard → Settings → Two-factor authentication.',
        'Escanea el código QR con Google Authenticator, 1Password o Authy.',
        'Introduce el código de 6 dígitos para confirmar y guarda los códigos de respaldo en un lugar seguro.',
      ],
    },
    {
      type: 'h2',
      content: 'Consejos para el despliegue en el equipo',
    },
    {
      type: 'p',
      content:
        'Exige primero a admins y propietarios del workspace que activen 2FA. Combínalo con SAML en planes Business para que los empleados inicien sesión con Okta o Azure AD y sigan usando apps autenticadoras en acciones sensibles.',
    },
  ],
};
