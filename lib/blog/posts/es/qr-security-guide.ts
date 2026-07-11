import type { BlogPost } from '../../types';

export const qrSecurityGuideEs: BlogPost = {
  slug: 'qr-code-security-best-practices',
  title: 'Seguridad de códigos QR: protege tu marca y a tus usuarios',
  description:
    'El phishing por QR es real. Aprende a proteger campañas de QR dinámicos con contraseña, confianza de dominio, monitorización de enlaces y formación del equipo.',
  keywords: ['seguridad códigos QR', 'phishing QR', 'códigos QR seguros', 'seguridad QR dinámico', 'fraude QR'],
  publishedAt: '2026-06-18',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Seguridad',
  sections: [
    {
      type: 'p',
      content:
        'Los atacantes pueden pegar adhesivos QR maliciosos encima de los legítimos. Las empresas deben diseñar campañas difíciles de manipular y fáciles de confiar para el cliente.',
    },
    {
      type: 'h2',
      content: 'Usa redirecciones dinámicas bajo tu control',
    },
    {
      type: 'p',
      content:
        'Los enlaces cortos en tu propio dominio (o la redirección verificada de QRbanner) te permiten cambiar el destino si se compromete la URL de un partner. Los códigos estáticos impresos con URLs crudas no se pueden revocar sin reimprimir.',
    },
    {
      type: 'h2',
      content: 'Refuerza los flujos de alto riesgo',
    },
    {
      type: 'ul',
      items: [
        'Protege con contraseña códigos para documentos internos u ofertas VIP.',
        'Define fechas de caducidad y límites de escaneo en entradas de eventos.',
        'Usa dominios de escaneo personalizados que coincidan con tu marca (scan.tumarca.com).',
        'Monitoriza picos repentinos de escaneos — pueden indicar fraude por adhesivos.',
      ],
    },
    {
      type: 'h2',
      content: 'Protege las cuentas del equipo',
    },
    {
      type: 'ul',
      items: [
        'Activa la autenticación en dos factores TOTP en Ajustes para cada usuario admin.',
        'Los workspaces Business pueden forzar SSO y configurar SAML con dominios de email permitidos.',
        'Revisa los logs de entrega de webhooks si los datos de escaneo salen de QRbanner hacia sistemas externos.',
      ],
    },
    {
      type: 'h2',
      content: 'Educación al cliente',
    },
    {
      type: 'p',
      content:
        'Forma al personal para revisar a diario si hay adhesivos superpuestos. Muestra tu logo junto a los códigos impresos. En las landings, enseña los colores de marca y el candado HTTPS antes de pedir datos personales.',
    },
  ],
};
