import type { TranslationTree } from './types';
import {
  extraCoreFieldsEs,
  extraCoreSectionsEs,
} from './core-template-copy-extra-es';

const namesEs: TranslationTree = {
  'restaurant-menu': 'Menú de restaurante',
  'business-card': 'Tarjeta de visita digital',
  wedding: 'Boda y RSVP',
  'event-registration': 'Registro de eventos',
  'instagram-bio': 'Instagram Bio',
  'youtube-channel': 'Canal de YouTube',
  portfolio: 'Portafolio creativo',
  'cv-resume': 'CV y currículum',
  'crypto-donate': 'Donación cripto',
  'real-estate': 'Anuncio inmobiliario',
  'wifi-guest': 'Wi‑Fi para invitados',
  'retail-stores': 'Retail y producto',
  'hotels-hospitality': 'Hotel y hostelería',
  'healthcare-clinics': 'Clínica de salud',
  'museums-venues': 'Museo y recinto',
  'fitness-gyms': 'Fitness y gimnasio',
  'salon-spa': 'Salón y spa',
  'nonprofit-fundraising': 'Recaudación sin ánimo de lucro',
  'dental-clinics': 'Clínica dental',
  'home-services': 'Servicios del hogar',
  'coffee-shops-cafes': 'Cafetería y café',
  'tourist-attractions': 'Atracción turística',
  'campus-institution': 'Campus e institución',
  'professional-services': 'Servicios profesionales',
  'retail-grocery': 'Supermercado y alimentación',
  'entertainment-venue': 'Local de ocio',
  'automotive-marine': 'Automoción y náutica',
  'property-facilities': 'Inmuebles e instalaciones',
  'specialty-healthcare': 'Salud especializada',
  'family-community': 'Familia y comunidad',
  'mobile-vendor': 'Vendedor móvil',
  'local-services-hub': 'Servicios locales',
  'whatsapp-order': 'Pedidos por WhatsApp',
  'google-review': 'Reseñas de Google',
  'tiktok-profile': 'Perfil de TikTok',
  'linkedin-profile': 'Perfil de LinkedIn',
  'facebook-page': 'Página de Facebook',
};

const coreSectionsEs: TranslationTree = {
  'restaurant-menu': {
    venue: { title: 'Local y marca', description: 'Cómo le reconocen los clientes antes de abrir el menú.' },
    'menu-link': { title: 'Destino del menú', description: 'Enlace a su menú digital (web, PDF o plataforma de menús).' },
    service: { title: 'Servicios adicionales', description: 'Rutas que los clientes suelen necesitar desde la misma campaña.' },
  },
  'business-card': {
    personal: { title: 'Datos personales', description: 'Nombre y cargo en la tarjeta de contacto guardada.' },
    company: { title: 'Empresa', description: 'Nombre de la organización y sitio web.' },
    reach: { title: 'Canales de contacto', description: 'Prioridad móvil — incluya el prefijo internacional.' },
    location: { title: 'Dirección de oficina (opcional)', description: 'Ayuda a mapas y apps de navegación.' },
  },
  'wifi-guest': {
    venue: { title: 'Etiqueta del local', description: 'Nombre impreso en su cartel Wi‑Fi — no se codifica en el QR.' },
    network: { title: 'Red de invitados', description: 'SSID, contraseña y tipo de seguridad para conexión automática.' },
  },
  'hotels-hospitality': {
    property: { title: 'Identidad del establecimiento', description: 'Se muestra en la página del hub de huéspedes.' },
    'guest-services': {
      title: 'Enlaces del hub de huéspedes',
      description: 'Rellena los botones del hub — edite las URL por temporada.',
    },
  },
};

const coreFieldsEs: TranslationTree = {
  'restaurant-menu': {
    _venueName: { label: 'Nombre del restaurante', placeholder: 'p. ej. El Bistró del Jardín' },
    url: { label: 'URL del menú', placeholder: 'https://turestaurante.com/menu' },
    _wifiNote: { label: 'Nota Wi‑Fi (opcional)' },
    _reservationUrl: { label: 'Enlace de reservas (opcional)' },
    _hours: { label: 'Horario de apertura (opcional)', placeholder: 'Lun–Dom 11:00–23:00' },
    _dietaryNote: { label: 'Nota dietética (opcional)', placeholder: 'Opciones sin gluten disponibles' },
  },
  'business-card': {
    title: { label: 'Cargo', placeholder: 'Director de ventas' },
    org: { label: 'Nombre de la empresa', placeholder: 'Acme S.L.' },
  },
  'wifi-guest': {
    _venueName: { label: 'Nombre del local', placeholder: 'p. ej. Lobby Hotel del Puerto' },
    _instructions: {
      label: 'Instrucciones de conexión (subtítulo de impresión)',
      placeholder: 'Escanee para conectarse automáticamente. Acepte el certificado si se solicita.',
    },
    _supportExt: { label: 'Soporte / recepción', placeholder: 'Marque 0' },
    ssid: { label: 'Nombre de la red (SSID)', placeholder: 'WiFi_Invitados' },
    password: { label: 'Contraseña', placeholder: 'invitado2026' },
    encryption: {
      label: 'Tipo de seguridad',
      options: {
        WPA: 'WPA / WPA2',
        WEP: 'WEP',
        nopass: 'Abierta (sin contraseña)',
      },
    },
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
};

const archetypeSectionsEs: TranslationTree = {
  'campus-institution': {
    link: { title: 'Destino', description: 'Portal, mapa o página de servicio.' },
    org: { title: 'Organización', description: 'Se muestra en la página de destino.' },
  },
  'professional-services': {
    portal: { title: 'Destino del cliente', description: 'Formulario de admisión o portal seguro de documentos.' },
    firm: { title: 'Datos de la firma', description: 'Se muestra en la página de destino y material impreso.' },
  },
  'retail-grocery': {
    circular: { title: 'Enlace de ofertas semanales', description: 'Su folleto, circular u ofertas en vivo — actualícelo sin reimprimir los carteles de estantería.' },
    store: { title: 'Datos de la tienda', description: 'Se muestra en la página de destino para los compradores.' },
  },
  'entertainment-venue': {
    tickets: { title: 'Entradas', description: 'Venta de entradas, horarios o registro de eventos.' },
    venue: { title: 'Local y espectáculo', description: 'Se muestra en la página de destino antes de la redirección.' },
  },
  'automotive-marine': {
    listing: { title: 'Enlace de vehículo o servicio', description: 'Inventario, ficha de vehículo o reserva de servicio.' },
    business: { title: 'Datos del negocio', description: 'Se muestra en la página de destino y material impreso.' },
  },
  'property-facilities': {
    portal: { title: 'Enlace al portal', description: 'Portal de inquilinos, socios u operaciones de almacén.' },
    building: { title: 'Datos del edificio', description: 'Se muestra en la página de destino para inquilinos y socios.' },
  },
  'specialty-healthcare': {
    intake: { title: 'Destino de admisión', description: 'Admisión de pacientes o mascotas y reserva de citas.' },
    clinic: { title: 'Datos de la clínica', description: 'Se muestra en la página de destino — nunca codifique PHI en el enlace del QR.' },
  },
  'family-community': {
    community: { title: 'Enlace comunitario', description: 'Inscripción, portal familiar o hub de comunidad de fe.' },
    org: { title: 'Datos de la organización', description: 'Se muestra en la página de destino para familias y miembros.' },
  },
  'mobile-vendor': {
    menu: { title: 'Enlace de menú o pedido', description: 'Menú diario, pedido móvil o actualizaciones de ubicación.' },
  },
  'local-services-hub': {
    booking: { title: 'Enlace de servicio', description: 'Reserva online, solicitud de presupuesto o promo de servicio.' },
  },
  'whatsapp-order': {
    number: { title: 'Número de WhatsApp', description: 'Incluya el prefijo internacional — abre un chat con este número.' },
    message: { title: 'Mensaje predefinido', description: 'Opcional — rellena el chat para que los clientes empiecen más rápido.' },
  },
  'google-review': {
    'review-link': { title: 'Enlace de reseña de Google', description: 'Pegue su enlace corto «escribir una reseña» de Google Business Profile.' },
    business: { title: 'Nombre del negocio', description: 'Se muestra en la tarjeta — no se codifica en el enlace.' },
  },
  'tiktok-profile': {
    profile: { title: 'Usuario de TikTok', description: 'Sin @ — abre tiktok.com/@usuario.' },
  },
  'linkedin-profile': {
    profile: { title: 'Perfil de LinkedIn', description: 'Su slug de perfil público — abre linkedin.com/in/slug.' },
  },
  'facebook-page': {
    profile: { title: 'Página de Facebook', description: 'Usuario o nombre personalizado de la página — abre facebook.com/nombre.' },
  },
};

const archetypeFieldsEs: TranslationTree = {
  'campus-institution': {
    url: { label: 'URL', placeholder: 'https://campus.edu/servicios' },
    _orgName: { label: 'Nombre de la institución', placeholder: 'Universidad Estatal' },
    _department: { label: 'Departamento / oficina', placeholder: 'Asuntos Estudiantiles' },
  },
  'professional-services': {
    url: { label: 'URL del portal', placeholder: 'https://tufirma.com/admision' },
    _firmName: { label: 'Nombre de la firma' },
    _practiceArea: { label: 'Área de práctica', placeholder: 'Fiscal · Litigio · Seguros' },
  },
  'retail-grocery': {
    url: { label: 'URL de ofertas semanales', placeholder: 'https://tutienda.com/semanal' },
    _storeName: { label: 'Nombre de la tienda', placeholder: 'FreshMart Centro' },
    _loyaltyUrl: { label: 'URL de registro de fidelización', placeholder: 'https://tutienda.com/fidelizacion' },
    _weekOf: { label: 'Fechas de validez', placeholder: 'Válido del 8 al 14 de julio' },
    _openHours: { label: 'Horario de apertura', placeholder: 'Diario 08:00–22:00' },
  },
  'entertainment-venue': {
    url: { label: 'URL de entradas' },
    _venueName: { label: 'Nombre del local' },
    _event: { label: 'Espectáculo / estreno' },
    _showtimes: { label: 'Horarios', placeholder: 'Vie–Dom · 20:00' },
    _merchUrl: { label: 'URL de merch / info' },
  },
  'automotive-marine': {
    url: { label: 'URL de anuncio / reserva' },
    _businessName: { label: 'Concesionario / marina' },
    _stockInfo: { label: 'Info de stock / modelo', placeholder: 'Modelos 2024 · 45 en stock' },
    _servicePromo: { label: 'Oferta de servicio', placeholder: 'Inspección multipunto gratuita' },
    _agentPhone: { label: 'Teléfono de ventas / servicio' },
  },
  'property-facilities': {
    url: { label: 'URL del portal' },
    _buildingName: { label: 'Edificio / emplazamiento' },
    _unitInfo: { label: 'Info de unidad / planta', placeholder: 'Plantas 1–12 · 240 unidades' },
    _managerContact: { label: 'Contacto de administración' },
    _maintenanceUrl: { label: 'URL de solicitud de mantenimiento' },
  },
  'specialty-healthcare': {
    url: { label: 'URL de admisión' },
    _clinicName: { label: 'Nombre de la clínica' },
    _specialty: { label: 'Especialidad', placeholder: 'Veterinaria · Optometría · Dermatología' },
    _bookingPhone: { label: 'Teléfono de reservas' },
    _hours: { label: 'Horario', placeholder: 'Lun–Vie 9:00–18:00' },
  },
  'family-community': {
    url: { label: 'URL del portal' },
    _orgName: { label: 'Organización' },
    _programType: { label: 'Tipo de programa', placeholder: 'Guardería · Residencia · Comunidad de fe' },
    _scheduleInfo: { label: 'Horario / programa' },
    _contactInfo: { label: 'Contacto' },
  },
  'mobile-vendor': {
    url: { label: 'URL del menú' },
    _truckName: { label: 'Nombre del vendedor' },
    _location: { label: 'Ubicación de hoy' },
  },
  'local-services-hub': {
    url: { label: 'URL de reserva' },
    _businessName: { label: 'Nombre del negocio' },
    _offer: { label: 'Oferta actual' },
  },
  'whatsapp-order': {
    phone: { label: 'Número de WhatsApp', placeholder: '+34 612 000 00 00' },
    message: { label: 'Mensaje', placeholder: '¡Hola! Me gustaría hacer un pedido…' },
  },
  'google-review': {
    url: { label: 'URL de reseña', placeholder: 'https://g.page/r/…/review' },
    _businessName: { label: 'Nombre del negocio', placeholder: 'El Bistró del Jardín' },
  },
  'tiktok-profile': {
    username: { label: 'Nombre de usuario', placeholder: 'tumarca' },
  },
  'linkedin-profile': {
    username: { label: 'Slug del perfil', placeholder: 'ana-garcia' },
  },
  'facebook-page': {
    username: { label: 'Nombre de la página', placeholder: 'tunegocio' },
  },
};

export const industryTemplateCopyEs: TranslationTree = {
  picker: {
    title: 'Plantillas de inicio rápido',
    subtitle: 'Configuraciones listas para restaurantes, tarjetas de visita, eventos y más — personalice todo en el siguiente paso.',
    sectionsCount: '{{n}} secciones',
  },
  guide: {
    showTips: 'Mostrar consejos',
    hideTips: 'Ocultar consejos',
    suggestedCtas: 'CTA sugeridos',
    recommendedPrint: 'Impresión recomendada',
    bestFor: 'Ideal para',
    helpfulTips: 'Consejos útiles',
    minPrintQr: 'mín. {{cm}} cm QR',
    dismissAria: 'Cerrar guía de plantilla',
  },
  visualPresets: {
    title: 'Plantillas profesionales',
    subtitle: 'Estilos premium optimizados para fiabilidad de escaneo, contraste e impresión. Un clic aplica colores, puntos, marco y CTA.',
    all: 'Todas',
    categories: {
      business: 'Negocios y corporativo',
      hospitality: 'Restaurante y hotel',
      retail: 'Retail y recinto',
      social: 'Social y chat',
      event: 'Eventos y ONG',
      health: 'Salud',
      minimal: 'Minimal y Wi‑Fi',
      luxury: 'Lujo y premium',
    },
  },
  names: namesEs,
  sections: { ...coreSectionsEs, ...extraCoreSectionsEs, ...archetypeSectionsEs },
  fields: { ...coreFieldsEs, ...extraCoreFieldsEs, ...archetypeFieldsEs },
};
