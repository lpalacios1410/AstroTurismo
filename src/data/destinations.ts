import type { Destination } from '../types/destination';

export const destinations: Destination[] = [
  {
    id: 'lofoten',
    title: 'Lofoten',
    location: 'Noruega · 68°N',
    description:
      'Archipiélago sobre el Círculo Polar Ártico donde la aurora boreal danza entre picos de granito y fiordos espejo. Cielos sin contaminación con la Vía Láctea cruzando el horizonte.',
    bortleClass: 2,
    image: '/images/lofoten.svg',
  },
  {
    id: 'denali',
    title: 'Denali',
    location: 'Alaska · 63°N',
    description:
      'La montaña más alta de Norteamérica custodia los cielos más oscuros del continente. Lluvias de meteoros y estrellas tan densas que el polvo interestelar se dibuja a simple vista.',
    bortleClass: 1,
    image: '/images/denali.svg',
  },
  {
    id: 'vatnajokull',
    title: 'Vatnajökull',
    location: 'Islandia · 64°N',
    description:
      'El mayor glaciar de Europa: silencio absoluto y eclipses totales bajo un manto de hielo azul. Expediciones de invierno al corazón del parque nacional.',
    bortleClass: 2,
    image: '/images/vatnajokull.svg',
  },
];

export const bortleLabel: Record<Destination['bortleClass'], string> = {
  1: 'Cielo prístino',
  2: 'Cielo oscuro',
  3: 'Cielo rural',
};
