import type { Constellation } from '../types/constellation';

export const constellations: Constellation[] = [
  {
    id: 'orion',
    name: 'Orión',
    subtitle: 'El cazador — visible en invierno desde ambos hemisferios',
    stars: [
      { x: 48, y: 10, label: 'Betelgeuse' },
      { x: 74, y: 16, label: 'Bellatrix' },
      { x: 58, y: 46, label: 'Alnitak' },
      { x: 52, y: 42, label: 'Alnilam' },
      { x: 47, y: 38, label: 'Mintaka' },
      { x: 66, y: 90, label: 'Saiph' },
      { x: 40, y: 86, label: 'Rigel' },
    ],
    lines: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 0 },
      { from: 2, to: 5 },
      { from: 4, to: 6 },
    ],
  },
  {
    id: 'ursa-major',
    name: 'Osa Mayor',
    subtitle: 'El gran carro — guía hacia la Estrella Polar',
    stars: [
      { x: 26, y: 22, label: 'Dubhe' },
      { x: 18, y: 40, label: 'Merak' },
      { x: 34, y: 54, label: 'Phecda' },
      { x: 44, y: 42, label: 'Megrez' },
      { x: 58, y: 50, label: 'Alioth' },
      { x: 70, y: 62, label: 'Mizar' },
      { x: 84, y: 56, label: 'Alkaid' },
    ],
    lines: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
    ],
  },
  {
    id: 'cassiopeia',
    name: 'Casiopea',
    subtitle: 'La reina encadenada — en el corazón de la Vía Láctea',
    stars: [
      { x: 18, y: 66, label: 'Segin' },
      { x: 38, y: 42, label: 'Ruchbah' },
      { x: 50, y: 74, label: 'Tshih' },
      { x: 64, y: 44, label: 'Schedar' },
      { x: 82, y: 66, label: 'Caph' },
    ],
    lines: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
    ],
  },
];

export const constellationById = (id: Constellation['id']) =>
  constellations.find((c) => c.id === id);
