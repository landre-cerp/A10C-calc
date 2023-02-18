import { ApplyDeltaTempTCorrection } from 'src/service/conversionTool';

export const ClimbFuelUsed = (
  startingAlt: number,
  TartgetAlt: number,
  startingWeight: number,
  deltaTemp: number,
  drag: number
): number => {
  // Select equation vectors for the Aircraft Drag
  const [vDrag, vnextDrag] = selectVectorsForDrag(drag);

  // calc fuel with "Low table"
  let fuelUsed = CalcFuelFor(vDrag, startingAlt, TartgetAlt, startingWeight);

  // if high table ( 0-4  / 4-8 / 8-null )
  if (vnextDrag) {
    const nextFuelUsed = CalcFuelFor(
      vnextDrag,
      startingAlt,
      TartgetAlt,
      startingWeight
    );
    const increment = (nextFuelUsed - fuelUsed) / 4; // delta drag from table is 4

    const deltaDrag = drag >= 4 ? drag - 4 : drag;
    fuelUsed = fuelUsed + increment * deltaDrag;
  }

  fuelUsed = fuelUsed < 0 ? 0 : fuelUsed;
  if (deltaTemp > 0) {
    const step = 250;
    for (let rangeStart = 250; rangeStart < 2000; rangeStart += step) {
      if (fuelUsed >= rangeStart && fuelUsed < rangeStart + step) {
        fuelUsed = ApplyDeltaTempTCorrection(
          selectVectorsForDeltaTemp,
          fuelUsed,
          deltaTemp,
          rangeStart,
          step
        );
      }
    }
  }

  // round to Highest 10th
  fuelUsed = Math.ceil(fuelUsed / 10) * 10;

  return fuelUsed < 0 ? 0 : Math.ceil(fuelUsed);
};

const CalcFuelFor = (
  vDrag: Map<number, number[]>,
  startingAlt: number,
  TartgetAlt: number,
  startingWeight: number
): number => {
  let fuelUsed = 0;
  const step = 5000;
  for (
    let weigthRangeStart = 30000;
    weigthRangeStart < 50000;
    weigthRangeStart += step
  ) {
    if (
      startingWeight >= weigthRangeStart &&
      startingWeight < weigthRangeStart + step
    ) {
      fuelUsed = fuelUsedFor(
        vDrag,
        startingAlt,
        TartgetAlt,
        step,
        startingWeight,
        weigthRangeStart
      );
    }
  }

  return fuelUsed;
};

/* CLIMB tools */

const selectVectorsForDrag = (drag: number) => {
  if (drag >= 8) return [vectors_Climb_Drag8, null];
  if (drag >= 4 && drag < 8) {
    return [vectors_Climb_Drag4, vectors_Climb_Drag8];
  }
  return [vectors_Climb_Drag0, vectors_Climb_Drag4];
};

const selectVectorsForDeltaTemp = (deltaTemp: number) => {
  return deltaTemp > 0
    ? vectors_climb_deltaT_positive
    : vectors_climb_deltaT_negative;
};

const vectors_Climb_Drag0: Map<number, number[]> = new Map([
  [25000, [-102, 43.5, -1.59, 0.029]],
  [30000, [-58.9, 38.3, -1.18, 0.0253]],
  [35000, [-128, 67.8, -3.13, 0.0674]],
  [40000, [-37.5, 53.4, -2.16, 0.0589]],
  [45000, [-60, 62.1, -2.61, 0.08]],
  [50000, [-63.3, 78.4, -4.21, 0.139]],
]);

const vectors_Climb_Drag4: Map<number, number[]> = new Map([
  [25000, [-75, 40.1, -1.43, 0.0298]],
  [30000, [-38.9, 38.2, -1.23, 0.0302]],
  [35000, [-143, 63.9, -2.55, 0.0589]],
  [40000, [-112, 66.3, -2.79, 0.077]],
  [45000, [-40, 54.8, -1.71, 0.0667]],
  [50000, [-197, 103, -5.17, 0.167]],
]);

const vectors_Climb_Drag8: Map<number, number[]> = new Map([
  [25000, [-101, 46.7, -1.82, 0.0374]],
  [30000, [-185, 71.4, -3.12, 0.0654]],
  [35000, [-63.3, 49, -1.55, 0.0441]],
  [40000, [-193, 96.6, -5.36, 0.149]],
  [45000, [-168, 97.3, -5.14, 0.16]],
  [50000, [-5, 56.2, -1.5, 0.0933]],
]);

const CLB_Fuel = (coeff: number[] | undefined, pressureAlt: number) => {
  if (typeof coeff == 'undefined') return 0;
  const fuelUsed = Math.ceil(
    coeff[0] +
      coeff[1] * pressureAlt +
      coeff[2] * pressureAlt * pressureAlt +
      coeff[3] * pressureAlt * pressureAlt * pressureAlt
  );

  return fuelUsed >= 0 ? fuelUsed : 0;
};

const fuelUsedFor = (
  vDrag: Map<number, number[]>,
  startingAlt: number,
  TartgetAlt: number,
  step: number,
  startingWeight: number,
  weigthRangeStart: number
) => {
  const lowStartFuelUsed = CLB_Fuel(
    vDrag.get(weigthRangeStart),
    startingAlt / 1000
  );
  const lowEndFuelUsed = CLB_Fuel(
    vDrag.get(weigthRangeStart),
    TartgetAlt / 1000
  );
  const lowFuelUsed = lowEndFuelUsed - lowStartFuelUsed;

  const highStartFuelUsed = CLB_Fuel(
    vDrag.get(weigthRangeStart + step),
    startingAlt / 1000
  );
  const highEndFuelUsed = CLB_Fuel(
    vDrag.get(weigthRangeStart + step),
    TartgetAlt / 1000
  );
  const highFuelUsed = highEndFuelUsed - highStartFuelUsed;

  // Linear interpolation between 40 and 45 GW charts
  const increment = (highFuelUsed - lowFuelUsed) / step;
  const fuelUsed =
    lowFuelUsed + increment * (startingWeight - weigthRangeStart);
  return fuelUsed > 0 ? fuelUsed : 0;
};

const vectors_climb_deltaT_positive: Map<number, number[]> = new Map([
  [250, [2.5, 250]],
  [500, [5, 500]],
  [750, [7.5, 752]],
  [1000, [12.5, 1018]],
  [1250, [21.3, 1254]],
  [1500, [27.5, 1495]],
  [1750, [39.5, 1768]],
  [2000, [55, 2000]],
]);

const vectors_climb_deltaT_negative: Map<number, number[]> = new Map([
  [250, [2.5, 250]],
  [500, [2.5, 500]],
  [750, [3.75, 750]],
  [1000, [6.25, 1000]],
  [1250, [7.5, 1250]],
  [1500, [12.5, 1500]],
  [1750, [15, 1750]],
  [2000, [20, 1987]],
]);
