import { bilinearInterpolate, Table2D } from '../BilinearInterpolation.js';
import {
  GroundWindCorrectionTable,
  RcrDistanceCorrectionTable,
} from './SharedTables.js';

const CriticalFieldLengthTable: Table2D = {
  xAxis: [4, 5, 6, 7, 8, 9, 10, 11],
  yAxis: [30000, 35000, 40000, 45000, 50000],
  matrix: [
    [6500, -1, -1, -1, -1],
    [5860, 8640, -1, -1, -1],
    [5185, 7430, -1, -1, -1],
    [4500, 6300, 8700, -1, -1],
    [3800, 5270, 7175, 9845, -1],
    [3100, 4230, 5700, 7530, 10180],
    [2400, 3200, 4200, 5340, 6920],
    [1670, 2200, 2740, 3260, 3920],
  ],
};

export const CriticalFieldLength = (
  takeoffindex: number,
  weight: number,
  rcr: number,
  wind: number,
): number => {
  const baseDistance = bilinearInterpolate(
    CriticalFieldLengthTable,
    takeoffindex,
    weight,
  );

  if (baseDistance === -1) {
    return -1;
  }

  const windCorrected = bilinearInterpolate(
    GroundWindCorrectionTable,
    baseDistance,
    wind,
  );

  if (windCorrected === -1) {
    return -1;
  }

  return bilinearInterpolate(RcrDistanceCorrectionTable, windCorrected, rcr);
};
