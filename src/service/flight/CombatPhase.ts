import { PhaseType } from 'src/components/models';

import { FlightPhase } from '../FlightPhase';

export class CombatPhase extends FlightPhase {
  constructor(previous: FlightPhase) {
    super('hi_combat', 'Hi combat phase', PhaseType.HI_COMBAT, previous);
    this.FuelUsed();
  }

  private FuelUsed(): number {
    this.fuelUsed = (this.fuelFlow * this.duration) / 60;
    return this.fuelUsed;
  }

  Recalc() {
    this.FuelUsed();
  }

  ChangeDistance(distance: number) {
    this.distance = distance;
    this.Recalc();
  }

  ChangeDuration(duration: number) {
    this.duration = duration;
    this.Recalc();
  }
}
