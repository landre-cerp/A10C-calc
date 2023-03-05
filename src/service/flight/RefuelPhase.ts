
import { PhaseType } from 'src/components/models';
import { FlightPhase } from '../FlightPhase';


export class RefuelPhase extends FlightPhase {

  constructor(previous: FlightPhase) {
    super('Refuel', 'Air refuelling', PhaseType.REFUEL, previous);

    this.altitude = this.getStartingAltitude();
    this.distance = this.Distance();
    this.fuelUsed = this.FuelUsed();
    this.duration = this.Duration();
    this.fuelFlow = (this.FuelUsed() / this.Duration()) * 60;
  }


  private FuelUsed(): number {

    return this.fuelUsed;
  }

  private Duration(): number {

    return this.duration;
  }

  private Distance(): number {
    return this.distance;
  }

  Recalc() {
    this.fuelUsed = this.FuelUsed();
    this.duration = this.Duration();
    this.distance = this.Distance();
  }



}
