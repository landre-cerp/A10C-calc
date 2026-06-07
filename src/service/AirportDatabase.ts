export interface Runway {
  qfu: number;    // runway heading in degrees (e.g. 049)
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

/** QFU → runway designator, e.g. 049 → "05", 360 → "36" */
export function rwyName(qfu: number): string {
  let n = Math.round(qfu / 10) % 36;
  if (n === 0) n = 36;
  return n.toString().padStart(2, '0');
}

/** Reciprocal QFU, e.g. 049 → 229 */
export function reciprocalQfu(qfu: number): number {
  return (qfu + 180) % 360;
}

export function emptyRunway(): Runway {
  return { qfu: 0, tora: 0, toda: 0, lda: 0 };
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
