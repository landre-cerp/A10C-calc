import {
  PosNegCorrectionTable,
  CorrectionTable,
  CorrectionVector,
  DragCorrectionTable,
} from '../CorrectionTable';

export const ClimbDistanceNeeded = (
  startingAlt: number,
  tartgetAlt: number,
  startingWeight: number,
  deltaTemp: number,
  drag: number
): number => {

  const target_distanceNeeded = Math.max(0, climbDistanceDragTable.getLinear(drag, startingWeight, tartgetAlt));
  const start_distanceNeeded = Math.max(0, climbDistanceDragTable.getLinear(drag, startingWeight, startingAlt));

  let distanceNeeded = target_distanceNeeded - start_distanceNeeded;

  if (deltaTemp != 0) {
    distanceNeeded = posNegCorrectionTable.GetLinear(distanceNeeded, deltaTemp);
  }
  // TODO : Check if this is correct , negative distance is not possible are not ok .

  return distanceNeeded < 0 ? 0 : Math.ceil(distanceNeeded * 10) / 10;
};

const climbDistGrab0 = new CorrectionTable(
  'Climb Distance Grab 0 correction',
  new Map([
    [
      25000,
      new CorrectionVector([-7.81, 2.25e-3, -3.03e-7, 1.2e-11, -1.72e-16]),
    ],
    [
      30000,
      new CorrectionVector([0.643, 7.03e-4, 8.33e-10, -5.96e-13, 3.94e-17]),
    ],

    [
      35000,
      new CorrectionVector([-12.1, 3.26e-3, -4.77e-7, 2.18e-11, -3.64e-16]),
    ],
    [
      40000,
      new CorrectionVector([3.75, -8.38e-4, 2.94e-7, -1.68e-11, 3.5e-16]),
    ],

    [
      45000,
      new CorrectionVector([16.7, -4.8e-3, 7.54e-7, -3.91e-11, 7.67e-16]),
    ],
    [50000, new CorrectionVector([17.5, -5.13e-3, 8.18e-7, -4.3e-11, 9e-16])],
  ])
);

const climbDistGrab4 = new CorrectionTable(
  'Climb Distance Grab 4 correction',
  new Map([
    [
      25000,
      new CorrectionVector([-0.353, 3.49e-4, -1.57e-7, 7.85e-12, -1.39e-16]),
    ],

    [
      30000,
      new CorrectionVector([0.104, 5.37e-4, 5.35e-8, -3.81e-12, 1.01e-16]),
    ],
    [
      35000,
      new CorrectionVector([0.426, 5.02e-5, 1.78e-7, -1.14e-11, 2.57e-16]),
    ],
    [
      40000,
      new CorrectionVector([0.0801, 2.34e-4, 1.98e-7, -1.33e-11, 3.21e-16]),
    ],
    [
      45000,
      new CorrectionVector([-0.0397, 1.7e-3, -6.28e-8, 2.3e-12, 6.67e-17]),
    ],
    [
      50000,
      new CorrectionVector([0.0972, 7.7e-4, 1.91e-7, -1.64e-11, 5.5e-16]),
    ],
  ])
);

const climbDistGrab8 = new CorrectionTable(
  'CLB Distance Drag 8 Correction',
  new Map([
    [
      25000,
      new CorrectionVector([-0.0284, 5.13e-4, 2.82e-9, 2.55e-13, 1.44e-17]),
    ],
    [
      30000,
      new CorrectionVector([0.225, 3.74e-5, 1.55e-7, -9.45e-12, 2.04e-16]),
    ],
    [
      35000,
      new CorrectionVector([0.0617, 8.58e-4, 3.23e-8, -3.26e-12, 1.3e-16]),
    ],
    [40000, new CorrectionVector([0.278, -7.85e-4, 4.39e-7, -3e-11, 6.94e-16])],
    [
      45000,
      new CorrectionVector([9.92e-3, 1.01e-3, 1.21e-7, -1.09e-11, 3.83e-16]),
    ],

    [
      50000,
      new CorrectionVector([-2.22e-32, 1.79e-3, -9.92e-8, 8.33e-12, -3.33e-17]),
    ],
  ])
);

const climbDistanceDragTable = new DragCorrectionTable(
  'Drag correction table for climb distance',
  new Map([
    [0, climbDistGrab0],
    [4, climbDistGrab4],
    [8, climbDistGrab8],
  ])
);

const posNegCorrectionTable = new PosNegCorrectionTable(
  'Climb Distance Air temperture correction table',
  new CorrectionTable(
    'climb distance positive correction',
    new Map([
      [0, new CorrectionVector([0, 0])],
      [25, new CorrectionVector([25, 0.25])],
      [50, new CorrectionVector([50, 1.1])],
      [75, new CorrectionVector([75, 2.0])],
      [100, new CorrectionVector([100, 3.6])],
      [125, new CorrectionVector([125, 5.5])],
    ])
  ),

  new CorrectionTable(
    'climb distance positive correction',
    new Map([
      [0, new CorrectionVector([0, 0])],
      [25, new CorrectionVector([25, 0.25])],
      [50, new CorrectionVector([50, 0.5])],
      [75, new CorrectionVector([75, 0.875])],
      [100, new CorrectionVector([100, 1.38])],
      [125, new CorrectionVector([125, 2.25])],
    ])
  )
);
