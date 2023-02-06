import {
  TempCorrectionTable,
  CorrectionTable,
  CorrectionVector,
  DragCorrectionTable,
} from './CorrectionTable';

export const ClimbTimeNeeded = (
  startingAlt: number,
  tartgetAlt: number,
  startingWeight: number,
  deltaTemp: number,
  drag: number
): number => {
  // Select equation vectors for the Aircraft Drag

  const [v, vnext, step, startDrag] = climbTimeDragTable.getInterval(drag);
  console.log('v', v, vnext, step, startDrag);
  let target_timeNeeded = v.GetLinear(startingWeight, tartgetAlt);
  let start_timeNeeded = v.GetLinear(startingWeight, startingAlt);
  console.log('target_timeNeeded', target_timeNeeded);
  console.log('start_timeNeeded', start_timeNeeded);

  start_timeNeeded = start_timeNeeded < 0 ? 0 : start_timeNeeded;

  if (step != 0) {
    const target_nexttimeNeeded = vnext.GetLinear(startingWeight, tartgetAlt);
    const start_nexttimeNeeded = vnext.GetLinear(startingWeight, startingAlt);

    const target_increment = (target_nexttimeNeeded - target_timeNeeded) / step;
    const start_increment = (start_nexttimeNeeded - start_timeNeeded) / step;

    target_timeNeeded =
      target_timeNeeded +
      (target_increment > 0 ? target_increment * (drag - startDrag) : 0);
    start_timeNeeded =
      start_timeNeeded +
      (start_increment > 0 ? start_increment * (drag - startDrag) : 0);
  }
  let timeNeeded = target_timeNeeded - start_timeNeeded;

  if (deltaTemp > 0) {
    timeNeeded = tempCorrectionTable.GetLinear(timeNeeded, deltaTemp);
  }

  return timeNeeded < 0 ? 0 : Math.ceil(timeNeeded);
};

const v_climb_time_drag0 = new CorrectionTable(
  'Climb time for Drag 0',
  new Map([
    [25000, new CorrectionVector([0.0714, 2.19e-4, -6.23e-9, 2.83e-13])],
    [30000, new CorrectionVector([-0.557, 3.76e-4, -1.73e-8, 5.47e-13])],
    [35000, new CorrectionVector([0.0857, 5.38e-4, -3.56e-8, 1.07e-12])],
    [40000, new CorrectionVector([-0.933, 7.9e-4, -4.67e-8, 1.36e-12])],
    [45000, new CorrectionVector([-2.33, 1.16e-3, -7.17e-8, 2.07e-12])],
    [50000, new CorrectionVector([-1.16, 7.94e-4, -4.11e-8, 1.6e-12])],
  ])
);

const v_climb_time_drag4 = new CorrectionTable(
  'Climb time for drage 4',
  new Map([
    [25000, new CorrectionVector([-1.16, 7.94e-4, -4.11e-8, 1.6e-12])],
    [30000, new CorrectionVector([-1.29, 5.79e-4, -3.26e-8, 9.09e-13])],
    [35000, new CorrectionVector([-0.914, 7.94e-4, -5.37e-8, 1.51e-12])],
    [40000, new CorrectionVector([-1.67, 1.03e-3, -7.02e-8, 2.04e-12])],
    [45000, new CorrectionVector([-4.67, 1.81e-3, -1.2e-7, 3.26e-12])],
    [50000, new CorrectionVector([-1.44, 9.13e-4, -5.74e-8, 2.4e-12])],
  ])
);

const v_climb_time_drag8 = new CorrectionTable(
  'Climb time for drage 8',
  new Map([
    [25000, new CorrectionVector([-4.14, 1.3e-3, -7.87e-8, 1.68e-12])],
    [30000, new CorrectionVector([-3.04, 1.03e-3, -6.15e-8, 1.49e-12])],
    [35000, new CorrectionVector([-1.03, 7.2e-4, -4.6e-8, 1.41e-12])],
    [40000, new CorrectionVector([-4.13, 1.67e-3, -1.22e-7, 3.41e-12])],
    [45000, new CorrectionVector([-1.72, 9.3e-4, -5.9e-8, 2.2e-12])],
    [50000, new CorrectionVector([-9.2, 3.5e-3, -2.95e-7, 8.93e-12])],
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

const tempCorrectionTable = new TempCorrectionTable(
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
      [5, new CorrectionVector([250, 2.5])],
      [10, new CorrectionVector([500, 2.5])],
      [15, new CorrectionVector([750, 3.75])],
      [20, new CorrectionVector([1000, 6.25])],
      [25, new CorrectionVector([1250, 7.5])],
      [30, new CorrectionVector([1500, 12.5])],
      [35, new CorrectionVector([1750, 15])],
    ])
  )
);
