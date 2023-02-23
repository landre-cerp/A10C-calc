import { CorrectionTable, CorrectionVector } from './CorrectionTable';
/**
90,4 + 0,974x + 1,64E-04x^2 + -2,68E-08x^3 + 1,77E-12x^4
14,2 + 1,4x + -6,25E-06x^2 + -6,23E-09x^3 + 1,63E-12x^4
-5,23 + 1,24x + 2,33E-04x^2 + -6,23E-08x^3 + 7,03E-12x^4
118 + 0,11x + 1,53E-03x^2 + -4,66E-07x^3 + 4,81E-11x^4
 */

export const obstacleDistanceClearance = (
  distance: number,
  altitude: number
): number => {
  return obstacleDistanceClearanceTable.GetLinear(altitude, distance);
};

const obstacleDistanceClearanceTable: CorrectionTable = new CorrectionTable(
  'Obstacle Distance Clearance',
  new Map([
    [-20, new CorrectionVector([90.4, 0.974, 1.64e-4, -2.68e-8, 1.77e-12])],
    [0, new CorrectionVector([14.2, 1.4, -6.25e-6, -6.23e-9, 1.63e-12])],
    [20, new CorrectionVector([-5.23, 1.24, 2.33e-4, -6.23e-8, 7.03e-12])],
    [40, new CorrectionVector([118, 0.11, 1.53e-3, -4.66e-7, 4.81e-11])],
  ])
);
