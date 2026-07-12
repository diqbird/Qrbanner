import type { UseCasePage } from '@/lib/use-case-pages';

/**
 * Spanish (es) marketing copy for use-case pages.
 * Keys are the same slugs defined in `lib/use-case-pages.ts`.
 * Only translatable fields are overridden; structural fields
 * (categoryId, icon, relatedSolutionSlug, slug) come from the base data.
 */
export const USE_CASE_COPY_ES: Record<string, Partial<UseCasePage>> = {
  'product-packaging': {
    title: 'Códigos QR en el packaging de producto',
    headline: 'Convierta cada envase en un punto de contacto digital',
    metaDescription:
      'Añada códigos QR al packaging para manuales, registro de garantía, enlaces de recompra y analítica de escaneos. Generador de QR dinámicos gratuito.',
    keywords: ['QR packaging de producto', 'QR en caja', 'marketing QR en envases'],
    description:
      'Coloque un código QR en cajas, etiquetas o inserts para compartir guías de configuración, formularios de garantía, recetas o páginas de recompra — y actualice el enlace sin reimprimir.',
    benefits: [
      'Enlace a manuales, vídeos o soporte sin coste de impresión extra',
      'Haga seguimiento de escaneos por región y lote de campaña',
      'Cambie destinos para promociones de temporada o retiradas',
      'Branding personalizado con logo y colores de marca',
    ],
    steps: [
      'Cree un código QR dinámico de sitio web o PDF',
      'Añada su logo y estilo de marco',
      'Exporte PNG o SVG listo para imprimir en el arte del packaging',
      'Supervise los escaneos en el panel tras el lanzamiento',
    ],
  },
  'trade-show-leads': {
    title: 'Captación de leads en ferias y expos',
    headline: 'Capture visitantes del stand sin formularios en papel',
    metaDescription:
      'Use códigos QR en ferias para captar leads, descargas de folletos y enlaces de seguimiento. Mida el tráfico del stand con analítica de escaneos.',
    keywords: ['QR feria comercial', 'QR captación leads expo', 'QR stand'],
    description:
      'Sustituya las carpetas por una landing escaneable o una vCard. Dirija a los visitantes a demos, calendarios o formularios CRM y mida las horas pico del stand.',
    benefits: [
      'Guardado instantáneo de contacto con códigos QR vCard',
      'Prueba A/B de dos landings desde un mismo stand',
      'Enrutamiento por geovalla para giras multicudad',
      'Envíe leads por webhook a HubSpot o Zapier',
    ],
    steps: [
      'Elija una plantilla de tarjeta de visita o hub de enlaces',
      'Añada la URL de reserva de demo o formulario de lead',
      'Imprima en banners, credenciales y folletos',
      'Revise los mapas de calor de escaneos tras el evento',
    ],
  },
  'print-advertising': {
    title: 'Anuncios impresos, carteles y flyers',
    headline: 'Conecte la impresión offline con conversiones online',
    metaDescription:
      'Añada códigos QR a carteles, flyers y anuncios en revistas. Haga seguimiento de qué ubicaciones generan escaneos y actualice ofertas sin reimprimir.',
    keywords: ['QR cartel', 'QR flyer', 'QR publicidad impresa'],
    description:
      'Conecte campañas impresas con landings, códigos promocionales o contenido en vídeo. Los códigos dinámicos permiten corregir errores y renovar creatividades a mitad de campaña.',
    benefits: [
      'Landings compatibles con UTM por ubicación',
      'Vistas previas protegidas con contraseña para clientes',
      'Redirecciones programadas para inicio y fin de campaña',
      'Exporte banners de impresión con guías de sangrado',
    ],
    steps: [
      'Cree un QR de URL con la landing de su campaña',
      'Diseñe un código de alto contraste para el tamaño de impresión',
      'Use códigos únicos por ciudad o publicación',
      'Compare tasas de escaneo en la analítica',
    ],
  },
  'email-signature': {
    title: 'Códigos QR en la firma de correo',
    headline: 'Comparta sus datos de contacto desde cada email',
    metaDescription:
      'Añada un código QR a las firmas de correo para guardar vCard, enlaces de reserva o perfiles sociales. Actualice una vez — las firmas se mantienen al día.',
    keywords: ['QR firma de email', 'QR vCard email', 'QR email profesional'],
    description:
      'Inserte un QR pequeño en el bloque de firma para que los lectores móviles guarden su contacto o reserven una reunión con un solo escaneo.',
    benefits: [
      'La vCard guarda nombre, teléfono y email automáticamente',
      'Actualice cargo o teléfono sin nuevas firmas',
      'Haga seguimiento de cuántos escaneos genera su firma',
      'Compatible con Gmail, Outlook y Apple Mail',
    ],
    steps: [
      'Cree un QR vCard con sus datos más recientes',
      'Descargue un PNG compacto para la firma',
      'Enlace a calendario o portfolio como CTA secundario',
      'Actualice el código cuando cambie de rol',
    ],
  },
  'restaurant-table-tents': {
    title: 'Códigos QR para caras de mesa de restaurante',
    headline: 'Menú, reseñas y Wi‑Fi en cada mesa',
    metaDescription:
      'Cree códigos QR para caras de mesa con menús digitales, reseñas de Google y Wi‑Fi para invitados. Actualice enlaces de menú sin reimprimir las caras.',
    keywords: ['QR cara de mesa', 'QR mesa restaurante', 'QR menú mesa'],
    description:
      'Los comensales escanean para el menú, ofertas del día, feedback o credenciales Wi‑Fi. Los menús dinámicos evitan nuevas tiradas al cambiar precios.',
    benefits: [
      'PDF o URL web del menú con un código por sala',
      'Enrutamiento comida/cena a menús distintos',
      'Contraseña opcional para menús solo de personal',
      'Diseños de cara de mesa listos para imprimir con branding',
    ],
    steps: [
      'Use la plantilla de menú de restaurante',
      'Pegue la URL del menú o suba el enlace al PDF',
      'Añada logo y colores de marca al marco del QR',
      'Imprima las caras y supervise aperturas por hora',
    ],
  },
  'hotel-guest-experience': {
    title: 'QR para la experiencia del huésped hotelero',
    headline: 'Wi‑Fi, guías y upselling en cada habitación',
    metaDescription:
      'Códigos QR de habitación para Wi‑Fi, guías locales, reserva de spa y chat de conserjería. Plantillas para hostelería con analítica.',
    keywords: ['QR habitación hotel', 'QR hostelería', 'QR WiFi huésped hotel'],
    description:
      'Sustituya las tarjetas laminadas por un único hub escaneable para Wi‑Fi, room service, información de checkout y recomendaciones locales.',
    benefits: [
      'El QR Wi‑Fi conecta a la red sin escribir la contraseña',
      'Hub de enlaces para spa, restauración y socios de transporte',
      'Landings multilingües para huéspedes internacionales',
      'Analítica de escaneos por planta o establecimiento',
    ],
    steps: [
      'Cree códigos Wi‑Fi y hub de enlaces por establecimiento',
      'Añada branding según las directrices de la propiedad',
      'Colóquelos en fundas de llave, espejos y ascensores',
      'Dirija ofertas de temporada con redirecciones programadas',
    ],
  },
  'event-check-in': {
    title: 'Check-in de eventos y credenciales',
    headline: 'Registro más rápido y enlaces a sesiones',
    metaDescription:
      'Códigos QR de eventos para check-in, agenda, diapositivas de sesión y networking. Códigos dinámicos para conferencias, bodas y meetups.',
    keywords: ['QR check-in evento', 'QR credencial conferencia', 'QR boda'],
    description:
      'Use QR en credenciales para perfiles de asistentes, materiales de sesión o añadir al calendario. Actualice enlaces si cambian salas u horarios.',
    benefits: [
      'El QR de evento de calendario añade la agenda en un toque',
      'vCards en credenciales para networking',
      'Redirecciones geovalladas por zona del recinto',
      'Conteo de escaneos en tiempo real por sesión',
    ],
    steps: [
      'Cree códigos de evento o vCard por tipo de asistente',
      'Enlace a agenda, diapositivas o retransmisión en directo',
      'Imprima en credenciales, programas y señalética',
      'Exporte el informe de escaneos tras el evento',
    ],
  },
  'retail-loyalty': {
    title: 'Fidelización retail y alta por SMS',
    headline: 'Haga crecer su lista desde el punto de venta',
    metaDescription:
      'Códigos QR retail para alta en fidelización, promos SMS y consulta de productos. Haga seguimiento del engagement en tienda con analítica de escaneos.',
    keywords: ['QR fidelización retail', 'QR marketing tienda', 'QR alta SMS'],
    description:
      'Coloque códigos en caja, estanterías y tickets para inscribir a los compradores en programas de fidelización u ofertas SMS.',
    benefits: [
      'El QR SMS rellena de antemano el mensaje de opt-in',
      'Enlace al portal de fidelización o descarga de app',
      'Códigos distintos por tienda para atribución',
      'Envíe nuevas altas a su CRM por webhook',
    ],
    steps: [
      'Elija el tipo de QR SMS o descarga de app',
      'Añada el texto de la oferta y el aviso de cumplimiento',
      'Imprima stoppers de estantería e inserts en tickets',
      'Mida la conversión por ubicación',
    ],
  },
  'real-estate-listings': {
    title: 'Códigos QR para anuncios inmobiliarios',
    headline: 'Más consultas desde carteles y folletos',
    metaDescription:
      'Códigos QR inmobiliarios en carteles de venta, flyers de jornadas de puertas abiertas y fichas. Dirija a compradores a visitas, vídeos y contacto del agente.',
    keywords: ['QR inmobiliario', 'QR cartel en venta', 'QR open house'],
    description:
      'Los compradores escanean para detalles del anuncio, tours 3D, calculadoras hipotecarias o vCards del agente — actualice el estado cuando se venda.',
    benefits: [
      'El enlace dinámico se mantiene ante cambios de precio o estado',
      'vCard en el cartel para contacto inmediato con el agente',
      'Haga seguimiento del interés por barrio',
      'Protección con contraseña para previsualizaciones off-market',
    ],
    steps: [
      'Cree un QR de URL a su página del anuncio',
      'Añada la vCard del agente como pieza impresa secundaria',
      'Colóquelos en carteles, cajas de llaves y mailings',
      'Pause o redirija cuando el anuncio se cierre',
    ],
  },
  'healthcare-patient-info': {
    title: 'Información al paciente en sanidad',
    headline: 'Instrucciones postconsulta que los pacientes sí abren',
    metaDescription:
      'Códigos QR sanitarios para educación del paciente, reserva de citas e inicio de sesión en el portal. Flujos conscientes de HIPAA/RGPD con enlaces protegidos por contraseña.',
    keywords: ['QR sanidad', 'QR educación paciente', 'QR clínica'],
    description:
      'Comparta instrucciones de cuidados, formularios y citas de seguimiento sin instalar apps. Actualice el contenido cuando cambien los protocolos.',
    benefits: [
      'QR PDF para instrucciones de alta',
      'Enlaces protegidos por contraseña para documentos sensibles',
      'URL de reserva con analítica por clínica',
      'Imprima en folletos y carteles de sala de espera',
    ],
    steps: [
      'Suba el PDF de educación del paciente o la URL del portal',
      'Active la contraseña si el contenido es sensible',
      'Imprima en materiales de consulta y lobby',
      'Revise tendencias de escaneo por departamento',
    ],
  },
  'museum-exhibits': {
    title: 'Guías de audio para museos y exposiciones',
    headline: 'Historias más ricas detrás de cada pieza',
    metaDescription:
      'Códigos QR de museo para cartelas, guías de audio y páginas de donación. Sin app — funciona en los teléfonos de los visitantes.',
    keywords: ['QR museo', 'QR etiqueta exposición', 'QR guía de audio galería'],
    description:
      'Los visitantes escanean para historias de objetos, vídeos, traducciones e información de entrada programada. Cambie el contenido al rotar las exposiciones.',
    benefits: [
      'Landings multilingües por exposición',
      'Enlaces de donación y membresía',
      'Estilos de QR de alto contraste para poca luz',
      'Analítica por zona de galería',
    ],
    steps: [
      'Cree códigos URL o PDF por exposición',
      'Añada audio/vídeo en una landing móvil',
      'Imprima en cartelas y señalética de entrada',
      'Actualice cuando cambien las piezas',
    ],
  },
  'social-media-growth': {
    title: 'Crecimiento de seguidores en redes sociales',
    headline: 'Convierta fans offline en seguidores',
    metaDescription:
      'Códigos QR de Instagram, TikTok y LinkedIn para packaging, carteles y displays retail. Haga crecer sus redes desde puntos de contacto físicos.',
    keywords: ['marketing QR Instagram', 'QR redes sociales', 'QR cartel TikTok'],
    description:
      'Enlace directamente a perfiles, reels o páginas link-in-bio. Haga seguimiento de qué tiendas o campañas generan más follows.',
    benefits: [
      'Tipos de QR dedicados para Instagram, TikTok y LinkedIn',
      'Hub de enlaces para varios botones sociales',
      'Marcos con colores de marca para displays retail',
      'Analítica de escaneos por ubicación',
    ],
    steps: [
      'Elija el tipo de QR de perfil social que necesite',
      'Introduzca el usuario o la URL del perfil',
      'Imprima en packaging, tickets y señalética',
      'Compare el volumen de escaneos por canal',
    ],
  },
  'app-download-campaign': {
    title: 'Campañas de descarga de apps',
    headline: 'Un QR para las tiendas iOS y Android',
    metaDescription:
      'Códigos QR de descarga de apps para carteles, anuncios de TV y packaging. Enrutamiento inteligente a la tienda de apps correcta.',
    keywords: ['QR descarga de app', 'QR App Store', 'QR marketing app móvil'],
    description:
      'Envíe a los usuarios a la ficha correcta de la tienda desde cualquier ubicación impresa o exterior. Cambie las URL de las tiendas al publicar nuevas versiones.',
    benefits: [
      'Redirección dinámica a App Store o Play Store',
      'Códigos específicos de campaña para atribución',
      'Landing de respaldo para escáneres de escritorio',
      'Exportación de alta resolución para vallas',
    ],
    steps: [
      'Cree un QR de descarga de app con enlaces a las tiendas',
      'Diseñe un código destacado para impresión de gran formato',
      'Distribuya códigos únicos por ubicación publicitaria',
      'Supervise instalaciones mediante picos de escaneo',
    ],
  },
  'feedback-surveys': {
    title: 'Feedback de clientes y encuestas',
    headline: 'Más reseñas y respuestas a encuestas',
    metaDescription:
      'Códigos QR para reseñas de Google, encuestas NPS y formularios de feedback en tickets, mesas y packaging. Cierre el círculo más rápido.',
    keywords: ['QR feedback', 'QR encuesta', 'QR reseña Google'],
    description:
      'Facilite dejar una reseña o completar una encuesta justo después de la compra o el servicio.',
    benefits: [
      'Enlace a Google, Trustpilot o Typeform',
      'Avisos en cara de mesa tras la comida',
      'Envíe envíos de encuesta a Slack por webhook',
      'Haga seguimiento de la tasa de respuesta por ubicación',
    ],
    steps: [
      'Cree un QR de URL a su formulario de reseña o encuesta',
      'Imprima en tickets, packaging o tarjetas de mesa',
      'Use códigos separados por ubicación',
      'Haga seguimiento de alertas de baja puntuación por webhook',
    ],
  },
  'employee-onboarding': {
    title: 'Onboarding de empleados y RR. HH.',
    headline: 'Onboarding sin papel para nuevas contrataciones',
    metaDescription:
      'Códigos QR de RR. HH. para manuales de empleado, inscripción de beneficios y configuración de TI. Actualice políticas sin reimprimir carpetas.',
    keywords: ['QR onboarding empleado', 'QR manual RR. HH.', 'QR lugar de trabajo'],
    description:
      'Las nuevas contrataciones escanean manuales, portales de beneficios, Wi‑Fi y solicitudes de equipo — todo desde una hoja de bienvenida.',
    benefits: [
      'Manual PDF con enlace siempre actualizado',
      'QR Wi‑Fi para conectividad el primer día',
      'Documentos internos protegidos con contraseña',
      'SSO del espacio de trabajo para despliegues de equipo',
    ],
    steps: [
      'Agrupe el PDF del manual y los enlaces del portal',
      'Imprima en packs de bienvenida y credenciales',
      'Restrinja enlaces sensibles con contraseña',
      'Actualice destinos cuando cambien las políticas',
    ],
  },
  'nonprofit-donations': {
    title: 'Campañas de donación para ONG',
    headline: 'Donaciones sin fricción desde carteles y eventos',
    metaDescription:
      'Códigos QR de fundraising para páginas de donación, donaciones recurrentes y ticketing de eventos. Haga seguimiento del rendimiento por ubicación.',
    keywords: ['QR donación', 'QR fundraising', 'QR organización benéfica'],
    description:
      'Los seguidores escanean para donar, registrarse en caminatas o compartir historias de campaña en redes sociales.',
    benefits: [
      'Enlace a una plataforma de donación o pago',
      'Registro de eventos con añadir al calendario',
      'Imprima en carteles, huchas y mailings',
      'Campañas geovalladas para capítulos locales',
    ],
    steps: [
      'Cree un QR de URL a su flujo de donación',
      'Aplique colores y logo de la organización',
      'Despliegue en impresión y señalética del evento',
      'Reporte totales de escaneo a patrocinadores',
    ],
  },
  'education-campus': {
    title: 'Orientación y recursos en el campus',
    headline: 'Ayude a los estudiantes a encontrar aulas y recursos',
    metaDescription:
      'Códigos QR universitarios para mapas del campus, materiales de curso, altas en clubes y calendarios de eventos. Actualice cada semestre con facilidad.',
    keywords: ['QR campus', 'QR universidad', 'QR escuela'],
    description:
      'Coloque códigos en edificios, syllabi y flyers de clubes para mapas, enlaces al LMS y horarios de tutoría.',
    benefits: [
      'El QR de ubicación abre mapas con pin del edificio',
      'Syllabi PDF y listas de lectura',
      'Hubs de enlaces de clubes para presencia multicanal',
      'Analítica por edificio o departamento',
    ],
    steps: [
      'Cree códigos QR de mapa para edificios principales',
      'Enlace los PDF de syllabus de cada curso',
      'Imprima en materiales de orientación',
      'Actualice los enlaces cada semestre',
    ],
  },
  'logistics-tracking': {
    title: 'Etiquetas de logística y almacén',
    headline: 'Escanee para seguir palés y envíos',
    metaDescription:
      'Códigos QR de logística para seguimiento de envíos, documentos de recepción y checklists de seguridad. Enlaces dinámicos para páginas de estado en vivo.',
    keywords: ['QR logística', 'QR etiqueta almacén', 'QR seguimiento de envío'],
    description:
      'Los operarios escanean etiquetas para instrucciones de picking, fichas MSDS o portales de prueba de entrega.',
    benefits: [
      'URL dinámica única por lote de envío',
      'Fichas de seguridad PDF bajo demanda',
      'Creación masiva por API para tiradas de etiquetas',
      'Envíe eventos de escaneo al WMS por webhook',
    ],
    steps: [
      'Cree códigos URL en masa vía CSV o API',
      'Enlace a páginas de seguimiento o checklist',
      'Imprima en etiquetas y señalética de muelle',
      'Integre webhooks de escaneo con el WMS',
    ],
  },
  'video-marketing': {
    title: 'Marketing de vídeo y YouTube',
    headline: 'Reproduzca su historia desde cualquier pieza impresa',
    metaDescription:
      'Códigos QR de YouTube y vídeo para packaging, carteles y displays retail. Genere visualizaciones desde puntos de contacto offline.',
    keywords: ['QR YouTube', 'QR marketing de vídeo', 'QR a vídeo'],
    description:
      'Conecte campañas impresas directamente con demos de producto, testimonios o vídeos how-to en YouTube o su sitio.',
    benefits: [
      'Tipo de QR dedicado a canal o vídeo de YouTube',
      'Landing con reproductor integrado',
      'Haga seguimiento de qué ubicaciones generan views',
      'Actualice la URL del vídeo sin reimprimir',
    ],
    steps: [
      'Cree un QR de YouTube o URL a su vídeo',
      'Use un CTA de reproducción en la landing',
      'Imprima en packaging y displays retail',
      'Compare tasas de escaneo entre SKUs',
    ],
  },
  'whatsapp-support': {
    title: 'Atención al cliente por WhatsApp',
    headline: 'Permita que los clientes le escriban al instante',
    metaDescription:
      'Códigos QR de WhatsApp para etiquetas de producto, tickets y escaparates. Mensajes prellenados para pedidos y soporte.',
    keywords: ['QR WhatsApp', 'QR WhatsApp Business', 'QR atención al cliente'],
    description:
      'Los compradores escanean para abrir WhatsApp con su número de empresa y un mensaje preescrito de pedido o soporte.',
    benefits: [
      'Plantillas de mensaje prellenadas por SKU',
      'Funciona en packaging y tarjetas de visita',
      'Haga seguimiento del volumen de escaneos por tienda',
      'Variantes de mensaje multilingües mediante enrutamiento',
    ],
    steps: [
      'Cree un QR de WhatsApp con su número de empresa',
      'Defina el mensaje predeterminado para pedidos o soporte',
      'Imprima en etiquetas, escaparates y tickets',
      'Redirija escaneos fuera de horario a una página de FAQ',
    ],
  },
};
