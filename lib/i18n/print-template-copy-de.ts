import type { TranslationTree } from './types';

export const printTemplateCopyDe: TranslationTree = {
  'a4-portrait': {
    name: 'A4-Poster',
    description: '210 × 297 mm — Wand & Schaufenster',
    physicalSize: 'A4',
    useCase: 'Poster, Schaufenster, Eingang',
  },
  'a4-landscape': {
    name: 'A4 Querformat',
    description: '297 × 210 mm — Gartenschilder & horizontal',
    physicalSize: 'A4 quer',
    useCase: 'Gartenschild, Fahrzeugaufkleber',
  },
  'a5-flyer': {
    name: 'A5-Flyer',
    description: '148 × 210 mm — Handouts & Beilagen',
    physicalSize: 'A5',
    useCase: 'Flyer, Einladungsbeilage',
  },
  'desk-stand': {
    name: 'Tischaufsteller',
    description: 'Tischaufsteller — falten & aufstellen',
    physicalSize: 'A4 Aufsteller',
    useCase: 'Restaurant-Tisch, Lobby',
  },
  rollup: {
    name: 'Roll-up-Vorschau',
    description: '85 × 200 cm skalierte Vorschau',
    physicalSize: '85×200 cm',
    useCase: 'Event-Eingang, Messe',
  },
  story: {
    name: 'Story / Vertikal',
    description: '1080 × 1920 — Social & Displays',
    physicalSize: '9:16',
    useCase: 'Instagram Story, Digitalscreen',
  },
  'business-card': {
    name: 'Visitenkarte',
    description: '85 × 55 mm — Kontakt & Networking',
    physicalSize: '85×55 mm',
    useCase: 'Visitenkarte, Badge',
  },
  sticker: {
    name: 'Sticker / Etikett',
    description: '76 × 76 mm — Verpackung & Regal',
    physicalSize: '3×3 in',
    useCase: 'Produktetikett, WLAN-Sticker',
  },
  'table-card': {
    name: 'Tischkarte',
    description: '100 × 150 mm — Theke & Spiegel-Aufkleber',
    physicalSize: '100×150 mm',
    useCase: 'Café-Theke, Salon-Rezeption',
  },
};
