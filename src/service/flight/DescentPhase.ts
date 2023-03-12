
import { PhaseType } from 'src/components/models';
import { FlightPhase } from '../FlightPhase';
import { DistancePenetrationDescent, FuelPenetrationDescent, TimePenetrationDescent } from 'src/service/calculators/descent/PenetrationDescent'

export class DescentPhase extends FlightPhase {

  constructor(previous: FlightPhase) {
    super('Descent', 'Descent to lower altitude', PhaseType.DESCENT, previous);

    this.altitude = this.getStartingAltitude();
    this.fuelUsed = this.FuelUsed();
    this.duration = this.Duration();

  }

  private FuelUsed(): number {
    let interMediateFuel = 0;

    if (this.getEndingAltitude() != 0) {
      interMediateFuel = FuelPenetrationDescent(this.getStartingWeight(), this.drag, this.getEndingAltitude());
    }

    const fuelUsed = FuelPenetrationDescent(this.getStartingWeight(), this.drag, this.getStartingAltitude()) - interMediateFuel;

    return Math.ceil(fuelUsed);
  }

  private Duration(): number {

    let intermediateTime = 0;
    if (this.getEndingAltitude() != 0) {
      intermediateTime = TimePenetrationDescent(this.getStartingWeight(), this.drag, this.getEndingAltitude());
    }

    const interm = TimePenetrationDescent(this.getStartingWeight(), this.drag, this.getStartingAltitude());

    return Math.ceil(interm - intermediateTime);

  }

  private Distance(): number {
    let intermediateDistance = 0;
    if (this.getEndingAltitude() != 0) {
      intermediateDistance = DistancePenetrationDescent(this.getStartingWeight(), this.drag, this.getEndingAltitude());
    }

    const distance = DistancePenetrationDescent(this.getStartingWeight(), this.drag, this.getStartingAltitude()) - intermediateDistance;

    return Math.ceil(distance);



  }

  Recalc() {
    this.fuelUsed = this.FuelUsed();
    this.duration = this.Duration();
    this.distance = this.Distance();
    this.fuelFlow = this.distance / this.duration * 60;
  }

  ChangeDistance(distance: number) {
    this.distance = distance;
    this.Recalc();
  }

}
