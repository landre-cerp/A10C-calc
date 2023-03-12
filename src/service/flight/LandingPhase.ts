
import { PhaseType } from 'src/components/models';
import { FlightPhase } from '../FlightPhase';


export class LandingPhase extends FlightPhase {


  constructor(previous: FlightPhase) {
    super('Landing', 'Landing to Airport', PhaseType.LANDING, previous);

    this.altitude = this.getStartingAltitude();
    this.Distance();
    this.FuelUsed();
    this.Duration();
    this.fuelFlow = (this.fuelUsed / this.duration) * 60;
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
    this.FuelUsed();
    this.Duration();
    this.Distance();
  }

  ChangeDistance(distance: number) {
    this.distance = distance;
    this.Recalc();
  }


}
