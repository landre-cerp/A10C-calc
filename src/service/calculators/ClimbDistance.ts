import {
  PosNegCorrectionTable,
  CorrectionTable,
  CorrectionVector,
  DragCorrectionTable,
} from "./CorrectionTable";

export const ClimbDistanceNeeded = (
  startingAlt: number,
  tartgetAlt: number,
  startingWeight: number,
  deltaTemp: number,
  drag: number
): number => {
  const [v, vnext, step, startDrag] = climbDistanceDragTable.getInterval(drag);

  let target_distanceNeeded = v.GetLinear(startingWeight, tartgetAlt);
  let start_distanceNeeded = v.GetLinear(startingWeight, startingAlt);

  start_distanceNeeded = start_distanceNeeded < 0 ? 0 : start_distanceNeeded;

  if (step != 0) {
    const target_nextdistanceNeeded = vnext.GetLinear(
      startingWeight,
      tartgetAlt
    );
    const start_nextdistanceNeeded = vnext.GetLinear(
      startingWeight,
      startingAlt
    );

    const target_increment =
      (target_nextdistanceNeeded - target_distanceNeeded) / step;
    const start_increment =
      (start_nextdistanceNeeded - start_distanceNeeded) / step;

    target_distanceNeeded =
      target_distanceNeeded +
      (target_increment > 0 ? target_increment * (drag - startDrag) : 0);

    start_distanceNeeded =
      start_distanceNeeded +
      (start_increment > 0 ? start_increment * (drag - startDrag) : 0);
  }

  let distanceNeeded = target_distanceNeeded - start_distanceNeeded;

  if (deltaTemp != 0) {
    distanceNeeded = posNegCorrectionTable.GetLinear(distanceNeeded, deltaTemp);
  }

  return distanceNeeded < 0 ? 0 : Math.ceil(distanceNeeded);
};

const climbDistGrab0 = new CorrectionTable(
  "Climb Distance Grab 0 correction",
  new Map([
    [25000, new CorrectionVector([-10.4, 3.11e-3, 1.65e-7, 3.48e-12])],
    [30000, new CorrectionVector([-2.14, 1.59e-3, -8.43e-8, 2.56e-12])],
    [35000, new CorrectionVector([-13.6, 4.9e-3, -3.09e-7, 7.33e-12])],
    [40000, new CorrectionVector([-12, 4.59e-3, -2.9e-7, 7.67e-12])],
    [45000, new CorrectionVector([-17.8, 7.08e-3, -5.25e-7, 1.45e-11])],
    [50000, new CorrectionVector([-6.8, 4.04e-3, -2.98e-7, 1.1e-11])],
  ])
);

const climbDistGrab4 = new CorrectionTable(
  "Climb Distance Grab 4 correction",
  new Map([
    [25000, new CorrectionVector([-12.2, 3.61e-3, -2.03e-7, 4.39e-12])],
    [30000, new CorrectionVector([-6.14, 2.63e-3, -1.55e-7, 4.11e-12])],
    [35000, new CorrectionVector([-14.1, 5.12e-3, -3.41e-7, 8.56e-12])],
    [40000, new CorrectionVector([-13.3, 4.98e-3, -3.24e-7, 8.96e-12])],
    [45000, new CorrectionVector([-2.8, 2.62e-3, -1.63e-7, 6.67e-12])],
    [50000, new CorrectionVector([-12.4, 5.77e-3, -4.48e-7, 1.57e-11])],
  ])
);

const climbDistGrab8 = new CorrectionTable(
  "CLB Distance Drag 8 Correction",
  new Map([
    [25000, new CorrectionVector([-1.29, 8.82e-4, -3.07e-8, 1.44e-12])],
    [30000, new CorrectionVector([-12.3, 4.24e-3, -2.66e-7, 6.56e-12])],
    [35000, new CorrectionVector([-5, 2.7e-3, -1.74e-7, 5.67e-12])],
    [40000, new CorrectionVector([-27.3, 9.18e-3, -6.7e-7, 1.77e-11])],
    [45000, new CorrectionVector([-10.1, 4.85e-3, -3.5e-7, 1.2e-11])],
    [50000, new CorrectionVector([0.5, 1.58e-3, -7e-8, 6.67e-12])],
  ])
);

const climbDistanceDragTable = new DragCorrectionTable(
  "Drag correction table for climb distance",
  new Map([
    [0, climbDistGrab0],
    [4, climbDistGrab4],
    [8, climbDistGrab8],
  ])
);

const posNegCorrectionTable = new PosNegCorrectionTable(
  "Climb Distance Air temperture correction table",
  new CorrectionTable(
    "climb distance positive correction",
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
    "climb distance positive correction",
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
