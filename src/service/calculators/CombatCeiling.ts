import {
  TempCorrectionTable,
  CorrectionVector,
  CorrectionTable,
} from './CorrectionTable';

export const combatCeiling = (
  startingWeight: number,
  deltaTemp: number,
  drag: number
): number => {
  let combatCeiling = vector_combatCeiling_drag.GetLinear(drag, startingWeight);

  if (deltaTemp > 0) {
    combatCeiling = tempCorrectionTable.GetLinear(combatCeiling, deltaTemp);
  }

  return combatCeiling;
};

const vector_combatCeiling_drag = new CorrectionTable(
  'Combat ceiling drag correction table',
  new Map([
    [0, new CorrectionVector([54857, -0.627])],
    [4, new CorrectionVector([54157, -0.657])],
    [8, new CorrectionVector([53464, -0.676])],
  ])
);

const tempCorrectionTable = new TempCorrectionTable(
  'Combat ceiling delta temp correction table',
  new CorrectionTable(
    ' positive correction table',

    new Map([
      [20000, new CorrectionVector([20000, -200])],
      [22500, new CorrectionVector([22500, -175])],
      [25000, new CorrectionVector([25000, -150])],
      [27500, new CorrectionVector([27500, -125])],
      [30000, new CorrectionVector([30000, -100])],
      [32500, new CorrectionVector([32500, -75])],
      [35000, new CorrectionVector([35000, -100])],
      [37500, new CorrectionVector([37500, -75])],
      [40000, new CorrectionVector([40000, -75])],
      [42500, new CorrectionVector([42500, -75])],
    ])
  ),

  new CorrectionTable(
    'negative correction table',
    new Map([
      [20000, new CorrectionVector([20000, -125])],
      [22500, new CorrectionVector([22500, -100])],
      [25000, new CorrectionVector([25000, -75])],
      [27500, new CorrectionVector([27500, -50])],
      [30000, new CorrectionVector([30000, -25])],
      [32500, new CorrectionVector([32500, -25])],
      [35000, new CorrectionVector([35000, -25])],
      [37500, new CorrectionVector([37500, -25])],
      [40000, new CorrectionVector([40000, -25])],
      [42500, new CorrectionVector([42500, -25])],
    ])
  )
);
