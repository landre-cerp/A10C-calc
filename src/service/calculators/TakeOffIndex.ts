import { CorrectionTable, CorrectionVector } from './CorrectionTable';
import { PerfCalculator, Altitude, DeltaT } from './perfCalculator';

export class TakeoffIndexCalculator extends PerfCalculator {
  constructor() {
    super(
      'Takeoff Index',
      new CorrectionTable(
        'Takeoff Index f(pressureAltitude, temp)',
        new Map([
          [0, new CorrectionVector([10.4, -0.0244, -4.01e-4])],
          [2000, new CorrectionVector([9.93, -0.0306, -3.8e-4])],
          [4000, new CorrectionVector([9.5, -0.0401, -4.81e-4])],
          [6000, new CorrectionVector([8.98, -0.0471, -6.2e-4])],
        ])
      )
    );
  }

  Calc(altitude: Altitude, deltaT: DeltaT): number {
    return this.correctionTable.GetLinear(altitude, deltaT);
  }
}
