import type { TranslationTree } from './types';

/** Per-template tagline, use cases and pro tips — keyed by template id */
export const templateMetaEs: TranslationTree = {
  'restaurant-menu': {
    tagline: 'Menú digital en mesa: sin reimprimir cuando cambien los precios',
    useCases: {
      '0': 'Expositores de mesa',
      '1': 'Etiquetas de escaparate',
      '2': 'Envases de entrega',
      '3': 'Tarjetas de servicio de habitación',
    },
    tips: {
      '0': 'Imprima al menos 3×3 cm en expositores de mesa.',
      '1': 'Active rutas por horario para menús de comida y cena.',
      '2': 'Use captación de leads en la landing para solicitudes de reserva.',
      '3': 'UTM: source=qr_menu, medium=print.',
    },
  },
  'business-card': {
    tagline: 'Un escaneo guarda todos tus datos de contacto en su teléfono',
    useCases: {
      '0': 'Acreditación de congreso',
      '1': 'Firma de correo',
      '2': 'Puerta de oficina',
      '3': 'Banner de LinkedIn',
    },
    tips: {
      '0': 'vCard es estático: reimprima solo cuando cambien teléfono o cargo.',
      '1': 'Use corrección de errores H con logo centrado.',
      '2': 'Añada un QR de URL dinámica en el reverso para su portafolio más reciente.',
    },
  },
  'wedding': {
    tagline: 'Invitación, RSVP y detalles: enlace dinámico, sin reimprimir',
    useCases: {
      '0': 'Invitación impresa',
      '1': 'Tarjetas de mesa',
      '2': 'Save-the-date',
      '3': 'Tarjetas de agradecimiento',
    },
    tips: {
      '0': 'QR dinámico: actualice el enlace de lista de regalos o galería sin reimprimir.',
      '1': 'Landing + formulario de captación recoge RSVP (nombre, email, número de invitados).',
      '2': 'Añada fecha y hora del evento en los campos superiores para el subtítulo de la landing.',
      '3': 'Pruebe el contraste de impresión con la puntuación de escaneabilidad.',
    },
  },
  'event-registration': {
    tagline: 'Escanee para registrarse: carteles, acreditaciones y diapositivas',
    useCases: {
      '0': 'Banner enrollable',
      '1': 'Acreditación con cordón',
      '2': 'Campaña de email',
      '3': 'Última diapositiva',
    },
    tips: {
      '0': 'Haga A/B test de dos páginas de registro.',
      '1': 'Programe el QR para activarse el día del anuncio.',
      '2': 'Active el píxel de GA4 para seguimiento de cartel a registro.',
    },
  },
  'instagram-bio': {
    tagline: 'Del mundo físico al perfil: envases, tienda y eventos',
    useCases: {
      '0': 'Caja de producto',
      '1': 'Escaparate',
      '2': 'Folleto',
      '3': 'Muro fotográfico',
    },
    tips: {
      '0': 'Enlace corto dinámico: redirija a una publicación concreta más adelante.',
      '1': 'Pegatinas NFC: añada ?src=nfc para analítica de origen.',
      '2': 'Adapte el degradado a los colores de marca de Instagram.',
    },
  },
  'youtube-channel': {
    tagline: 'Impreso y envases → suscriptores',
    useCases: {
      '0': 'Cierre de vídeo',
      '1': 'Caja de merchandising',
      '2': 'Material de curso',
      '3': 'Presentación',
    },
    tips: {
      '0': 'Enlace a lista de reproducción de bienvenida para nuevos espectadores.',
      '1': 'Actualice la redirección al último vídeo sin reimprimir.',
      '2': 'Rojo sobre blanco escanea mejor: pruébelo sobre fondos oscuros.',
    },
  },
  'portfolio': {
    tagline: 'Muestre su trabajo y capture leads de proyectos',
    useCases: {
      '0': 'Placa de exposición',
      '1': 'Presentación freelance',
      '2': 'Complemento de Behance',
      '3': 'CV creativo',
    },
    tips: {
      '0': 'Formulario de leads: nombre, email, tipo de proyecto.',
      '1': 'Proteja con contraseña trabajos confidenciales de clientes.',
      '2': 'PNG transparente sobre paredes oscuras de exposición.',
    },
  },
  'cv-resume': {
    tagline: 'Los reclutadores abren su CV actualizado con un escaneo',
    useCases: {
      '0': 'Feria de empleo',
      '1': 'Cabecera del CV',
      '2': 'Networking',
      '3': 'Destacado en LinkedIn',
    },
    tips: {
      '0': 'Nombre el QR "CV 2026" y archive versiones antiguas.',
      '1': 'Pico de escaneos antes de la entrevista = han abierto su archivo.',
      '2': 'Combínelo con un QR vCard en tarjetas de networking.',
    },
  },
  'crypto-donate': {
    tagline: 'Dirección de recepción BTC o ETH: sin errores de escritura',
    useCases: {
      '0': 'Propina de streamer',
      '1': 'Cartel benéfico',
      '2': 'Bote del artista',
      '3': 'Patrocinio de evento',
    },
    tips: {
      '0': 'QR estático: nueva dirección requiere nueva impresión.',
      '1': 'Corrección de errores H + alto contraste sobre fondo oscuro.',
      '2': 'Pruebe primero con un envío pequeño.',
    },
  },
  'real-estate': {
    tagline: 'Cartel de venta → anuncio → solicitud de visita',
    useCases: {
      '0': 'Cartel de venta',
      '1': 'Folleto de jornada de puertas abiertas',
      '2': 'Tarjeta de agente',
      '3': 'Anuncio de alquiler',
    },
    tips: {
      '0': 'Formulario de leads: nombre, teléfono, horario de visita preferido.',
      '1': 'Geofence para compradores nacionales vs internacionales.',
      '2': 'Actualice la URL cuando baje el precio: el mismo QR del cartel.',
      '3': 'Folleto NFC para compradores con alta intención.',
    },
  },
  'wifi-guest': {
    tagline: 'Lobby y tarjetas de habitación: conéctese sin escribir contraseñas',
    useCases: {
      '0': 'Carpeta de habitación',
      '1': 'Expositor de mostrador de cafetería',
      '2': 'Lobby de coworking',
      '3': 'Tarjeta de bienvenida de Airbnb',
    },
    tips: {
      '0': 'Use una VLAN de invitados aislada de su red empresarial.',
      '1': 'Rote contraseñas mensualmente en locales de alto tráfico.',
      '2': 'Imprima al menos 3×3 cm para expositores de lobby.',
    },
  },
  'retail-stores': {
    tagline: 'Etiquetas de estantería y envases → páginas de producto y promociones',
    useCases: {
      '0': 'Etiqueta de estantería',
      '1': 'Etiqueta colgante del producto',
      '2': 'Escaparate',
      '3': 'Alta en programa de fidelización',
    },
    tips: {
      '0': 'UTM tags: source=qr_shelf, medium=print.',
      '1': 'Importación masiva CSV para cientos de SKU.',
      '2': 'Programe cambios de URL promocional por fecha.',
    },
  },
  'hotels-hospitality': {
    tagline: 'Un escaneo: Wi‑Fi, menús, spa y guía local',
    useCases: {
      '0': 'Expositor de habitación',
      '1': 'Directorio del lobby',
      '2': 'Señalización de piscina',
      '3': 'Soporte de menú de spa',
    },
    tips: {
      '0': 'Actualice enlaces estacionales de spa y restaurante sin reimprimir.',
      '1': 'Añada enrutamiento por idioma para huéspedes internacionales.',
      '2': 'Use la plantilla de landing hotelera para una marca elegante.',
    },
  },
  'healthcare-clinics': {
    tagline: 'Registro del paciente y educación: sin pilas de papel',
    useCases: {
      '0': 'Cartel de sala de espera',
      '1': 'Mostrador de recepción',
      '2': 'Folleto de consulta',
      '3': 'Cuidados post-visita',
    },
    tips: {
      '0': 'Nunca incluya PHI en la URL del QR: enlace a su portal conforme a normativa.',
      '1': 'Proteja con contraseña los flujos solo para personal.',
      '2': 'Actualice formularios cuando cambien los protocolos: el mismo QR impreso.',
    },
  },
  'museums-venues': {
    tagline: 'Etiquetas de exposición → audio, entradas y donaciones',
    useCases: {
      '0': 'Placa de exposición',
      '1': 'Señal de zona de galería',
      '2': 'Mesa de donaciones',
      '3': 'Acceso con horario programado',
    },
    tips: {
      '0': 'Enrutamiento multilingüe según país del visitante.',
      '1': 'Siga las exposiciones más populares por volumen de escaneos.',
      '2': 'Mínimo 2×2 cm a distancia de un brazo.',
    },
  },
  'fitness-gyms': {
    tagline: 'Horarios de clases y membresías desde el lobby',
    useCases: {
      '0': 'Tablero de horarios del lobby',
      '1': 'Zona de equipamiento',
      '2': 'Cartel de entrenador',
      '3': 'Promoción de pase de prueba',
    },
    tips: {
      '0': 'Actualice cambios semanales de clases sin nuevos carteles.',
      '1': 'QR de zona de equipamiento → vídeo tutorial por máquina.',
      '2': 'Enrutamiento por geofence para cadenas multi-sede.',
    },
  },
  'salon-spa': {
    tagline: 'Reservas y menús de servicios desde adhesivos de espejo',
    useCases: {
      '0': 'Adhesivo de espejo',
      '1': 'Mostrador de recepción',
      '2': 'Tarjeta de estilista',
      '3': 'Estantería de venta',
    },
    tips: {
      '0': 'Cambie promociones estacionales sin reimprimir adhesivos.',
      '1': 'Formulario de leads para paquetes de bodas y eventos.',
      '2': 'URLs específicas por estilista para seguimiento de comisiones.',
    },
  },
  'nonprofit-fundraising': {
    tagline: 'Done, sea voluntario y regístrese desde material impreso',
    useCases: {
      '0': 'Expositor de mesa de gala',
      '1': 'Inserto de correo directo',
      '2': 'Cartel de evento',
      '3': 'Stand de voluntarios',
    },
    tips: {
      '0': 'Cambie URLs de donación entre campañas: el mismo QR del cartel.',
      '1': 'Distinga expositores de mesa y carteles por etiqueta de lote.',
      '2': 'Haga A/B test del texto de la página de donación en la landing.',
    },
  },
  'dental-clinics': {
    tagline: 'Registro, cita y cuidados posteriores desde el sillón',
    useCases: {
      '0': 'Cartel de recepción',
      '1': 'Tarjeta recordatorio de cita',
      '2': 'Cuidados posteriores en sillón',
      '3': 'Promoción de blanqueamiento',
    },
    tips: {
      '0': 'Enlace a portal compatible con HIPAA: sin PHI en el QR.',
      '1': 'PDF de cuidados posteriores que los pacientes pueden guardar en fotos.',
      '2': 'Promocione ofertas de higiene en tarjetas estacionales.',
    },
  },
  'home-services': {
    tagline: 'Vinilos de furgoneta y carteles → reservas y reseñas',
    useCases: {
      '0': 'Vinilo de furgoneta',
      '1': 'Cartel de jardín',
      '2': 'Colgador de puerta',
      '3': 'Cartel de obra',
    },
    tips: {
      '0': 'QR por técnico para seguimiento territorial.',
      '1': 'Rote promociones estacionales en el mismo vinilo.',
      '2': 'Webhook al CRM cuando se envía el formulario de leads.',
    },
  },
  'coffee-shops-cafes': {
    tagline: 'Fidelización, menú y pedidos desde el mostrador',
    useCases: {
      '0': 'Expositor de mostrador',
      '1': 'Tarjeta de mesa',
      '2': 'Manga de vaso para llevar',
      '3': 'Cartel de fidelización',
    },
    tips: {
      '0': 'Combínelo con un QR Wi‑Fi separado para la red de invitados.',
      '1': 'Actualice bebidas de temporada sin reimprimir expositores.',
      '2': 'UTM: source=qr_counter for attribution.',
    },
  },
  'tourist-attractions': {
    tagline: 'Escaneo en la entrada → entradas, audio y mapas',
    useCases: {
      '0': 'Puerta de entrada',
      '1': 'Marcador de sendero',
      '2': 'Taquilla',
      '3': 'Poste de audioguía',
    },
    tips: {
      '0': 'Enrutamiento multilingüe para turistas internacionales.',
      '1': 'QR por entrada para analítica de flujo de visitantes.',
      '2': 'Actualice horarios y exposiciones sin reimprimir señales.',
    },
  },
  'campus-institution': {
    tagline: 'Mapas, servicios e información pública: un escaneo por ubicación',
    useCases: {
      '0': 'Placa de edificio',
      '1': 'Orientación',
      '2': 'Servicios ciudadanos',
      '3': 'Lobby de departamento',
    },
    tips: {
      '0': 'CSV masivo para cientos de placas de sala.',
      '1': 'Enrutamiento multilingüe para usuarios internacionales.',
    },
  },
  'professional-services': {
    tagline: 'Registro de clientes y portales seguros: derecho, seguros, contabilidad',
    useCases: {
      '0': 'Lobby de oficina',
      '1': 'Tarjeta de visita',
      '2': 'Inserto de mailing',
      '3': 'Stand de congreso',
    },
    tips: {
      '0': 'Proteja con contraseña enlaces a documentos sensibles.',
      '1': 'Nunca incluya PII en la URL del QR.',
    },
  },
  'retail-grocery': {
    tagline: 'Folleto semanal, alta en fidelización y consulta de precios desde el pasillo',
    useCases: {
      '0': 'Expositor de folleto semanal',
      '1': 'Etiqueta de estantería de pasillo',
      '2': 'Cartel de alta en fidelización',
      '3': 'Mostrador de caja',
    },
    tips: {
      '0': 'Cambie el enlace del folleto semanal cada lunes: el mismo QR de estantería.',
      '1': 'Añada una URL de alta en fidelización para hacer crecer su lista desde el pasillo.',
      '2': 'Use un QR independiente por tienda para analítica de afluencia.',
    },
  },
  'entertainment-venue': {
    tagline: 'Entradas, horarios y merchandising desde un solo cartel',
    useCases: {
      '0': 'Cartel del lobby',
      '1': 'Grifo de barril',
      '2': 'Pulsera de evento',
      '3': 'Expositor de mesa',
    },
    tips: {
      '0': 'Cambie URLs de espectáculos entre eventos: el mismo QR del cartel.',
    },
  },
  'automotive-marine': {
    tagline: 'Inventario, línea de servicio y amarraderos',
    useCases: {
      '0': 'Etiqueta de escaparate',
      '1': 'Línea de servicio',
      '2': 'Amarradero de marina',
      '3': 'Bahía de detailing',
    },
    tips: {
      '0': 'Geofence por ubicación de concesionario.',
      '1': 'Actualice enlaces VDP cuando rote el inventario.',
    },
  },
  'property-facilities': {
    tagline: 'Portales de inquilinos, coworking y operaciones de almacén',
    useCases: {
      '0': 'Lobby del edificio',
      '1': 'Puerta de muelle',
      '2': 'Mostrador de socios',
      '3': 'Mailing de unidad',
    },
    tips: {
      '0': 'Carpetas por edificio en el panel.',
      '1': 'Webhook al sistema de incidencias de mantenimiento.',
    },
  },
  'specialty-healthcare': {
    tagline: 'Registro en clínica veterinaria, óptica y especializada',
    useCases: {
      '0': 'Cartel de recepción',
      '1': 'Tarjeta de cita',
      '2': 'Sala de espera',
    },
    tips: {
      '0': 'Enlace a portal conforme a normativa: sin PHI en la URL del QR.',
    },
  },
  'family-community': {
    tagline: 'Inscripción, portales familiares y comunidad de fe',
    useCases: {
      '0': 'Señal del lobby',
      '1': 'Inserto del boletín',
      '2': 'Mailing familiar',
      '3': 'Cartel de evento',
    },
    tips: {
      '0': 'Proteja con contraseña el contenido solo para familias.',
      '1': 'Actualice calendarios de eventos sin reimprimir.',
    },
  },
  'mobile-vendor': {
    tagline: 'Food trucks y pop-ups: menú y pedidos sobre la marcha',
    useCases: {
      '0': 'Ventanilla del truck',
      '1': 'Stand de festival',
      '2': 'Bio en redes',
    },
    tips: {
      '0': 'Actualice la ubicación diaria en la landing.',
      '1': 'El mismo QR en el truck toda la temporada.',
    },
  },
  'local-services-hub': {
    tagline: 'Reservas, registro y promociones para negocios del barrio',
    useCases: {
      '0': 'Escaparate',
      '1': 'Vinilo de vehículo',
      '2': 'Tarjeta de mostrador',
      '3': 'Cartel de jardín',
    },
    tips: {
      '0': 'Cambie promociones estacionales en el mismo vinilo.',
      '1': 'Formulario de leads en la landing.',
    },
  },
  'whatsapp-order': {
    tagline: 'Un escaneo abre un chat de WhatsApp: pedidos y soporte sin buscar la app',
    useCases: { '0': 'Expositor de mesa', '1': 'Escaparate', '2': 'Envase de entrega', '3': 'Folleto' },
    tips: {
      '0': 'Pre-rellene el mensaje con un enlace al menú o "Quiero hacer un pedido".',
      '1': 'Use un número de empresa con WhatsApp Business para respuestas automáticas.',
      '2': 'Imprima al menos 3×3 cm en expositores de mesa y envases.',
    },
  },
  'google-review': {
    tagline: 'Lleve a clientes satisfechos directamente a su formulario de reseñas de Google',
    useCases: { '0': 'Tarjeta de mostrador', '1': 'Pie de ticket', '2': 'Expositor de mesa', '3': 'Inserto de entrega' },
    tips: {
      '0': 'Pida en el momento de satisfacción: tras el pago o una comida excelente.',
      '1': 'Acompáñelo con una frase breve: "¿Le ha gustado? Escanee para dejar una reseña."',
      '2': 'Siga picos de escaneos para ver qué ubicaciones solicitan más reseñas.',
    },
  },
  'tiktok-profile': {
    tagline: 'Convierta el tráfico offline en seguidores de TikTok',
    useCases: { '0': 'Caja de producto', '1': 'Escaparate', '2': 'Stand de evento', '3': 'Folleto' },
    tips: {
      '0': 'Enlace corto dinámico: redirija a una campaña más adelante.',
      '1': 'Añada ?src=nfc en pegatinas NFC para analítica de origen.',
      '2': 'Imprímalo en envases para captar compradores tras la compra.',
    },
  },
  'linkedin-profile': {
    tagline: 'Networking profesional desde tarjetas, acreditaciones y folletos',
    useCases: { '0': 'Acreditación de congreso', '1': 'Tarjeta de visita', '2': 'Folleto', '3': 'Firma de correo' },
    tips: {
      '0': 'Encuentre su slug en la URL pública de su perfil de LinkedIn.',
      '1': 'Combínelo con un QR vCard en tarjetas de networking.',
      '2': 'Alta corrección de errores con logo centrado escanea mejor.',
    },
  },
  'facebook-page': {
    tagline: 'Haga crecer su página de Facebook desde impreso y envases',
    useCases: { '0': 'Escaparate', '1': 'Folleto', '2': 'Pie de ticket', '3': 'Cartel de evento' },
    tips: {
      '0': 'Use la URL personalizada de su página, no el ID numérico.',
      '1': 'Promocione eventos y ofertas en la misma página.',
      '2': 'Siga qué piezas impresas generan más seguidores.',
    },
  },
};
