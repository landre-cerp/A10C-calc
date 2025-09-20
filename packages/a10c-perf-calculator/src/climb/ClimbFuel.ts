import {
  CorrectionTable,
  CorrectionVector,
  DragCorrectionTable,
  PosNegCorrectionTable,
} from '../CorrectionTable.js';

export const ClimbFuelUsed = (
  startingAlt: number,
  TartgetAlt: number,
  startingWeight: number,
  deltaTemp: number,
  drag: number,
): number => {
  const target_fuelUsed = Math.max(
    0,
    climbFuelDragTable.getLinear(drag, startingWeight, TartgetAlt),
  );
  const start_fuelUsed = Math.max(
    0,
    climbFuelDragTable.getLinear(drag, startingWeight, startingAlt),
  );

  let fuelUsed = target_fuelUsed - start_fuelUsed;

  if (deltaTemp != 0) {
    fuelUsed = posNegCorrectionTable.GetLinear(fuelUsed, deltaTemp);
  }

  fuelUsed = Math.ceil(fuelUsed / 10) * 10;

  return fuelUsed < 0 ? 1 : Math.ceil(fuelUsed);
};

const vectors_Climb_Drag0 = new CorrectionTable(
  'Climb Fuel Used Drag 0',
  new Map([
    [
      25000,
      new CorrectionVector([-3.36, 0.0169, 5.85e-7, -3.98e-11, 7.39e-16]),
    ],
    [
      30000,
      new CorrectionVector([-4.31, 0.0255, -2.43e-7, -1.75e-12, 2.68e-16]),
    ],
    [35000, new CorrectionVector([-4.14, 0.026, 6.81e-7, -6.29e-11, 1.48e-15])],
    [40000, new CorrectionVector([-1.23, 0.0438, -1.32e-6, 3e-11, 3.41e-16])],
    [45000, new CorrectionVector([-1.14, 0.0415, -5.46e-7, 1.52e-12, 1e-15])],
    [
      50000,
      new CorrectionVector([-4.44, 0.0478, -3.27e-7, -4.28e-11, 2.79e-15]),
    ],
  ]),
);

const vectors_Climb_Drag4 = new CorrectionTable(
  'Climb Fuel Used Drag 4',
  new Map([
    [
      25000,
      new CorrectionVector([-1.46, 0.0165, 6.81e-7, -4.16e-11, 8.04e-16]),
    ],
    [
      30000,
      new CorrectionVector([-2.43, 0.0293, -5.55e-7, 1.01e-11, 2.05e-16]),
    ],
    [
      35000,
      new CorrectionVector([-1.27, 0.0169, 2.07e-6, -1.15e-10, 2.19e-15]),
    ],
    [
      40000,
      new CorrectionVector([-0.866, 0.0295, 1.05e-6, -8.05e-11, 2.21e-15]),
    ],
    [
      45000,
      new CorrectionVector([-0.198, 0.039, 2.64e-7, -3.15e-11, 1.67e-15]),
    ],
    [
      50000,
      new CorrectionVector([-0.496, 0.0304, 3.52e-6, -2.48e-10, 6.83e-15]),
    ],
  ]),
);

const vectors_Climb_Drag8 = new CorrectionTable(
  'Climb Fuel Used Drag 8',
  new Map([
    [25000, new CorrectionVector([5.48, 0.0123, 1.49e-6, -7.73e-11, 1.31e-15])],
    [30000, new CorrectionVector([10.4, 0.029, 2.99e-6, -1.47e-10, 2.43e-15])],
    [
      35000,
      new CorrectionVector([0.0541, 0.0271, 8.13e-7, -5.55e-11, 1.42e-15]),
    ],
    [
      40000,
      new CorrectionVector([0.703, 0.0287, 2.05e-6, -1.65e-10, 4.52e-15]),
    ],
    [
      45000,
      new CorrectionVector([-0.595, 0.0359, 2.14e-6, -1.86e-10, 5.67e-15]),
    ],
    [
      50000,
      new CorrectionVector([-2.25e-31, 0.0583, -1.79e-6, 1.1e-10, -3.33e-16]),
    ],
  ]),
);

const climbFuelDragTable = new DragCorrectionTable(
  'Climb Fuel Used Drag Correction Table',
  new Map([
    [0, vectors_Climb_Drag0],
    [4, vectors_Climb_Drag4],
    [8, vectors_Climb_Drag8],
  ]),
);

const posNegCorrectionTable = new PosNegCorrectionTable(
  'Climb Fuel  Air temperture correction table',
  new CorrectionTable(
    'climb distance positive correction',
    new Map([
      [250, new CorrectionVector([250, 2.5])],
      [500, new CorrectionVector([500, 5])],
      [750, new CorrectionVector([752, 7.5])],
      [1000, new CorrectionVector([1018, 12.5])],
      [1250, new CorrectionVector([1254, 21.3])],
      [1500, new CorrectionVector([1495, 27.5])],
      [1750, new CorrectionVector([1768, 39.5])],
      [2000, new CorrectionVector([2000, 55])],
    ]),
  ),
  new CorrectionTable(
    'climb distance negative correction',
    new Map([
      [250, new CorrectionVector([250, 2.5])],
      [500, new CorrectionVector([500, 2.5])],
      [750, new CorrectionVector([750, 3.75])],
      [1000, new CorrectionVector([1000, 6.25])],
      [1250, new CorrectionVector([1250, 7.5])],
      [1500, new CorrectionVector([1500, 12.5])],
      [1750, new CorrectionVector([1750, 15])],
      [2000, new CorrectionVector([1987, 20])],
    ]),
  ),
);
