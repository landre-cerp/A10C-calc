import { ApplyDeltaTempTCorrection } from 'src/service/conversionTool';

export const combatCeiling = (
  startingWeight: number,
  deltaTemp: number,
  drag: number
): number => {
  // Select equation vectors for the Aircraft Drag

  const [vDrag, vnextDrag] = selectDragVector(drag);

  let combatCeiling = CalcCombatCeiling(vDrag, startingWeight);

  if (vnextDrag != vDrag) {
    const NextCombatCeiling = CalcCombatCeiling(vnextDrag, startingWeight);
    const increment = (NextCombatCeiling - combatCeiling) / 4; // delta drag from table is 4
    const deltaDrag = drag >= 4 ? drag - 4 : drag;
    combatCeiling = combatCeiling + (increment > 0 ? increment * deltaDrag : 0);
  }

  if (deltaTemp > 0) {
    const step = 2500;
    for (let rangeStart = 20000; rangeStart < 42500; rangeStart += step) {
      if (combatCeiling >= rangeStart && combatCeiling < rangeStart + step) {
        combatCeiling = ApplyDeltaTempTCorrection(
          selectVectorsForDeltaTemp,
          combatCeiling,
          deltaTemp,
          rangeStart,
          step
        );
      }
    }
  }

  return combatCeiling;
};

const CalcCombatCeiling = (
  coeff: number[] | undefined,
  startingWeight: number
): number => {
  if (typeof coeff == 'undefined') return 0;

  return coeff[0] * startingWeight + coeff[1];
};

const selectDragVector = (drag: number) => {
  if (drag >= 8)
    return [vector_combatCeiling_drag.get(8), vector_combatCeiling_drag.get(8)];
  if (drag >= 4)
    return [vector_combatCeiling_drag.get(4), vector_combatCeiling_drag.get(8)];
  return [vector_combatCeiling_drag.get(0), vector_combatCeiling_drag.get(4)];
};

const selectVectorsForDeltaTemp = (deltaTemp: number) => {
  return deltaTemp > 0
    ? combatCeiling_deltaTemp_positive
    : combatCeiling_deltaTemp_negative;
};

const vector_combatCeiling_drag: Map<number, number[]> = new Map([
  [0, [-0.627, 54857]],
  [4, [-0.657, 54157]],
  [8, [-0.676, 53464]],
]);
const combatCeiling_deltaTemp_positive: Map<number, number[]> = new Map([
  [20000, [-200, 20000]],
  [22500, [-175, 22500]],
  [25000, [-150, 25000]],
  [27500, [-125, 27500]],
  [30000, [-100, 30000]],
  [32500, [-75, 32500]],
  [35000, [-100, 35000]],
  [37500, [-75, 37500]],
  [40000, [-75, 40000]],
  [42500, [-75, 42500]],
]);

const combatCeiling_deltaTemp_negative: Map<number, number[]> = new Map([
  [20000, [-125, 20000]],
  [22500, [-100, 22500]],
  [25000, [-75, 25000]],
  [27500, [-50, 27500]],
  [30000, [-25, 30000]],
  [32500, [-25, 32500]],
  [35000, [-25, 35000]],
  [37500, [-25, 37500]],
  [40000, [-25, 40000]],
  [42500, [-25, 42500]],
]);
