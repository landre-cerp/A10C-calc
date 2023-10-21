import {
  CorrectionTable,
  CorrectionVector,
  DragCorrectionTable,
} from '../CorrectionTable';

export const OptimumCruiseAltitude = (
  drag: number,
  weight: number,
  distance: number
): number => {

  const optimumCruiseAlt = optimmumCruiseDragTable.getLinear(drag, distance, weight)
  return Math.ceil(optimumCruiseAlt / 10) * 10;
};

const optimumCruiseAltDrag0 = new CorrectionTable(
  'Optimum Cruise Altitude for Short Range Missions Drag 0',
  new Map([
    [50, new CorrectionVector([19700, -0.35])],
    [75, new CorrectionVector([27500, -0.428])],
    [100, new CorrectionVector([34740, -0.494])],
    [125, new CorrectionVector([38300, -0.516])],
    [150, new CorrectionVector([42250, -0.56])],
    [200, new CorrectionVector([47700, -0.6])],
  ])
);

const optimumCruiseAltDrag2 = new CorrectionTable(
  'Optimum Cruise Altitude for Short Range Missions Drag 2',
  new Map([
    [50, new CorrectionVector([19720, -0.368])],
    [75, new CorrectionVector([27500, -0.428])],
    [100, new CorrectionVector([34500, -0.478])],
    [125, new CorrectionVector([39860, -0.536])],
    [150, new CorrectionVector([43780, -0.568])],
    [200, new CorrectionVector([49000, -0.6])],
  ])
);

const optimumCruiseAltDrag4 = new CorrectionTable(
  'Optimum Cruise Altitude for Short Range Missions Drag 4',
  new Map([
    [50, new CorrectionVector([17440, -0.318])],
    [75, new CorrectionVector([26600, -0.412])],
    [100, new CorrectionVector([34610, -0.48])],
    [125, new CorrectionVector([40200, -0.526])],
    [150, new CorrectionVector([44880, -0.568])],
    [200, new CorrectionVector([46850, -0.53])],
  ])
);

const optimumCruiseAltDrag6 = new CorrectionTable(
  'Optimum Cruise Altitude for Short Range Missions Drag 6',
  new Map([
    [50, new CorrectionVector([17390, -0.34])],
    [75, new CorrectionVector([26280, -0.408])],
    [100, new CorrectionVector([34590, -0.476])],
    [125, new CorrectionVector([41000, -0.534])],
    [150, new CorrectionVector([46610, -0.582])],
    [200, new CorrectionVector([52700, -0.63])],
  ])
);

const optimumCruiseAltDrag8 = new CorrectionTable(
  'Optimum Cruise Altitude for Short Range Missions Drag 8',
  new Map([
    [50, new CorrectionVector([15150, -0.298])],
    [75, new CorrectionVector([26120, -0.416])],
    [100, new CorrectionVector([34500, -0.478])],
    [125, new CorrectionVector([41380, -0.542])],
    [150, new CorrectionVector([48820, -0.602])],
  ])
);

const optimmumCruiseDragTable = new DragCorrectionTable(
  'Optimum Cruise Altitude for Short Range Missions',
  new Map([
    [0, optimumCruiseAltDrag0],
    [2, optimumCruiseAltDrag2],
    [4, optimumCruiseAltDrag4],
    [6, optimumCruiseAltDrag6],
    [8, optimumCruiseAltDrag8],
  ])
);
