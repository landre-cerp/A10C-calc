import { PhaseType } from 'src/components/models';

import { FlightPhase } from './FlightPhase';

export class CombatPhase extends FlightPhase {
  constructor(previous: FlightPhase) {
    super('Hi Combat', 'Hi combat phase', PhaseType.COMBAT, previous);
  }

  private FuelUsed(): number {
    this.fuelUsed = (this.fuelFlow * this.Duration()) / 60;
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

  ChangeDistance(distance: number) {
    this.distance = distance;
    this.Recalc();
  }

  ChangeDuration(duration: number) {
    this.duration = duration;
    this.Recalc();
  }
}
