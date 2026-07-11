/** Spanish wizard/dashboard copy for QR category groups and types (keys match lib/qr-utils ids). */
export const qrCategoryCopyEs = {
  groups: {
    basic: { label: 'Día a día', subtitle: 'Enlaces, contactos, Wi‑Fi y más' },
    social: { label: 'Social y chat', subtitle: 'Gana seguidores e inicia conversaciones' },
    meetings: { label: 'Videollamadas', subtitle: 'Únete a la reunión con un escaneo' },
    files: { label: 'Menús y archivos', subtitle: 'Menús, PDF, apps y pagos' },
    payments: { label: 'Pagos y reseñas', subtitle: 'PayPal, UPI, propinas y reseñas de Google' },
    products: { label: 'Productos y retail', subtitle: 'Códigos GS1 y pasaportes digitales' },
  },
  types: {
    url: {
      name: 'Enlace web',
      shortName: 'Web',
      description: 'Lleva a la página que quieras — cambia el enlace sin reimprimir',
    },
    text: {
      name: 'Texto plano',
      shortName: 'Texto',
      description: 'Muestra un mensaje, código o nota al escanear',
    },
    vcard: {
      name: 'Tarjeta de visita digital',
      shortName: 'Contacto',
      description: 'Nombre, teléfono y email se guardan con un escaneo',
    },
    wifi: {
      name: 'Acceso Wi‑Fi',
      shortName: 'Wi‑Fi',
      description: 'Invitados se conectan sin escribir la contraseña',
    },
    email: {
      name: 'Correo electrónico',
      shortName: 'Email',
      description: 'Abre la app de correo con tu dirección y mensaje',
    },
    sms: {
      name: 'SMS',
      shortName: 'SMS',
      description: 'SMS a tu número con texto predefinido',
    },
    phone: {
      name: 'Llamada telefónica',
      shortName: 'Teléfono',
      description: 'Toca para llamar — ideal para soporte y ventas',
    },
    location: {
      name: 'Ubicación en mapa',
      shortName: 'Ubicación',
      description: 'Abre indicaciones a tienda, oficina o evento',
    },
    event: {
      name: 'Evento de calendario',
      shortName: 'Evento',
      description: 'Añade el evento al calendario con un escaneo',
    },
    whatsapp: {
      name: 'Chat de WhatsApp',
      shortName: 'WhatsApp',
      description: 'Inicia conversación — mensaje opcional predefinido',
    },
    telegram: {
      name: 'Telegram',
      shortName: 'Telegram',
      description: 'Abre canal o chat directo de Telegram',
    },
    discord: {
      name: 'Servidor de Discord',
      shortName: 'Discord',
      description: 'Únete a la comunidad con enlace de invitación',
    },
    instagram: {
      name: 'Perfil de Instagram',
      shortName: 'Instagram',
      description: 'Gana seguidores desde packaging, cartelería y tienda',
    },
    facebook: {
      name: 'Página de Facebook',
      shortName: 'Facebook',
      description: 'Redirige a tu página o perfil de Facebook',
    },
    tiktok: {
      name: 'Perfil de TikTok',
      shortName: 'TikTok',
      description: 'Convierte tráfico offline en seguidores de TikTok',
    },
    linkedin: {
      name: 'Perfil de LinkedIn',
      shortName: 'LinkedIn',
      description: 'Networking profesional desde tarjeta y badge',
    },
    youtube: {
      name: 'Canal de YouTube',
      shortName: 'YouTube',
      description: 'Abre tu canal o un vídeo concreto',
    },
    spotify: {
      name: 'Spotify',
      shortName: 'Spotify',
      description: 'Comparte canción, álbum o playlist',
    },
    social: {
      name: 'Otro enlace social',
      shortName: 'Social',
      description: 'Cualquier perfil social o URL de link hub',
    },
    link_hub: {
      name: 'Link Hub',
      shortName: 'Link Hub',
      description: 'Un QR — varios botones estilo Linktree',
    },
    zoom: {
      name: 'Reunión Zoom',
      shortName: 'Zoom',
      description: 'Del cartel, slide o email a la reunión Zoom',
    },
    google_meet: {
      name: 'Google Meet',
      shortName: 'Meet',
      description: 'Abre tu sala de Google Meet con un escaneo',
    },
    menu: {
      name: 'Menú de restaurante',
      shortName: 'Menú',
      description: 'Menú digital en mesa — actualiza precios sin reimprimir',
    },
    pdf: {
      name: 'Documento PDF',
      shortName: 'PDF',
      description: 'Comparte folleto, menú, CV o catálogo en PDF',
    },
    file: {
      name: 'Descarga de archivo',
      shortName: 'Archivo',
      description: 'Enlace a un archivo descargable',
    },
    app: {
      name: 'Descarga de app',
      shortName: 'App',
      description: 'Lleva a iOS y Android a la tienda correcta',
    },
    crypto: {
      name: 'Pago cripto',
      shortName: 'Cripto',
      description: 'Wallet Bitcoin o Ethereum — sin errores al copiar',
    },
    google_review: {
      name: 'Reseña de Google',
      shortName: 'Reseña',
      description: 'Clientes satisfechos van directo a tu página de reseñas',
    },
    paypal: {
      name: 'Pago PayPal',
      shortName: 'PayPal',
      description: 'Propinas y pagos con tu enlace PayPal.me',
    },
    upi: {
      name: 'Pago UPI (India)',
      shortName: 'UPI',
      description: 'Pago bancario instantáneo por UPI — escanea y paga',
    },
    signal: {
      name: 'Signal Messenger',
      shortName: 'Signal',
      description: 'Chat privado de Signal desde cartel o tarjeta',
    },
    apple_music: {
      name: 'Apple Music',
      shortName: 'Apple Music',
      description: 'Comparte canción, álbum o artista de Apple Music',
    },
    google_drive: {
      name: 'Google Drive',
      shortName: 'Drive',
      description: 'Comparte archivo o carpeta de Drive con un escaneo',
    },
    dropbox: {
      name: 'Enlace Dropbox',
      shortName: 'Dropbox',
      description: 'Abre o descarga enlace compartido de Dropbox',
    },
    gs1: {
      name: 'GS1 Digital Link',
      shortName: 'GS1',
      description: 'QR de producto con GTIN, lote y caducidad — pasaporte digital UE',
    },
  },
} as const;
