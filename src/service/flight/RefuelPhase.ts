
import { PhaseType } from 'src/components/models';
import { FlightPhase } from '../FlightPhase';


export class RefuelPhase extends FlightPhase {

  constructor(previous: FlightPhase) {
    super('Refuel', 'Air refuelling', PhaseType.REFUEL, previous);

    this.altitude = this.getStartingAltitude();

  }

  Recalc() {
    // this.FuelUsed();


  }



}
