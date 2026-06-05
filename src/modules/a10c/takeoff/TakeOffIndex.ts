import { CorrectionVector, ICorrectionTable } from '../CorrectionTable.js';
import { bilinearInterpolate, Table2D } from '../BilinearInterpolation.js';
import { PerfCalculator, Altitude } from '../perfCalculator.js';
import { ThrustSetting } from './TakeoffEnums.js';

const MaxThrustTable: Table2D = {
  xAxis: [-30, -20, -10, 0, 10, 20, 30, 40, 50],
  yAxis: [0, 2000, 4000, 6000],
  matrix: [
    [10.8, 10.6, 10.22, 9.82],
    [10.7, 10.4, 10.1, 9.6],
    [10.5, 10.2, 9.8, 9.37],
    [10.25, 9.82, 9.5, 8.9],
    [10.05, 9.6, 9.1, 8.4],
    [9.75, 9.2, 8.6, 7.82],
    [9.4, 8.7, 7.9, 7.1],
    [8.8, 8.1, 7.2, 6.1],
    [8.1, 7.21, 6.21, 5],
  ],
};

const ThreePercentBelowTable: Table2D = {
  xAxis: [-30, -20, -10, 0, 10, 20, 30, 40, 50],
  yAxis: [0, 2000, 4000, 5000],
  matrix: [
    [10.71, 10.4, 9.9, 9.41],
    [10.41, 10, 9.62, 9.18],
    [10.21, 9.8, 9.4, 8.7],
    [10, 9.4, 8.9, 8.2],
    [9.6, 9, 8.41, 7.62],
    [9.25, 8.78, 7.6, 6.85],
    [8.8, 7.95, 7, 5.9],
    [8.35, 7.2, 5.95, 4.7],
    [7.2, 6.18, 4.8, 4],
  ],
};

const TAKEOFF_INDEX_TABLES: readonly Table2D[] = [
  MaxThrustTable,
  ThreePercentBelowTable,
];

class BilinearTakeoffIndexTable implements ICorrectionTable {
  constructor(
    public name: string,
    private readonly thrustSetting: ThrustSetting,
  ) {}

  getInterval(): [CorrectionVector, CorrectionVector, number, number] {
    return [new CorrectionVector([]), new CorrectionVector([]), 0, 0];
  }

  GetLinear(intervalValue: number, value: number): number {
    return TakeoffIndex(intervalValue, value, this.thrustSetting);
  }
}

export const TakeoffIndex = (
  altitude: number,
  temp: number,
  thrustSetting: ThrustSetting = ThrustSetting.Max,
): number => {
  const value = bilinearInterpolate(
    TAKEOFF_INDEX_TABLES[thrustSetting],
    temp,
    altitude,
  );

  if (value === -1) {
    return -1;
  }

  return Math.min(11, Math.max(4, value));
};

export class TakeoffIndexCalculator extends PerfCalculator {
  constructor(private readonly thrustSetting: ThrustSetting = ThrustSetting.Max) {
    super(
      'Takeoff Index',
      new BilinearTakeoffIndexTable(
        'Takeoff Index f(pressureAltitude, temp)',
        thrustSetting,
      ),
    );
  }

  Calc(altitude: Altitude, temperature: number): number {
    return TakeoffIndex(altitude, temperature, this.thrustSetting);
  }
}
