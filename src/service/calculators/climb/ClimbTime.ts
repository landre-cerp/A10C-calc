import {
  PosNegCorrectionTable,
  CorrectionTable,
  CorrectionVector,
  DragCorrectionTable,
} from '../CorrectionTable';

export const ClimbTimeNeeded = (
  startingAlt: number,
  tartgetAlt: number,
  startingWeight: number,
  deltaTemp: number,
  drag: number
): number => {

  const target_timeNeeded = climbTimeDragTable.getLinear(drag, startingWeight, tartgetAlt);
  const start_timeNeeded = climbTimeDragTable.getLinear(drag, startingWeight, startingAlt);
  let timeNeeded = target_timeNeeded - start_timeNeeded;

  if (deltaTemp != 0) {
    timeNeeded = posNegCorrectionTable.GetLinear(timeNeeded, deltaTemp);
  }

  return timeNeeded < 0 ? 0 : Math.ceil(timeNeeded);
};

const v_climb_time_drag0 = new CorrectionTable(
  'Climb time for Drag 0',
  new Map([
    [
      25000,
      new CorrectionVector([-0.0109, 2.51e-4, -9.51e-9, 4.01e-13, -1.4e-18]),
    ],

    [
      30000,
      new CorrectionVector([-0.0109, 2.51e-4, -9.51e-9, 4.01e-13, -1.4e-18]),
    ],
    [
      35000,
      new CorrectionVector([-0.0114, 5.81e-4, -4.05e-8, 1.27e-12, -2.73e-18]),
    ],
    [
      40000,
      new CorrectionVector([-0.0238, 5.15e-4, -2.03e-8, 3.56e-13, 1.33e-17]),
    ],
    [
      45000,
      new CorrectionVector([0.00866, 3.4e-4, 1.77e-8, -1.72e-12, 5.45e-17]),
    ],
    [
      50000,
      new CorrectionVector([0.00397, 3.44e-4, 1.49e-8, -1.16e-12, 4.67e-17]),
    ],
  ])
);

const v_climb_time_drag4 = new CorrectionTable(
  'Climb time for drage 4',
  new Map([
    [
      25000,
      new CorrectionVector([0.0357, 1.74e-4, 3.01e-9, -2.51e-13, 9.79e-18]),
    ],
    [
      30000,
      new CorrectionVector([0.0249, 1.73e-4, 3.82e-9, -3.2e-13, 1.38e-17]),
    ],
    [
      35000,
      new CorrectionVector([0.0341, 2.98e-4, 1.95e-9, -7.02e-13, 2.88e-17]),
    ],
    [
      40000,
      new CorrectionVector([-0.0119, 4.76e-4, -1.25e-8, -3.33e-13, 3.33e-17]),
    ],
    [
      45000,
      new CorrectionVector([0.0455, 2.73e-4, 2.75e-8, -2.4e-12, 7.64e-17]),
    ],
    [
      50000,
      new CorrectionVector([7.05e-18, 3.7e-4, 8.67e-9, -8e-13, 5.33e-17]),
    ],
  ])
);

const v_climb_time_drag8 = new CorrectionTable(
  'Climb time for drage 8',

  new Map([
    [
      25000,
      new CorrectionVector([0.148, -7.37e-5, 4.72e-8, -2.63e-12, 4.9e-17]),
    ],
    [
      30000,
      new CorrectionVector([0.0795, -3.99e-5, 4.76e-8, -2.7e-12, 5.36e-17]),
    ],
    [
      35000,
      new CorrectionVector([2.16e-3, 3.6e-4, -6.98e-9, -2.4e-13, 2.36e-17]),
    ],
    [
      40000,
      new CorrectionVector([8.66e-3, 2.33e-4, 3.37e-8, -3.18e-12, 9.45e-17]),
    ],
    // -0,0218 + 3,54E-04x + 4,31E-09x^2 + -6,04E-13x^3 + 4,33E-17x^4
    [
      45000,
      new CorrectionVector([-0.0218, 3.54e-4, 4.31e-9, -6.04e-13, 4.33e-17]),
    ],

    [
      50000,
      new CorrectionVector([0.0278, -5.7e-5, 1.48e-7, -1.28e-11, 3.67e-16]),
    ],
  ])
);

const climbTimeDragTable = new DragCorrectionTable(
  'Drag correction table for climb time',
  new Map([
    [0, v_climb_time_drag0],
    [4, v_climb_time_drag4],
    [8, v_climb_time_drag8],
  ])
);

const posNegCorrectionTable = new PosNegCorrectionTable(
  'Climb time Air temperture correction table',
  new CorrectionTable(
    'climb time positive correction',
    new Map([
      [0, new CorrectionVector([0, 0])],
      [5, new CorrectionVector([5, 0.1])],
      [10, new CorrectionVector([10, 0.2])],
      [15, new CorrectionVector([15, 0.3])],
      [20, new CorrectionVector([20, 0.45])],
      [25, new CorrectionVector([25, 0.65])],
      [30, new CorrectionVector([30, 0.85])],
      [35, new CorrectionVector([35, 1.1])],
    ])
  ),
  new CorrectionTable(
    'climb time positive correction',
    new Map([
      [0, new CorrectionVector([0, 0])],
      [5, new CorrectionVector([5, 0.05])],
      [10, new CorrectionVector([10, 0.1])],
      [15, new CorrectionVector([15, 0.1])],
      [20, new CorrectionVector([20, 0.2])],
      [25, new CorrectionVector([25, 8, 0.25])],
      [30, new CorrectionVector([30, 8, 0.36])],
      [35, new CorrectionVector([35, 8, 0.45])],
    ])
  )
);
