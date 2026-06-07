export interface Runway {
  qfu: number;         // runway heading in degrees (e.g. 170)
  designator?: string; // user-defined name, e.g. "17L", "17R", "05" — falls back to computed
  tora: number;   // Take-Off Run Available (ft)
  toda: number;   // Take-Off Distance Available (ft)
  lda: number;    // Landing Distance Available (ft)
  asda?: number;  // Accelerate-Stop Distance Available (ft)
}

export interface SavedAirport {
  id: string;
  name: string;
  icao: string;
  elevation: number; // ft
  runways: Runway[];
}

/** QFU → computed runway designator, e.g. 049 → "05", 360 → "36" */
export function rwyName(qfu: number): string {
  let n = Math.round(qfu / 10) % 36;
  if (n === 0) n = 36;
  return n.toString().padStart(2, '0');
}

/** Reciprocal of a runway designator string, e.g. "17L" → "35R", "05" → "23" */
export function reciprocalDesignator(designator: string): string {
  const match = designator.match(/^(\d+)([LRC]?)$/i);
  if (!match) return designator;
  const num = parseInt(match[1]);
  const suffix = match[2].toUpperCase();
  const recipNum = num > 18 ? num - 18 : num + 18;
  const recipSuffix = suffix === 'L' ? 'R' : suffix === 'R' ? 'L' : suffix;
  return recipNum.toString().padStart(2, '0') + recipSuffix;
}

/** Reciprocal QFU, e.g. 049 → 229 */
export function reciprocalQfu(qfu: number): number {
  return (qfu + 180) % 360;
}

export function emptyRunway(): Runway {
  return { qfu: 0, designator: '', tora: 0, toda: 0, lda: 0, asda: 0 };
}

export function emptyAirport(): SavedAirport {
  return {
    id: crypto.randomUUID(),
    name: '',
    icao: '',
    elevation: 0,
    runways: [],
  };
}
