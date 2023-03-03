import { Wind } from './Wind';
import { emptyLoad } from '../data/A10C';
import {
  PhaseType,
  StoresConfiguration,
  QNH,
  QNH_Unit,
  IAircraftStore,
} from '../components/models';
import { IFlightPhase } from 'src/components/models';

export const FlightGraph = [
  { start: PhaseType.TAKEOFF, next: [PhaseType.CLIMB] },
  { start: PhaseType.CLIMB, next: [PhaseType.CRUISE] },
  {
    start: PhaseType.CRUISE,
    next: [
      PhaseType.CLIMB,
      PhaseType.CRUISE,
      PhaseType.COMBAT,
      PhaseType.REFUEL,
      PhaseType.DESCENT,
    ],
  },
  { start: PhaseType.COMBAT, next: [PhaseType.CRUISE, PhaseType.CLIMB] },
  { start: PhaseType.DESCENT, next: [PhaseType.LANDING, PhaseType.CRUISE] },
  { start: PhaseType.REFUEL, next: [PhaseType.CRUISE] },
];

export abstract class FlightPhase implements IFlightPhase {
  label: string;
  comment: string;
  type: PhaseType;

  private startWeight = 0;
  private startingAltitude = 0;
  private fuelOnBoard = 0;

  fuelUsed = 0;
  fuelFlow = 0;
  refuelled = 0;

  distance = 0;
  duration = 0;
  drag = 0;

  machSpeed = 0;
  trueAirSpeed = 0;
  altitude = 0;

  qnh: QNH = { unit: QNH_Unit.hPa, value: 1013 };
  wind: Wind = new Wind(0, 0);

  course = 0;

  previousPhase: FlightPhase | null = null;
  nextPhase: FlightPhase | null = null;

  storesConfiguration: StoresConfiguration = {
    name: 'Stores Configuration',
    pylonsLoad: [
      emptyLoad,
      emptyLoad,
      emptyLoad,
      emptyLoad,
      emptyLoad,
      emptyLoad,
      emptyLoad,
      emptyLoad,
      emptyLoad,
      emptyLoad,
      emptyLoad,
    ],
  };

  jettisonStores = [] as IAircraftStore[];

  constructor(
    label: string,
    comment: string,
    type: PhaseType,
    previous: FlightPhase | null = null
  ) {
    this.label = label;
    this.comment = comment;
    this.type = type;
    this.previousPhase = previous;
    previous?.setNextPhase(this);
    if (previous) {
      this.altitude = previous.getStartingAltitude();
      this.storesConfiguration = previous.storesConfiguration;
      this.drag = previous.getEndingDrag();
    }
  }

  abstract Recalc(): void;

  setPreviousPhase(phase: FlightPhase) {
    this.previousPhase = phase;
  }
  setNextPhase(phase: FlightPhase) {
    this.nextPhase = phase;
  }

  getStartingWeight() {
    return this.previousPhase
      ? this.previousPhase.getEndingWeight()
      : this.startWeight;
  }

  ChangeAltidude(alt: number) {
    this.altitude = alt;
  }

  jettisonStore(numero: number) {
    this.jettisonStores.push(this.storesConfiguration.pylonsLoad[numero]);
    this.storesConfiguration.pylonsLoad[numero] = emptyLoad;
  }

  setStartingWeight(weight: number) {
    this.startWeight = weight;
  }

  setFuelOnBoard(fuel: number) {
    this.fuelOnBoard = fuel;
  }

  setStoresConfiguration(storesConfiguration: StoresConfiguration) {
    this.storesConfiguration = storesConfiguration;
  }

  dumpFuel(fuel: number) {
    this.fuelOnBoard -= fuel;
  }

  getEndingWeight(): number {
    return (
      this.getStartingWeight() -
      this.fuelUsed -
      this.jettisonStores.reduce((acc, store) => acc + store.weight, 0)
    );
  }

  getStartingAltitude() {
    return this.previousPhase
      ? this.previousPhase.getEndingAltitude()
      : this.startingAltitude;
  }

  getEndingAltitude() {
    return this.altitude;
  }

  getRemainingFuel() {
    return this.getFuelOnBoard() - this.fuelUsed + this.refuelled;
  }

  getFuelOnBoard(): number {
    return this.previousPhase
      ? this.previousPhase.getRemainingFuel()
      : this.fuelOnBoard;
  }

  getEndingDrag() {
    return (
      this.drag -
      this.jettisonStores.reduce((acc, store) => acc + store.drag, 0)
    );
  }

  setStartWeight(weight: number): void {
    this.startWeight = weight;
  }

  setStartingAltitude(altitude: number): void {
    this.startingAltitude = altitude;
  }

  RelativeHeadwind(): number {
    return this.wind.RelativeHeadwind(this.course);
  }


  ChangeFuelFlow(fuelFlow: number) {
    this.fuelFlow = fuelFlow;
  }

  ChangePhaseDuration(duration: number) {
    this.duration = duration;
  }

  Refuel(totalAfterRefuel: number) {
    this.refuelled = totalAfterRefuel;
  }
}
