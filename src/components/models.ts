// Store because it's the real name

export interface IAircraftStore {
  label: string;
  weight: number;
  drag: number;
  type: LoadType;
  training: boolean;
  laserGuided: boolean;
  gpsGuided: boolean;
  availableOn: number[] | null;
}

export enum LoadType {
  AA_Missiles,
  Bombs,
  Pods,
  AG_Missile,
  Rockets,
  Fuel_Tanks,
}

export interface IA10CPylons {
  pylonsLoad:
    | [
        IAircraftStore,
        IAircraftStore,
        IAircraftStore,
        IAircraftStore,
        IAircraftStore,
        IAircraftStore,
        IAircraftStore,
        IAircraftStore,
        IAircraftStore,
        IAircraftStore,
        IAircraftStore
      ];
}

export enum QNH_Unit {
  hPa,
  inMg,
}

export interface QNH {
  value: number;
  unit: QNH_Unit;
}

export enum PhaseType {
  TAXI,
  CLIMB,
  CRUISE,
  ONZONE,
  RTB,
  DESCENT,
}

export interface FlightPhase {
  label: string;
  comment: string;
  type: PhaseType;
  startWeight: number;
  FuelOnBoard: number;
  FuelUsed: number;
  Distance: number;
  Duration: number;
  FuelFlow: number;
  Drag: number;
}
