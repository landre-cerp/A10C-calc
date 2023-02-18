import {
  CorrectionTable,
  CorrectionVector,
  DragCorrectionTable,
  TempCorrectionTable,
} from './CorrectionTable';

export const ClimbFuelUsed = (
  startingAlt: number,
  TartgetAlt: number,
  startingWeight: number,
  deltaTemp: number,
  drag: number
): number => {
  const [v, vnextDrag, step, startDrag] = climbFuelDragTable.getInterval(drag);

  let target_fuelUsed = v.GetLinear(startingWeight, TartgetAlt);
  let start_fuelUsed = v.GetLinear(startingWeight, startingAlt);

  start_fuelUsed = start_fuelUsed < 0 ? 0 : start_fuelUsed;

  if (step != 0) {
    const target_nextfuelUsed = vnextDrag.GetLinear(startingWeight, TartgetAlt);
    const start_nextfuelUsed = vnextDrag.GetLinear(startingWeight, startingAlt);

    const target_increment = (target_nextfuelUsed - target_fuelUsed) / step;
    const start_increment = (start_nextfuelUsed - start_fuelUsed) / step;

    target_fuelUsed =
      target_fuelUsed +
      (target_increment > 0 ? target_increment * (drag - startDrag) : 0);

    start_fuelUsed =
      start_fuelUsed +
      (start_increment > 0 ? start_increment * (drag - startDrag) : 0);
  }

  let fuelUsed = target_fuelUsed - start_fuelUsed;

  if (deltaTemp > 0) {
    fuelUsed = tempCorrectionTable.GetLinear(fuelUsed, deltaTemp);
  }

  // round to Highest 10th
  fuelUsed = Math.ceil(fuelUsed / 10) * 10;

  return fuelUsed < 0 ? 0 : Math.ceil(fuelUsed);
};

const vectors_Climb_Drag0 = new CorrectionTable(
  'Climb Fuel Used Drag 0',
  new Map([
    [25000, new CorrectionVector([-102, 0.0435, -1.59e-6, 2.9e-11])],
    [30000, new CorrectionVector([-58.9, 0.0383, -1.18e-6, 2.53e-11])],
    [35000, new CorrectionVector([-128, 0.0678, -3.13e-6, 6.74e-11])],
    [40000, new CorrectionVector([-35.7, 0.0534, -2.16e-6, 5.89e-11])],
    [45000, new CorrectionVector([-60, 0.0621, -2.61e-6, 8e-11])],
    [50000, new CorrectionVector([-63.3, 0.0784, -4.21e-6, 1.39e-10])],
  ])
);

const vectors_Climb_Drag4 = new CorrectionTable(
  'Climb Fuel Used Drag 4',
  new Map([
    [25000, new CorrectionVector([-75, 0.0401, -1.43e-6, 2.98e-11])],
    [30000, new CorrectionVector([-38.9, 0.0382, -1.23e-6, 3.02e-11])],
    [35000, new CorrectionVector([-143, 0.0639, -2.55e-6, 5.89e-11])],
    [40000, new CorrectionVector([-112, 0.0663, -2.79e-6, 7.7e-11])],
    [45000, new CorrectionVector([-40, 0.0548, -1.71e-6, 6.67e-11])],
    [50000, new CorrectionVector([-197, 0.103, -5.17e-6, 1.67e-10])],
  ])
);

const vectors_Climb_Drag8 = new CorrectionTable(
  'Climb Fuel Used Drag 8',
  new Map([
    [25000, new CorrectionVector([-101, 0.0476, -1.82e-6, 3.74e-11])],
    [30000, new CorrectionVector([-185, 0.0714, -3.12e-6, 6.54e-11])],
    [35000, new CorrectionVector([-63.3, 0.049, -1.55e-6, 4.41e-11])],
    [40000, new CorrectionVector([-193, 0.0966, -5.36e-6, 1.49e-10])],
    [45000, new CorrectionVector([-168, 0.0973, -5.14e-6, 1.6e-10])],
    [50000, new CorrectionVector([-5, 0.0562, -1.5e-6, 9.33e-12])],
  ])
);

const climbFuelDragTable = new DragCorrectionTable(
  'Climb Fuel Used Drag Correction Table',
  new Map([
    [0, vectors_Climb_Drag0],
    [4, vectors_Climb_Drag4],
    [8, vectors_Climb_Drag8],
  ])
);

const tempCorrectionTable = new TempCorrectionTable(
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
    ])
  ),
  new CorrectionTable(
    'climb distance positive correction',
    new Map([
      [250, new CorrectionVector([250, 2.5])],
      [500, new CorrectionVector([500, 2.5])],
      [750, new CorrectionVector([750, 3.75])],
      [1000, new CorrectionVector([1000, 6.25])],
      [1250, new CorrectionVector([1250, 7.5])],
      [1500, new CorrectionVector([1500, 12.5])],
      [1750, new CorrectionVector([1750, 15])],
      [2000, new CorrectionVector([1987, 20])],
    ])
  )
);
