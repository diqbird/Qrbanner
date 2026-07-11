import type { TranslationTree } from './types';

export const printTemplateCopyEs: TranslationTree = {
  'a4-portrait': {
    name: 'Póster A4',
    description: '210 × 297 mm — pared y escaparate',
    physicalSize: 'A4',
    useCase: 'Póster, escaparate, entrada',
  },
  'a4-landscape': {
    name: 'A4 horizontal',
    description: '297 × 210 mm — carteles de jardín y formato horizontal',
    physicalSize: 'A4 horizontal',
    useCase: 'Cartel de jardín, vinilo de vehículo',
  },
  'a5-flyer': {
    name: 'Folleto A5',
    description: '148 × 210 mm — reparto e insertos',
    physicalSize: 'A5',
    useCase: 'Folleto, inserto de invitación',
  },
  'desk-stand': {
    name: 'Expositor de mesa',
    description: 'Tent card — doble y coloque en pie',
    physicalSize: 'A4 tent',
    useCase: 'Mesa de restaurante, lobby',
  },
  rollup: {
    name: 'Vista previa roll-up',
    description: 'Vista previa a escala 85 × 200 cm',
    physicalSize: '85×200 cm',
    useCase: 'Entrada de evento, feria',
  },
  story: {
    name: 'Story / vertical',
    description: '1080 × 1920 — redes sociales y pantallas',
    physicalSize: '9:16',
    useCase: 'Story de Instagram, pantalla digital',
  },
  'business-card': {
    name: 'Tarjeta de visita',
    description: '85 × 55 mm — contacto y networking',
    physicalSize: '85×55 mm',
    useCase: 'Tarjeta de visita, credencial',
  },
  sticker: {
    name: 'Pegatina / etiqueta',
    description: '76 × 76 mm — embalaje y estantería',
    physicalSize: '3×3 in',
    useCase: 'Etiqueta de producto, pegatina Wi‑Fi',
  },
  'table-card': {
    name: 'Tarjeta de mesa',
    description: '100 × 150 mm — mostrador y recepción',
    physicalSize: '100×150 mm',
    useCase: 'Mostrador de cafetería, recepción de salón',
  },
};
