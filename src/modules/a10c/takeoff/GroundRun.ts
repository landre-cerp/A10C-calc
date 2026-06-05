import { bilinearInterpolate, Table2D } from '../BilinearInterpolation.js';
import { FLAPS } from './TakeoffEnums.js';
import { GroundWindCorrectionTable } from './SharedTables.js';

const FlapsTOGroundRunTable: Table2D = {
  xAxis: [4, 4.2, 5, 6, 7, 8, 9, 10, 11],
  yAxis: [30000, 35000, 40000, 45000, 50000],
  matrix: [
    [4500, 6800, 9900, 15000, -1],
    [4450, 6650, 9700, 14000, -1],
    [4000, 5900, 8500, 12200, -1],
    [3500, 5100, 7250, 10200, -1],
    [2980, 4300, 6100, 8300, 11700],
    [2400, 3500, 4900, 6600, 9200],
    [1900, 2750, 3800, 5000, 6900],
    [1350, 1950, 2650, 3500, 4600],
    [800, 1200, 1600, 2000, 2500],
  ],
};

const FlapsUPGroundRunTable: Table2D = {
  xAxis: [4, 5, 6, 7, 8, 9, 10, 11],
  yAxis: [30000, 35000, 40000, 45000, 50000],
  matrix: [
    [4800, 7400, 11000, -1, -1],
    [4260, 6420, 9300, 13350, -1],
    [3720, 5530, 7900, 10950, -1],
    [3170, 4620, 6560, 9050, 12740],
    [2600, 3770, 5280, 7270, 9880],
    [2070, 2910, 4050, 5570, 7340],
    [1510, 2070, 2850, 3860, 4940],
    [970, 1240, 1680, 2150, 2650],
  ],
};

const GROUND_RUN_TABLES: readonly Table2D[] = [
  FlapsUPGroundRunTable,
  FlapsTOGroundRunTable,
];

export const GroundRunWithFlaps = (
  takeoffIndex: number,
  weight: number,
  headWind = 0,
  flaps: FLAPS = FLAPS.TO,
): number => {
  const groundRun = bilinearInterpolate(
    GROUND_RUN_TABLES[flaps],
    takeoffIndex,
    weight,
  );

  if (groundRun === -1) {
    return -1;
  }

  if (groundRun < 1000) {
    return groundRun;
  }

  return bilinearInterpolate(GroundWindCorrectionTable, groundRun, headWind);
};

export const GroundRun = (
  takeoffIndex: number,
  weight: number,
  headWind = 0,
): number => GroundRunWithFlaps(takeoffIndex, weight, headWind, FLAPS.TO);
