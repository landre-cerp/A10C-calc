import { PhaseType } from './../components/models';
import { FlightPhase } from './FlightPhase';

import { useAirportStore } from 'src/stores/Airport';
import { useA10CStore } from './../stores/a10c';
const aircraft = useA10CStore();
const airport = useAirportStore();

export class TakeOffPhase extends FlightPhase {
  constructor() {
    super('Take Off', 'Taxi and takeoff', PhaseType.TAKEOFF);
    this.startWeight = aircraft.TakeOffWeight;
    this.fuelOnBoard = aircraft.FuelWeight;
    this.distance = 2;
    this.duration = 1;
    this.fuelUsed = aircraft.taxiFuel + 200;
    this.drag = aircraft.Drag;
    this.wind = airport.Wind;
  }
}
