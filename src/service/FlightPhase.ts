import { emptyLoad } from '../data/A10C';
import {
  PhaseType,
  StoresConfiguration,
  QNH,
  QNH_Unit,
  IWind,
  IAircraftStore,
} from '../components/models';
import { IFlightPhase } from 'src/components/models';

export class FlightPhase implements IFlightPhase {
  label: string;
  comment: string;
  type: PhaseType;

  startWeight = 0;
  fuelOnBoard = 0;
  fuelUsed = 0;
  distance = 0;
  duration = 0;
  fuelFlow = 0;
  drag = 0;
  headwind = 0;
  machSpeed = 0;
  trueAirSpeed = 0;
  altitude = 0;
  qnh: QNH = { unit: QNH_Unit.hPa, value: 1013 };
  wind: IWind = { direction: 0, speed: 0 };

  course = 0;

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

  constructor(label: string, comment: string, type: PhaseType) {
    this.label = label;
    this.comment = comment;
    this.type = type;
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

  refuel(fuel: number) {
    this.fuelOnBoard += fuel;
  }

  dumpFuel(fuel: number) {
    this.fuelOnBoard -= fuel;
  }

  getEndingWeight() {
    return (
      this.startWeight -
      this.fuelUsed -
      this.jettisonStores.reduce((acc, store) => acc + store.weight, 0)
    );
  }

  getRemainingFuel() {
    return this.fuelOnBoard - this.fuelUsed;
  }

  getEndingDrag() {
    return (
      this.drag -
      this.jettisonStores.reduce((acc, store) => acc + store.drag, 0)
    );
  }
}
