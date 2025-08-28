import { PhaseType } from 'src/components/models';
import { FlightPhase } from '../FlightPhase';
import {
  DistancePenetrationDescent,
  FuelPenetrationDescent,
  TimePenetrationDescent,
} from '../../modules/a10c/descent/PenetrationDescent';

export class DescentPhase extends FlightPhase {
  constructor(previous: FlightPhase) {
    super('Descent', 'Descent to lower altitude', PhaseType.DESCENT, previous);

    this.altitude = this.getStartingAltitude();
    this.fuelUsed = this.FuelUsed();
    this.duration = this.Duration();
  }

  // Generic helper method to calculate values with intermediate calculations
  private calculateDescentValue<T extends number>(
    calculator: (weight: number, drag: number, altitude: number) => T,
  ): T {
    let intermediateValue = 0;

    if (this.getEndingAltitude() !== 0) {
      intermediateValue = calculator(
        this.getStartingWeight(),
        this.drag,
        this.getEndingAltitude(),
      );
    }

    const totalValue = calculator(
      this.getStartingWeight(),
      this.drag,
      this.getStartingAltitude(),
    );

    return Math.ceil(totalValue - intermediateValue) as T;
  }

  private FuelUsed(): number {
    return this.calculateDescentValue(FuelPenetrationDescent);
  }

  private Duration(): number {
    return this.calculateDescentValue(TimePenetrationDescent);
  }

  private Distance(): number {
    return this.calculateDescentValue(DistancePenetrationDescent);
  }

  Recalc() {
    this.fuelUsed = this.FuelUsed();
    this.duration = this.Duration();
    this.distance = this.Distance();
    this.fuelFlow = (this.fuelUsed / this.duration) * 60;
  }

  ChangeDistance(distance: number) {
    this.distance = distance;
    this.Recalc();
  }
}
