import { PhaseType } from 'src/components/models';
import { useTakeOffStore } from 'src/stores/Airport';

import { ClimbDistanceNeeded } from '../calculators/climb/ClimbDistance';
import { ClimbFuelUsed } from '../calculators/climb/ClimbFuel';
import { ClimbTimeNeeded } from '../calculators/climb/ClimbTime';
import { FlightPhase } from '../FlightPhase';

const airport = useTakeOffStore();

export class ClimbPhase extends FlightPhase {
  constructor(previous: FlightPhase) {
    super('Climb', 'Climb to cruise altitude', PhaseType.CLIMB, previous);

    this.fuelUsed = this.FuelUsed();
    this.duration = this.Duration();
    this.distance = this.Distance();

    this.fuelFlow = (this.FuelUsed() / this.Duration()) * 60;
  }

  private FuelUsed(): number {
    this.fuelUsed = ClimbFuelUsed(
      this.getStartingAltitude(),
      this.altitude,
      this.getStartingWeight(),
      airport.DeltaTemp,
      this.drag
    );

    this.fuelFlow = (this.fuelUsed / this.Duration()) * 60;
    return this.fuelUsed;
  }

  private Duration(): number {
    this.duration = ClimbTimeNeeded(
      this.getStartingAltitude(),
      this.altitude,
      this.getStartingWeight(),
      airport.DeltaTemp,
      this.drag
    );
    return this.duration;
  }

  private Distance(): number {
    this.distance = ClimbDistanceNeeded(
      this.getStartingAltitude(),
      this.altitude,
      this.getStartingWeight(),
      airport.DeltaTemp,
      this.drag
    );
    return this.distance;
  }

  Recalc() {
    this.FuelUsed();
    this.Duration();
    this.Distance();
    this.fuelFlow = (this.fuelUsed / this.duration) * 60;
  }
}
