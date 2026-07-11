import type { TranslationTree } from './types';

/** Sections & fields for remaining core industry templates (ES) */
export const extraCoreSectionsEs: TranslationTree = {
  wedding: {
    couple: { title: 'Pareja y mensaje', description: 'Titular en calendarios y recordatorios.' },
    when: { title: 'Fecha y hora', description: 'Inicio de la ceremonia; fin opcional para el banquete.' },
    where: { title: 'Lugar', description: 'Nombre completo del lugar y ciudad para mapas.' },
    rsvp: { title: 'RSVP y redirección', description: 'La página de destino recoge confirmaciones; enlace opcional tras la confirmación.' },
  },
  'event-registration': {
    'event-info': { title: 'Identidad del evento', description: 'Nombre y fecha en la página de destino.' },
    registration: { title: 'Enlace de registro', description: 'Plataforma de entradas o página de inscripción.' },
    venue: { title: 'Lugar y agenda', description: 'Dónde o cómo se unen los asistentes.' },
  },
  'instagram-bio': {
    profile: { title: 'Perfil de Instagram', description: 'Nombre de usuario sin @ — abre instagram.com/username' },
    campaign: { title: 'Seguimiento de campaña', description: 'Sepa qué pieza impresa generó seguidores.' },
  },
  'youtube-channel': {
    channel: { title: 'Canal o vídeo', description: 'Handle del canal o URL de un vídeo/lista de reproducción.' },
    cta: { title: 'Llamada a la acción impresa', description: 'Texto junto al QR en su material.' },
  },
  portfolio: {
    work: { title: 'Enlace al portafolio', description: 'Behance, Dribbble, Notion o sitio personal.' },
    positioning: { title: 'Su posicionamiento', description: 'Titular de la página de destino antes de la redirección.' },
    contact: { title: 'Reservar una llamada', description: 'Enlace de agenda opcional en la página de destino.' },
  },
  'cv-resume': {
    document: { title: 'Documento CV', description: 'PDF en Drive, Dropbox o su sitio web.' },
    profile: { title: 'Resumen profesional', description: 'Se muestra en la página de destino antes de abrir el PDF.' },
  },
  'crypto-donate': {
    network: { title: 'Red y activo', description: 'Red incorrecta = fondos perdidos. Verifique antes de imprimir.' },
    wallet: { title: 'Dirección de la billetera', description: 'Solo dirección pública de recepción — nunca la frase semilla.' },
    amount: { title: 'Importe sugerido', description: 'Relleno previo opcional en billeteras compatibles.' },
  },
  'real-estate': {
    listing: { title: 'Página del inmueble', description: 'Fotos, precio, plano y características.' },
    property: { title: 'Resumen del inmueble', description: 'Referencia rápida para la página de destino.' },
    viewing: { title: 'Puertas abiertas y agente', description: 'Horarios de visita y contacto directo.' },
  },
  'retail-stores': {
    product: { title: 'Enlace de producto o promo', description: 'Destino al que llegan los compradores tras escanear.' },
    campaign: { title: 'Seguimiento de campaña', description: 'Etiquetas internas para analítica y lotes.' },
  },
  'hotels-hospitality': {
    property: { title: 'Identidad del establecimiento', description: 'Se muestra en la página del hub de huéspedes.' },
    'guest-services': {
      title: 'Enlaces del hub de huéspedes',
      description: 'Rellena los botones del hub — edite las URL por temporada.',
    },
  },
  'healthcare-clinics': {
    portal: { title: 'Destino del paciente', description: 'Formulario de admisión, reserva o PDF educativo en su portal.' },
    clinic: { title: 'Datos de la clínica', description: 'Contexto de la página de destino — no se codifica en el enlace del QR.' },
  },
  'museums-venues': {
    exhibit: { title: 'Destino de la exposición', description: 'Audioguía, vídeo, entradas o enlace de donación.' },
    label: { title: 'Etiqueta de la exposición', description: 'Título mostrado en la página de destino antes de la redirección.' },
  },
  'fitness-gyms': {
    schedule: { title: 'Horario o inscripción', description: 'Calendario de clases, membresía o página de prueba.' },
    gym: { title: 'Marca del gimnasio', description: 'Titular y línea promocional en la página de destino.' },
  },
  'salon-spa': {
    booking: { title: 'Enlace de reserva', description: 'Agenda online o página de servicios.' },
    salon: { title: 'Datos del salón', description: 'Línea de marca en la página de destino.' },
  },
  'nonprofit-fundraising': {
    donate: { title: 'Donación o inscripción', description: 'Givebutter, enlace de donación, voluntariado o informe de impacto.' },
    org: { title: 'Organización', description: 'Nombre de la campaña en la página de destino.' },
  },
  'dental-clinics': {
    intake: { title: 'Destino del paciente', description: 'Formulario de admisión, reserva o instrucciones postratamiento.' },
    practice: { title: 'Datos de la clínica', description: 'Contexto de la página de destino.' },
  },
  'home-services': {
    booking: { title: 'Solicitud de servicio', description: 'Agenda online, formulario de presupuesto o landing promocional.' },
    company: { title: 'Datos de la empresa', description: 'Marca y zona de servicio para la página de destino.' },
  },
  'coffee-shops-cafes': {
    menu: { title: 'Menú o fidelización', description: 'Menú digital, registro de fidelización o pedido móvil.' },
    cafe: { title: 'Marca de la cafetería', description: 'Nombre y mensaje de fidelización en la página de destino.' },
  },
  'tourist-attractions': {
    visit: { title: 'Destino del visitante', description: 'Entradas, audioguía, mapa o página de la exposición.' },
    attraction: { title: 'Datos del lugar', description: 'Nombre y horario en la página de destino.' },
  },
};

export const extraCoreFieldsEs: TranslationTree = {
  wedding: {
    title: { label: 'Título del evento', placeholder: 'María & Carlos — Boda' },
    description: { label: 'Mensaje de invitación' },
    startDate: { label: 'Inicio de la ceremonia' },
    endDate: { label: 'Fin del banquete (opcional)' },
    location: { label: 'Lugar y dirección', placeholder: 'Jardín La Encina, Madrid' },
    url: { label: 'Enlace tras RSVP (opcional)', placeholder: 'https://tuboda.com/galeria' },
    _registryUrl: { label: 'URL de lista de regalos (opcional)' },
  },
  'event-registration': {
    _eventName: { label: 'Nombre del evento', placeholder: 'Cumbre de Producto 2026' },
    _eventDate: { label: 'Fecha(s)', placeholder: '15–16 de junio de 2026, Madrid' },
    url: { label: 'URL de registro', placeholder: 'https://eventbrite.com/...' },
    _venue: { label: 'Lugar / plataforma', placeholder: 'IFEMA Madrid / Zoom' },
    _agendaUrl: { label: 'URL de la agenda (opcional)' },
  },
  'instagram-bio': {
    _campaign: { label: 'Etiqueta de campaña', placeholder: 'Caja colección verano' },
    _highlight: { label: 'Destacado a promocionar', placeholder: 'Novedades / Menú' },
  },
  'youtube-channel': {
    username: { label: 'Handle del canal', placeholder: '@tucanal' },
    url: { label: 'O URL de vídeo / lista de reproducción' },
    _ctaText: { label: 'Texto del CTA', placeholder: 'Escanee para suscribirse y ver tutoriales' },
  },
  portfolio: {
    url: { label: 'URL del portafolio', placeholder: 'https://behance.net/tunombre' },
    _headline: { label: 'Titular', placeholder: 'Diseñador de marca e interfaz' },
    _specialty: { label: 'Especialidad', placeholder: 'Fintech, SaaS, packaging' },
    _calendly: { label: 'URL de reserva', placeholder: 'https://calendly.com/tu' },
  },
  'cv-resume': {
    url: { label: 'URL del CV', placeholder: 'https://tusitio.com/cv.pdf' },
    _fullName: { label: 'Nombre completo', placeholder: 'Ana García' },
    _role: { label: 'Puesto objetivo', placeholder: 'Senior Product Manager' },
    _linkedin: { label: 'LinkedIn (opcional)' },
  },
  'crypto-donate': {
    coin: {
      label: 'Criptomoneda',
      options: {
        btc: 'Bitcoin (BTC)',
        eth: 'Ethereum (ETH)',
      },
    },
    address: { label: 'Dirección', placeholder: 'bc1q... o 0x...' },
    _purpose: { label: 'Propósito', placeholder: 'Apoye nuestro huerto comunitario' },
  },
  'real-estate': {
    url: { label: 'URL del inmueble' },
    _address: { label: 'Dirección', placeholder: 'Calle Mayor 123, Madrid' },
    _price: { label: 'Precio', placeholder: '425.000 €' },
    _specs: { label: 'Características', placeholder: '3 dorm. · 120 m² · 5.ª planta' },
    _openHouse: { label: 'Puertas abiertas', placeholder: 'Sáb 14:00–17:00' },
    _agentPhone: { label: 'Teléfono del agente' },
  },
  'retail-stores': {
    url: { label: 'URL de promo o producto' },
    _productName: { label: 'Producto o SKU', placeholder: 'Aceite de oliva ecológico 500 ml' },
    _campaign: { label: 'Campaña', placeholder: 'Escaparate primavera 2026' },
    _storeLocation: { label: 'Tienda / pasillo', placeholder: 'Centro · Pasillo 4' },
  },
  'hotels-hospitality': {
    _propertyName: { label: 'Nombre del establecimiento', placeholder: 'Hotel Bahía del Puerto' },
    _conciergePhone: { label: 'Teléfono de conserjería', placeholder: '+34 912 000 00 00' },
    _wifiPageUrl: { label: 'Página Wi‑Fi de huéspedes', placeholder: 'https://tuhotel.com/wifi' },
    _roomServiceUrl: { label: 'Menú de room service', placeholder: 'https://tuhotel.com/room-service' },
    _spaUrl: { label: 'Spa y servicios', placeholder: 'https://tuhotel.com/spa' },
    _localGuideUrl: { label: 'Guía local', placeholder: 'https://tuhotel.com/guia-local' },
    _checkInUrl: { label: 'Check-in móvil', placeholder: 'https://tuhotel.com/check-in' },
  },
  'healthcare-clinics': {
    url: { label: 'URL del portal' },
    _clinicName: { label: 'Nombre de la clínica', placeholder: 'Medicina Familiar Oeste' },
    _department: { label: 'Departamento', placeholder: 'Pediatría / Urgencias' },
  },
  'museums-venues': {
    url: { label: 'URL de la exposición' },
    _exhibitTitle: { label: 'Título de la exposición', placeholder: 'Maestros del Renacimiento' },
    _gallery: { label: 'Galería / zona', placeholder: 'Galería 3 · Ala este' },
  },
  'fitness-gyms': {
    url: { label: 'URL del horario' },
    _gymName: { label: 'Nombre del gimnasio / estudio', placeholder: 'IronWorks Fitness' },
    _trialOffer: { label: 'Oferta de prueba', placeholder: 'Pase gratuito de 7 días' },
  },
  'salon-spa': {
    url: { label: 'URL de reserva' },
    _salonName: { label: 'Nombre del salón', placeholder: 'Luxe Hair & Spa' },
    _topService: { label: 'Servicio destacado', placeholder: 'Balayage · Manicura gel' },
  },
  'nonprofit-fundraising': {
    url: { label: 'URL de la campaña' },
    _orgName: { label: 'Organización', placeholder: 'Alianza Huerto Comunitario' },
    _campaign: { label: 'Campaña', placeholder: 'Campaña de plantación primavera 2026' },
  },
  'dental-clinics': {
    url: { label: 'URL del paciente' },
    _practiceName: { label: 'Nombre de la clínica', placeholder: 'Bright Smile Dental' },
    _servicePromo: { label: 'Promoción actual', placeholder: 'Consulta de blanqueamiento gratuita' },
  },
  'home-services': {
    url: { label: 'URL de reserva' },
    _companyName: { label: 'Nombre de la empresa', placeholder: 'CoolAir HVAC' },
    _serviceArea: { label: 'Zona de servicio', placeholder: 'Área metropolitana de Madrid' },
    _seasonalPromo: { label: 'Oferta de temporada', placeholder: 'Revisión de AC 79 €' },
  },
  'coffee-shops-cafes': {
    url: { label: 'URL de menú / fidelización' },
    _cafeName: { label: 'Nombre de la cafetería', placeholder: 'Roast & Co.' },
    _loyaltyNote: { label: 'Mensaje de fidelización', placeholder: 'Escanee → 10 % dto. en el primer pedido' },
  },
  'tourist-attractions': {
    url: { label: 'URL del visitante' },
    _attractionName: { label: 'Nombre del lugar', placeholder: 'Faro del Puerto' },
    _hours: { label: 'Horario', placeholder: 'Diario 9:00–18:00' },
  },
};
