import { bilinearInterpolate, Table2D } from '../BilinearInterpolation.js';
import { FLAPS, ThrustSetting } from './TakeoffEnums.js';

const xAxis = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000];
const yAxis = [-20, 0, 20, 40];

const FiftyFtClearanceFlapsToMaxThrustTable: Table2D = {
  xAxis,
  yAxis,
  matrix: [
    [0, 0, 0, 0],
    [1270, 1343, 1417, 1490],
    [2600, 2830, 3060, 3290],
    [3980, 4315, 4650, 5300],
    [5400, 5780, 6550, 7790],
    [6840, 7380, 8720, 11400],
    [8420, 9280, 11450, 17800],
    [9990, 11390, 15405, -1],
    [11870, 14180, 21920, -1],
    [14080, 18000, -1, -1],
    [17140, 23770, -1, -1],
    [21070, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
  ],
};

const FiftyFtClearanceFlapsTo3PercentBelowTable: Table2D = {
  xAxis,
  yAxis,
  matrix: [
    [0, 0, 0, 0],
    [1190, 1288, 1386, 1484],
    [2500, 2730, 2960, 3290],
    [3870, 4200, 4700, 5430],
    [5300, 5850, 6740, 8200],
    [6790, 7560, 9010, 12240],
    [8440, 9620, 12155, 20970],
    [10250, 12010, 16890, -1],
    [12210, 15040, -1, -1],
    [14500, 19040, -1, -1],
    [17390, -1, -1, -1],
    [20920, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
  ],
};

const FiftyFtClearanceFlapsUpMaxThrustTable: Table2D = {
  xAxis,
  yAxis,
  matrix: [
    [0, 0, 0, 0],
    [1110, 1200, 1290, 1380],
    [2436, 2639, 2842, 3045],
    [3670, 4000, 4330, 4950],
    [5100, 5580, 6020, 7715],
    [6500, 7105, 7930, 9960],
    [8030, 8770, 10110, 13130],
    [9560, 10680, 12710, 18250],
    [11250, 12900, 16200, -1],
    [13100, 15480, 20830, -1],
    [15200, 18800, -1, -1],
    [17650, 22650, -1, -1],
    [20650, -1, -1, -1],
    [24030, -1, -1, -1],
    [-1, -1, -1, -1],
  ],
};

const FiftyFtClearanceFlapsUp3PercentBelowTable: Table2D = {
  xAxis,
  yAxis,
  matrix: [
    [0, 0, 0, 0],
    [1280, 1393, 1507, 1620],
    [2590, 2860, 3123, 3390],
    [3920, 4260, 4600, 5250],
    [5290, 5720, 6370, 7430],
    [6690, 7320, 8360, 10110],
    [8230, 9110, 10660, 13950],
    [9820, 11000, 13290, 20910],
    [11640, 13220, 16820, -1],
    [13540, 15880, 22430, -1],
    [15730, 19120, -1, -1],
    [18380, 23620, -1, -1],
    [21580, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
  ],
};

const ObstacleClearanceTables: readonly (readonly Table2D[])[] = [
  [FiftyFtClearanceFlapsUpMaxThrustTable, FiftyFtClearanceFlapsUp3PercentBelowTable],
  [FiftyFtClearanceFlapsToMaxThrustTable, FiftyFtClearanceFlapsTo3PercentBelowTable],
];

export const obstacleDistanceClearanceWithOptions = (
  groundRun: number,
  windSpeed: number,
  flaps: FLAPS = FLAPS.TO,
  thrustSetting: ThrustSetting = ThrustSetting.Max,
): number =>
  bilinearInterpolate(
    ObstacleClearanceTables[flaps][thrustSetting],
    groundRun,
    windSpeed,
  );

export const obstacleDistanceClearance = (
  distance: number,
  altitude: number,
): number =>
  obstacleDistanceClearanceWithOptions(
    distance,
    altitude,
    FLAPS.TO,
    ThrustSetting.Max,
  );
