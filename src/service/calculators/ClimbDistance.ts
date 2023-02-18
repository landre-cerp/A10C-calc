import { ApplyDeltaTempTCorrection } from '../conversionTool';

export const ClimbDistanceNeeded = (
  startingAlt: number,
  TartgetAlt: number,
  startingWeight: number,
  deltaTemp: number,
  drag: number
): number => {
  // Select equation vectors for the Aircraft Drag
  const [v, vnext] = selectDistanceVectorsForDrag(drag);

  let distanceNeeded = CalcDistanceNeededFor(
    v,
    startingAlt,
    TartgetAlt,
    startingWeight
  );

  if (vnext) {
    const nextdistanceNeeded = CalcDistanceNeededFor(
      vnext,
      startingAlt,
      TartgetAlt,
      startingWeight
    );

    const increment = (nextdistanceNeeded - distanceNeeded) / 4; // delta drag from table is 4

    const deltaDrag = drag >= 4 ? drag - 4 : drag;
    distanceNeeded =
      distanceNeeded + (increment > 0 ? increment * deltaDrag : 0);
  }

  if (deltaTemp > 0) {
    const step = 25;

    for (let rangeStart = 25; rangeStart < 125; rangeStart += step) {
      if (distanceNeeded >= rangeStart && distanceNeeded < rangeStart + step) {
        distanceNeeded = ApplyDeltaTempTCorrection(
          selectVectorsForDeltaTemp,
          distanceNeeded,
          deltaTemp,
          rangeStart,
          step
        );
      }
    }
  }

  return distanceNeeded < 0 ? 0 : Math.ceil(distanceNeeded);
};

const CalcDistanceNeededFor = (
  v: Map<number, number[]>,
  StartingAlt: number,
  TartgetAlt: number,
  startingWeight: number
): number => {
  let distanceNeeded = 0;

  const step = 5000;
  for (
    let weightRangeStart = 35000;
    weightRangeStart < 50000;
    weightRangeStart += step
  ) {
    if (
      startingWeight >= weightRangeStart &&
      startingWeight < weightRangeStart + step
    ) {
      // Equation for Low GW

      distanceNeeded = distanceNeededFor(
        v,
        StartingAlt,
        TartgetAlt,
        startingWeight,
        weightRangeStart,
        step
      );
    }
  }

  return distanceNeeded;
};

const selectDistanceVectorsForDrag = (drag: number) => {
  if (drag >= 8) return [v_climb_distance_drag8, null];
  if (drag >= 4 && drag < 8) {
    return [v_climb_distance_drag4, v_climb_distance_drag8];
  }
  return [v_climb_distance_drag0, v_climb_distance_drag4];
};

const CLB_Distance = (coeff: number[] | undefined, pressureAlt: number) => {
  if (typeof coeff == 'undefined') return 0;

  const distanceNeeded = Math.ceil(
    coeff[0] +
      coeff[1] * pressureAlt +
      coeff[2] * pressureAlt * pressureAlt +
      coeff[3] * pressureAlt * pressureAlt * pressureAlt +
      coeff[4] * pressureAlt * pressureAlt * pressureAlt * pressureAlt
  );

  return distanceNeeded >= 0 ? distanceNeeded : 0;
};

const distanceNeededFor = (
  v: Map<number, number[]>,
  startingAlt: number,
  TartgetAlt: number,
  startingWeight: number,
  weightRangeStart: number,
  step: number
) => {
  const low_vectors_Climb = v.get(weightRangeStart);
  const high_vectors_Climb = v.get(weightRangeStart + step);

  const lowStartDistance = CLB_Distance(low_vectors_Climb, startingAlt / 1000);
  const lowEndDistance = CLB_Distance(low_vectors_Climb, TartgetAlt / 1000);
  const lowDistance = lowEndDistance - lowStartDistance;

  const highStartDistance = CLB_Distance(
    high_vectors_Climb,
    startingAlt / 1000
  );
  const highEndDistance = CLB_Distance(high_vectors_Climb, TartgetAlt / 1000);
  const highDistance = highEndDistance - highStartDistance;

  const increment = (highDistance - lowDistance) / step;
  const distanceNeeded =
    lowDistance + increment * (startingWeight - weightRangeStart);
  return distanceNeeded > 0 ? distanceNeeded : 0;
};

const v_climb_distance_drag0: Map<number, number[]> = new Map([
  [25000, [7.81, -2.25, 0.303, -0.012, 1.72e-4]],
  [30000, [0.643, 0.703, 8.33e-4, -5.96e-4, 3.94e-5]],
  [35000, [12.1, -3.26, 0.477, -0.0218, 3.64e-4]],
  [40000, [3.75, -0.838, 0.294, -0.0168, 3.5e-4]],
  [45000, [16.7, -4.8, 0.754, -0.0391, 7.67e-4]],
  [50000, [17.5, -5.13, 0.818, -0.043, 9e-4]],
]);

const v_climb_distance_drag4: Map<number, number[]> = new Map([
  [25000, [8.12, -2.37, 0.318, -0.0129, 1.92e-4]],
  [30000, [3.93, -0.566, 0.153, -7.28e-3, 1.42e-4]],
  [35000, [16.1, -4.46, 0.583, -0.0256, 4.27e-4]],
  [40000, [6.17, -1.73, 0.399, -0.0214, 4.33e-4]],
  [45000, [-10, 5.33, -0.493, 0.0227, -2.67e-4]],
  [50000, [24.5, -8.14, 1.25, -0.0663, 1.37e-3]],
]);

const v_climb_distance_drag8: Map<number, number[]> = new Map([
  [25000, [-1.07, 0.814, -0.0242, 1.2e-3, 3.03e-6]],
  [30000, [8.5, -2.35, 0.369, -0.017, 2.94e-4]],
  [35000, [4.75, -0.657, 0.187, -9.5e-3, 2.17e-4]],
  [40000, [21.4, -7.62, 1.14, -0.0581, 1.08e-3]],
  [45000, [2.5, 0.1, 0.228, -0.016, 4.67e-4]],
  [50000, [0, 0, 0, 0, 1]],
]);

const distance_vectors_climb_deltaT_positive: Map<number, number[]> = new Map([
  [25, [0.25, 25]],
  [50, [1.1, 50]],
  [75, [2.05, 75]],
  [100, [3.5, 100]],
  [125, [5.5, 125]],
]);

const distance_vectors_climb_deltaT_negative: Map<number, number[]> = new Map([
  [25, [0.25, 25]],
  [50, [0.4, 50]],
  [75, [0.95, 75]],
  [100, [1.2, 100]],
  [125, [1.75, 125]],
]);

const selectVectorsForDeltaTemp = (deltaTemp: number) => {
  return deltaTemp > 0
    ? distance_vectors_climb_deltaT_positive
    : distance_vectors_climb_deltaT_negative;
};
