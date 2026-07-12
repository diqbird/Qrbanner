import type { QrTypePage } from '@/lib/qr-type-pages';

/**
 * Spanish (es) copy overrides for QR type pages.
 * Keyed by the category slug defined in QR_CATEGORIES (lib/qr-utils.ts).
 */
export const QR_TYPE_COPY_ES: Record<string, Partial<QrTypePage>> = {
  url: {
    title: 'Código QR de enlace web',
    headline: 'Crea un código QR de sitio web — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR que enlazan a tu web. Diseño con marca, analítica de escaneos y enlaces que puedes actualizar sin reimprimir.',
    description:
      'Dirige a las personas a cualquier página y cambia el enlace cuando quieras sin reimprimir.',
    benefits: [
      'Actualiza el enlace cuando quieras, sin reimprimir el código',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
      'Ve con analítica cuántas personas escanean, desde dónde y cuándo',
    ],
    useCases: ['Envases de producto', 'Carteles y folletos', 'Firmas de correo'],
  },
  text: {
    title: 'Código QR de texto plano',
    headline: 'Crea un código QR de texto — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de texto que muestra un mensaje, código o nota al escanear. Diseño con marca y salidas listas para imprimir.',
    description:
      'Muestra un mensaje, código o nota cuando alguien escanea el código.',
    benefits: [
      'Texto plano legible al instante, sin necesidad de app',
      'Comparte instrucciones, códigos de cupón o avisos breves',
      'Diseño personalizable con colores, logo y marco',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Etiquetas de producto', 'Paneles informativos', 'Tarjetas promocionales'],
  },
  vcard: {
    title: 'Código QR de tarjeta de visita digital',
    headline: 'Crea un código QR de tarjeta de visita digital — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de tarjeta de visita que guarda nombre, teléfono y email con un escaneo. Con marca y listo para imprimir.',
    description:
      'Un solo escaneo guarda tu nombre, teléfono y email en el teléfono de la otra persona.',
    benefits: [
      'Todos tus datos de contacto se añaden a la agenda con un escaneo',
      'Adiós a las tarjetas de papel: siempre actualizado',
      'Aspecto profesional con colores, logo y marco',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Tarjetas de visita', 'Credenciales de conferencia', 'Pies de correo'],
  },
  wifi: {
    title: 'Código QR de acceso Wi‑Fi',
    headline: 'Crea un código QR de Wi‑Fi — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR Wi‑Fi para que tus invitados se conecten al instante sin escribir la contraseña. Con marca y listo para imprimir.',
    description:
      'Tus invitados se conectan a tu red al instante sin escribir la contraseña.',
    benefits: [
      'Los invitados se conectan con un escaneo sin escribir la contraseña',
      'El nombre de la red y la contraseña quedan guardados de forma segura en el código',
      'Diseño con colores, logo y marco acorde a tu espacio',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Lobbies de hotel', 'Cafés y coworking', 'Tarjetas de bienvenida de alojamiento'],
  },
  email: {
    title: 'Código QR de correo electrónico',
    headline: 'Crea un código QR de correo — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de email que abre la app de correo con tu dirección y mensaje listos. Con marca y listo para imprimir.',
    description:
      'Abre la app de correo de la otra persona con tu dirección y mensaje preparados.',
    benefits: [
      'Destinatario, asunto y mensaje se rellenan automáticamente',
      'Facilita el feedback y las solicitudes de contacto',
      'Diseño personalizable con colores, logo y marco',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Folletos de soporte', 'Tarjetas de contacto', 'Stands de feria'],
  },
  sms: {
    title: 'Código QR de SMS',
    headline: 'Crea un código QR de SMS — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR SMS que envía un mensaje preparado a tu número. Diseño con marca y salidas listas para imprimir.',
    description:
      'Rellena de antemano un mensaje que se enviará a tu número de teléfono.',
    benefits: [
      'El número y el texto del mensaje llegan automáticamente preparados',
      'Agiliza la participación en campañas y procesos de confirmación',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Carteles de campaña', 'Participaciones en sorteos', 'Anuncios de códigos cortos'],
  },
  phone: {
    title: 'Código QR de llamada telefónica',
    headline: 'Crea un código QR de teléfono — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de teléfono que llama a tu número con un toque. Ideal para soporte y ventas; con marca y listo para imprimir.',
    description:
      'Al tocar, llama a tu número: ideal para soporte y ventas.',
    benefits: [
      'Se llama con un toque sin escribir el número a mano',
      'Facilita el acceso a líneas de soporte y ventas',
      'Diseño personalizable con colores, logo y marco',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Escaparates y carteles', 'Vehículos de servicio', 'Tarjetas de visita y folletos'],
  },
  location: {
    title: 'Código QR de ubicación en mapa',
    headline: 'Crea un código QR de ubicación — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de ubicación que abre la ruta a tu tienda, oficina o evento. Con marca y listo para imprimir.',
    description:
      'Abre la ruta a tu tienda, oficina o lugar del evento.',
    benefits: [
      'Los visitantes obtienen la ruta con un escaneo',
      'Llegan al lugar correcto sin tener que escribir la dirección',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Invitaciones', 'Señalización de eventos', 'Escaparates y carteles'],
  },
  event: {
    title: 'Código QR de evento de calendario',
    headline: 'Crea un código QR de evento — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de evento que añade tu cita al calendario con un escaneo. Diseño con marca y salidas listas para imprimir.',
    description:
      'Un solo escaneo añade tu evento al calendario de la otra persona.',
    benefits: [
      'Fecha, hora y ubicación se añaden automáticamente al calendario',
      'Reduce la probabilidad de que los asistentes olviden el evento',
      'Diseño personalizable con colores, logo y marco',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Invitaciones', 'Credenciales de conferencia', 'Programas de boda'],
  },
  whatsapp: {
    title: 'Código QR de chat de WhatsApp',
    headline: 'Crea un código QR de WhatsApp — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de WhatsApp que inicia un chat, con mensaje opcional predefinido. Con marca y listo para imprimir.',
    description:
      'Inicia un chat de WhatsApp; puedes añadir un mensaje predefinido opcional.',
    benefits: [
      'El chat empieza con un escaneo sin buscar el número',
      'Un mensaje opcional predefinido facilita el contacto',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Pegatinas de atención al cliente', 'Etiquetas de producto', 'Stands de feria'],
  },
  telegram: {
    title: 'Código QR de Telegram',
    headline: 'Crea un código QR de Telegram — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de Telegram que abre tu canal o chat. Diseño con marca y salidas listas para imprimir.',
    description:
      'Abre tu canal de Telegram o un chat directo.',
    benefits: [
      'Los seguidores se unen a tu canal con un escaneo',
      'Puedes actualizar el enlace cuando quieras',
      'Diseño personalizable con colores, logo y marco',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Carteles de comunidad', 'Anuncios de eventos', 'Publicaciones en redes sociales'],
  },
  discord: {
    title: 'Código QR de servidor de Discord',
    headline: 'Crea un código QR de Discord — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de Discord para unirse a tu comunidad con un enlace de invitación. Con marca y listo para imprimir.',
    description:
      'Permite unirse a tu comunidad mediante un enlace de invitación.',
    benefits: [
      'Los miembros se unen a tu servidor con un escaneo',
      'Puedes actualizar el enlace de invitación cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Carteles de comunidad gamer', 'Gráficos de pantalla de stream', 'Anuncios de eventos'],
  },
  instagram: {
    title: 'Código QR de perfil de Instagram',
    headline: 'Crea un código QR de Instagram — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de Instagram que gana seguidores desde packaging, carteles y pantallas en tienda. Con marca y listo para imprimir.',
    description:
      'Gana seguidores desde packaging, carteles y pantallas en tienda.',
    benefits: [
      'Convierte el tráfico offline en seguidores de Instagram',
      'Puedes actualizar el enlace del perfil cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Expositores retail', 'Insertos de packaging', 'Señalización en tienda'],
  },
  facebook: {
    title: 'Código QR de página de Facebook',
    headline: 'Crea un código QR de Facebook — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de Facebook que enlaza a tu página o perfil. Diseño con marca y salidas listas para imprimir.',
    description:
      'Enlaza a tu página o perfil de Facebook.',
    benefits: [
      'Los visitantes llegan a tu página con un escaneo',
      'Puedes actualizar el enlace cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Carteles de tienda', 'Folletos y flyers', 'Carteles de eventos'],
  },
  tiktok: {
    title: 'Código QR de perfil de TikTok',
    headline: 'Crea un código QR de TikTok — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de TikTok que convierte el tráfico offline en seguidores. Con marca y listo para imprimir.',
    description:
      'Convierte el tráfico offline en seguidores de TikTok.',
    benefits: [
      'Consigue seguidores de TikTok desde materiales físicos',
      'Puedes actualizar el enlace del perfil cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Expositores retail', 'Envases de producto', 'Stands de eventos'],
  },
  linkedin: {
    title: 'Código QR de perfil de LinkedIn',
    headline: 'Crea un código QR de LinkedIn — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de LinkedIn para networking profesional desde tarjetas, credenciales y folletos. Con marca y listo para imprimir.',
    description:
      'Haz networking profesional desde tarjetas de visita, credenciales y folletos.',
    benefits: [
      'Compartes el enlace de tu perfil con un escaneo',
      'Puedes actualizar el enlace cuando quieras',
      'Aspecto profesional con colores, logo y marco',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Tarjetas de visita', 'Credenciales de conferencia', 'Folletos corporativos'],
  },
  youtube: {
    title: 'Código QR de canal de YouTube',
    headline: 'Crea un código QR de YouTube — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de YouTube que dirige a los espectadores a tu canal o a un vídeo concreto. Con marca y listo para imprimir.',
    description:
      'Dirige a los espectadores a tu canal o a un vídeo concreto.',
    benefits: [
      'Los visitantes ven tu contenido con un escaneo',
      'Actualiza el enlace del canal o del vídeo cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Envases de producto', 'Carteles promocionales', 'Presentaciones y eventos'],
  },
  spotify: {
    title: 'Código QR de Spotify',
    headline: 'Crea un código QR de Spotify — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de Spotify para compartir una canción, álbum o playlist. Diseño con marca y salidas listas para imprimir.',
    description:
      'Comparte una canción, un álbum o una playlist.',
    benefits: [
      'Los oyentes acceden a tu música con un escaneo',
      'Puedes actualizar el enlace cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Carteles de conciertos', 'Diseños de álbum y merch', 'Publicaciones en redes sociales'],
  },
  social: {
    title: 'Código QR de enlace social',
    headline: 'Crea un código QR de redes sociales — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de redes sociales para cualquier perfil o página de enlaces. Con marca y listo para imprimir.',
    description:
      'Comparte la dirección de cualquier perfil social o página de enlaces.',
    benefits: [
      'Dirige con un escaneo a la plataforma social que quieras',
      'Puedes actualizar el enlace cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Campañas en redes sociales', 'Expositores retail', 'Materiales de eventos'],
  },
  link_hub: {
    title: 'Código QR de centro de enlaces',
    headline: 'Crea un código QR de centro de enlaces — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR tipo Linktree que agrupa varios botones en un solo QR. Con marca y listo para imprimir.',
    description:
      'Agrupa varios botones en un solo QR, como Linktree.',
    benefits: [
      'Reúnes todos tus enlaces bajo un solo QR',
      'Puedes actualizar botones y enlaces cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Enlaces de biografía', 'Programas de eventos', 'Menús de enlaces de restaurante'],
  },
  zoom: {
    title: 'Código QR de reunión de Zoom',
    headline: 'Crea un código QR de Zoom — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de Zoom para unirse a tu llamada desde un cartel, presentación o email. Con marca y listo para imprimir.',
    description:
      'Permite unirse a tu llamada de Zoom desde un cartel, presentación o email.',
    benefits: [
      'Los participantes se unen con un escaneo sin escribir el ID de la reunión',
      'Puedes actualizar el enlace de la reunión cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Diapositivas de presentación', 'Carteles de eventos', 'Invitaciones por email'],
  },
  google_meet: {
    title: 'Código QR de Google Meet',
    headline: 'Crea un código QR de Google Meet — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de Google Meet que abre tu sala con un escaneo. Diseño con marca y salidas listas para imprimir.',
    description:
      'Un solo escaneo abre tu sala de Google Meet.',
    benefits: [
      'Los participantes entran a tu sala de reunión con un escaneo',
      'Puedes actualizar el enlace de la reunión cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Diapositivas de presentación', 'Carteles de eventos', 'Invitaciones por email'],
  },
  menu: {
    title: 'Código QR de menú de restaurante',
    headline: 'Crea un código QR de menú — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de menú digital en mesa, con precios actualizables sin reimprimir. Con marca y listo para imprimir.',
    description:
      'Ofrece un menú digital en las mesas y actualiza los precios sin reimprimir.',
    benefits: [
      'Actualizas el menú cuando quieras sin reimprimir',
      'Los clientes acceden al menú actualizado con un escaneo',
      'Diseño con colores, logo y marco acorde a tu local',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Soportes de mesa', 'Bolsas para llevar', 'Pantallas de menú digital'],
  },
  pdf: {
    title: 'Código QR de documento PDF',
    headline: 'Crea un código QR de PDF — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de PDF para compartir folletos, menús, CVs o catálogos como enlace PDF. Con marca y listo para imprimir.',
    description:
      'Comparte folletos, menús, CVs o catálogos como enlace PDF.',
    benefits: [
      'Los visitantes acceden al documento con un escaneo',
      'Puedes actualizar el enlace del PDF cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Folletos', 'Catálogos', 'Menús en formato PDF'],
  },
  file: {
    title: 'Código QR de descarga de archivo',
    headline: 'Crea un código QR de descarga de archivo — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de archivo que enlaza a cualquier archivo descargable. Con marca y listo para imprimir.',
    description:
      'Enlaza a cualquier archivo que los visitantes puedan descargar.',
    benefits: [
      'Los visitantes descargan el archivo con un escaneo',
      'Puedes actualizar el enlace del archivo cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Manuales de uso', 'Archivos de presentación', 'Recursos digitales'],
  },
  app: {
    title: 'Código QR de descarga de app',
    headline: 'Crea un código QR de descarga de app — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de app que dirige a usuarios de iOS y Android a la tienda correcta. Con marca y listo para imprimir.',
    description:
      'Dirige a usuarios de iOS y Android a la tienda de aplicaciones correcta.',
    benefits: [
      'Cada usuario se dirige automáticamente a la tienda correcta',
      'Puedes actualizar el enlace de la tienda cuando quieras',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Carteles promocionales', 'Envases de producto', 'Anuncios digitales'],
  },
  crypto: {
    title: 'Código QR de pago cripto',
    headline: 'Crea un código QR de pago cripto — Gratis',
    metaDescription:
      'Generador gratuito de códigos QR de pago cripto para compartir tu wallet de Bitcoin o Ethereum sin errores de copiar y pegar. Con marca y listo para imprimir.',
    description:
      'Comparte tu wallet de Bitcoin o Ethereum sin errores de copiar y pegar.',
    benefits: [
      'La dirección de la wallet se lee sin errores con un escaneo',
      'Un importe opcional facilita el proceso de pago',
      'Diseño con colores, logo y marco acorde a tu marca',
      'Descarga en PNG, SVG o PDF listo para imprimir',
    ],
    useCases: ['Carteles de donación', 'Facturas y recibos', 'Pantallas de punto de venta'],
  },
};
