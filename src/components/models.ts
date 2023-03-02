// Store because it's the real name

export interface IAircraftStore {
  short: string;
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

export interface StoresConfiguration {
  name: string;
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
  TAKEOFF,
  CLIMB,
  CRUISE,
  COMBAT,
  DESCENT,
  REFUEL,
  LANDING,
}

export interface IFlightPhase {
  label: string;
  comment: string;
  type: PhaseType;
  fuelUsed: number;
  distance: number;
  duration: number;
  fuelFlow: number;
  drag: number;
  wind: IWind;
  machSpeed: number;
  trueAirSpeed: number;
  altitude: number;

  Recalc(): void;

  getStartingWeight(): number;
  getFuelOnBoard(): number;
  getStartingAltitude(): number;

  setStartWeight(weight: number): void;
  setFuelOnBoard(fuel: number): void;
  setStartingAltitude(altitude: number): void;
}

export interface IWind {
  direction: number;
  speed: number;

  Headwind(aircraftCourse: number): number;
}
