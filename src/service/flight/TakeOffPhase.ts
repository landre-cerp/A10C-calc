import { FlightPhase } from '../FlightPhase';

import { Wind } from '../Wind';
import { PhaseType } from 'src/components/models';
import { ITakeOffContext } from './FlightContext';

export class TakeOffPhase extends FlightPhase {
  constructor(private context: ITakeOffContext) {
    super('takeoff', 'Taxi and takeoff', PhaseType.TAKEOFF);

    this.Recalc();
  }

  doRecalc() {
    this.setStartWeight(this.context.takeOffWeight);
    this.setFuelOnBoard(this.context.fuelWeight);
    this.setStartingAltitude(this.context.airportPressureAltitude);
    this.altitude = this.context.airportPressureAltitude;
    this.distance = 2;
    this.duration = 1;
    this.fuelUsed = this.context.taxiFuel + 200;
    this.drag = this.context.drag;
    this.course = this.context.runwayQFU;
    this.wind = new Wind(this.context.windDirection, this.context.windSpeed);
    this.storesConfiguration = this.context.configuration;
  }
}
