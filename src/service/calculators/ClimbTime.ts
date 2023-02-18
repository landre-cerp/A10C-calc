import { ApplyDeltaTempTCorrection } from '../conversionTool';

export const ClimbTimeNeeded = (
  startingAlt: number,
  TartgetAlt: number,
  startingWeight: number,
  deltaTemp: number,
  drag: number
): number => {
  // Select equation vectors for the Aircraft Drag

  const [vDrag, vnextDrag] = selectTimeVectorsForDrag(drag);

  let timeNeeded = CalcTimeNeededFor(
    vDrag,
    startingAlt,
    TartgetAlt,
    startingWeight
  );

  if (vnextDrag != vDrag) {
    const nextTimeNeeded = CalcTimeNeededFor(
      vnextDrag,
      startingAlt,
      TartgetAlt,
      startingWeight
    );

    const increment = (nextTimeNeeded - timeNeeded) / 4; // delta drag from table is 4

    const deltaDrag = drag >= 4 ? drag - 4 : drag;
    timeNeeded = timeNeeded + (increment > 0 ? increment * deltaDrag : 0);
  }

  if (deltaTemp > 0) {
    const step = 5;
    for (let rangeStart = 5; rangeStart < 35; rangeStart += step) {
      if (timeNeeded >= rangeStart && timeNeeded < rangeStart + step) {
        timeNeeded = ApplyDeltaTempTCorrection(
          selectVectorsForDeltaTemp,
          timeNeeded,
          deltaTemp,
          rangeStart,
          step
        );
      }
    }
  }

  return timeNeeded < 0 ? 0 : Math.ceil(timeNeeded);
};

const CalcTimeNeededFor = (
  v: Map<number, number[]>,
  startingAlt: number,
  tartgetAlt: number,
  startingWeight: number
): number => {
  let timeNeeded = 0;

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
      timeNeeded = TimeNeededFor(
        v,
        startingAlt,
        tartgetAlt,
        startingWeight,
        weightRangeStart,
        step
      );
    }
  }

  return timeNeeded;
};

/* CLIMB tools */

const selectTimeVectorsForDrag = (
  drag: number
): [Map<number, number[]>, Map<number, number[]>] => {
  if (drag >= 8) return [v_climb_time_drag8, v_climb_time_drag8];
  if (drag >= 4 && drag < 8) {
    return [v_climb_time_drag4, v_climb_time_drag8];
  }
  return [v_climb_time_drag0, v_climb_time_drag4];
};

const selectVectorsForDeltaTemp = (deltaTemp: number) => {
  return deltaTemp > 0
    ? time_vectors_climb_deltaT_positive
    : time_vectors_climb_deltaT_negative;
};

const CLB_Time = (coeff: number[] | undefined, pressureAlt: number) => {
  if (typeof coeff == 'undefined') return 0;
  const TimeNeeded = Math.ceil(
    coeff[0] +
      coeff[1] * pressureAlt +
      coeff[2] * pressureAlt * pressureAlt +
      coeff[3] * pressureAlt * pressureAlt * pressureAlt +
      coeff[4] * pressureAlt * pressureAlt * pressureAlt * pressureAlt
  );

  return TimeNeeded >= 0 ? TimeNeeded : 0;
};

/**
 *
 * @param v Correction Map
 * @param startingAlt Altitude the aircraft Starts
 * @param TartgetAlt Cruise Altitude
 * @param weightRangeStart
 * @param step
 * @returns
 */
const TimeNeededFor = (
  v: Map<number, number[]>,
  startingAlt: number,
  TartgetAlt: number,
  startingWeight: number,
  weightRangeStart: number,
  step: number
) => {
  // 1st calculation is made for "low drag chart"
  // get number for low weight Range,
  // get number for high weight Range ,
  // Linear from low to High given the "Step"

  const lowStartTime = CLB_Time(v.get(weightRangeStart), startingAlt / 1000);
  const lowEndTime = CLB_Time(v.get(weightRangeStart), TartgetAlt / 1000);
  const lowTime = lowEndTime - lowStartTime;

  const highStartTime = CLB_Time(
    v.get(weightRangeStart + step),
    startingAlt / 1000
  );
  const highEndTime = CLB_Time(
    v.get(weightRangeStart + step),
    TartgetAlt / 1000
  );
  const highTime = highEndTime - highStartTime;

  const increment = (highTime - lowTime) / step;
  const TimeNeeded = lowTime + increment * (startingWeight - weightRangeStart);
  return TimeNeeded > 0 ? TimeNeeded : 0;
};

const v_climb_time_drag0: Map<number, number[]> = new Map([
  [25000, [-0.25, 0.313, -0.0145, 5.56e-4, -3.03e-6]],
  [30000, [2.24, -0.519, 0.0701, -2.72e-3, 3.98e-5]],
  [35000, [-0.429, 0.701, -0.0513, 1.65e-3, -7.27e-6]],
  [40000, [-2.25, 1.26, -0.0999, 3.74e-3, -3.67e-5]],
  [45000, [0.667, 0.128, 0.0394, -2.59e-3, 6.67e-5]],
  [50000, [1, -0.02, 0.058, -3.2e-3, 8e-5]],
]);

const v_climb_time_drag4: Map<number, number[]> = new Map([
  [25000, [-3.29, 1.33, -0.118, -4.59e-3, -5.45e-5]],
  [30000, [0.571, 0.0306, 0.0152, -6.73e-4, 1.76e-5]],
  [35000, [2, -0.131, 0.0353, -1.79e-3, 4.124e-5]],
  [40000, [-0.917, 0.769, -0.0424, 8.73e-4, 1.67e-5]],
  [45000, [4.33, -1.29, 0.214, -0.0107, 2e-4]],

  [50000, [1.78e-15, 0.37, 8.67e-3, -8e-4, 5.33e-5]],
]);

const v_climb_time_drag8: Map<number, number[]> = new Map([
  [25000, [3.41, -0.922, 0.115, -4.73e-3, 7.12e-5]],
  [30000, [3, -0.883, 0.123, -5.35e-3, 8.55e-5]],
  [35000, [0.167, 0.307, -1.56e-3, -4.59e-4, 2.67e-5]],
  [40000, [0.667, 0.0206, 0.0554, -4.06e-3, 1.07e-4]],
  [45000, [-1.72, 0.93, -0.059, 2.2e-3, 0]],
  [50000, [7, -2.6, 0.449, -0.0271, 6e-4]],
]);

const time_vectors_climb_deltaT_positive: Map<number, number[]> = new Map([
  [5, [0.1, 5]],
  [10, [0.2, 10]],
  [15, [0.3, 15]],
  [20, [0.45, 20.2]],
  [25, [0.65, 25.2]],
  [30, [0.85, 30.2]],
  [35, [1.1, 35]],
]);

const time_vectors_climb_deltaT_negative: Map<number, number[]> = new Map([
  [5, [2.5, 250]],
  [10, [2.5, 500]],
  [15, [3.75, 750]],
  [20, [6.25, 1000]],
  [25, [7.5, 1250]],
  [30, [12.5, 1500]],
  [35, [15, 1750]],
]);
