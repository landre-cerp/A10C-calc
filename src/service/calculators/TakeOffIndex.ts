import { CorrectionTable, CorrectionVector } from './CorrectionTable';
import { PerfCalculator, Altitude } from './perfCalculator';

export class TakeoffIndexCalculator extends PerfCalculator {
  constructor() {
    super(
      'Takeoff Index',
      new CorrectionTable(
        'Takeoff Index f(pressureAltitude, temp)',
        new Map([
          [0, new CorrectionVector([10.3, -0.0248, -3.62e-4])],
          [2000, new CorrectionVector([9.95, -0.0321, -4.18e-4])],
          [4000, new CorrectionVector([9.54, -0.0398, -5.24e-4])],
          [6000, new CorrectionVector([8.97, -0.0475, -6.12e-4])],
        ])
      )
    );
  }

  Calc(altitude: Altitude, temperature: number): number {
    return this.correctionTable.GetLinear(altitude, temperature);
  }
}
