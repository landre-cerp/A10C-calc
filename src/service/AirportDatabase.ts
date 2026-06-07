export interface Runway {
  qfu: number;    // runway heading in degrees (e.g. 28 → 280°)
  tora: number;   // Take-Off Run Available (ft)
  toda: number;   // Take-Off Distance Available (ft)
  lda: number;    // Landing Distance Available (ft)
  asda?: number;  // Accelerate-Stop Distance Available (ft)
  surface?: string;
}

export interface SavedAirport {
  id: string;
  name: string;
  icao: string;
  elevation: number; // ft
  runways: Runway[];
}

export function emptyRunway(): Runway {
  return { qfu: 0, tora: 0, toda: 0, lda: 0, surface: '' };
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
