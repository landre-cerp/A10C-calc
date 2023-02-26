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
  RTB,
  DESCENT,
  REFUEL,
  LANDING,
}

export interface IFlightPhase {
  label: string;
  comment: string;
  type: PhaseType;
  startWeight: number;
  fuelOnBoard: number;
  fuelUsed: number;
  distance: number;
  duration: number;
  fuelFlow: number;
  drag: number;
  wind: IWind;
  machSpeed: number;
  trueAirSpeed: number;
  altitude: number;
}

export interface IWind {
  direction: number;
  speed: number;
}
