export interface StarPoint {
  x: number;
  y: number;
  label?: string;
}

export interface ConstellationLine {
  from: number; // Index of the starting point
  to: number;   // Index of the ending point
}

export interface Constellation {
  id: 'orion' | 'ursa-major' | 'cassiopeia';
  name: string;
  subtitle: string;
  stars: StarPoint[];
  lines: ConstellationLine[];
}
