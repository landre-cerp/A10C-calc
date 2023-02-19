export const CruiseNMperLbsUsed = (
  cruisePressureAlt: number,
  cruiseWeight: number,
  deltaTemp: number,
  drag: number
): number => {
  // Enter chart with Cruise GrossWeigth , pressure Altitude , Drag Index
  const [vDrag, vnextDrag] = selectLbsVectorsForDrag(drag);

  // calc fuel with "Low table"
  let nauticalMilesPerLbs = CalcNauticalPerLbsFuel(
    vDrag,
    cruisePressureAlt,
    cruiseWeight
  );

  // if high table ( 0-4  / 4-8 / 8-null )
  if (vnextDrag != vDrag) {
    const nextNauticalMilesPerLbs = CalcNauticalPerLbsFuel(
      vnextDrag,
      cruisePressureAlt,
      cruiseWeight
    );
    const increment = (nextNauticalMilesPerLbs - nauticalMilesPerLbs) / 4; // delta drag from table is 4

    nauticalMilesPerLbs = nauticalMilesPerLbs + increment * 4;
  }

  return nauticalMilesPerLbs < 0 ? 0 : nauticalMilesPerLbs;
};

const CalcNauticalPerLbsFuel = (
  vDrag: Map<number, number[]>,
  cruisePressureAlt: number,
  cruiseWeight: number
): number => {
  let fuelUsed = 0;
  const step = 5000;
  for (let AltRangeStart = 0; AltRangeStart < 30000; AltRangeStart += step) {
    if (
      cruisePressureAlt >= AltRangeStart &&
      cruisePressureAlt < AltRangeStart + step
    ) {
      fuelUsed = NMPerLbsFor(
        vDrag,
        cruisePressureAlt,
        cruiseWeight,
        step,
        AltRangeStart
      );
    }
  }

  return fuelUsed;
};

/* Cruise tools */

const selectLbsVectorsForDrag = (drag: number) => {
  if (drag >= 8) return [vectors_Cruise_LbsNm_Drag8, null];
  if (drag >= 4 && drag < 8) {
    return [vectors_Cruise_LbsNm_Drag4, vectors_Cruise_LbsNm_Drag8];
  }
  return [vectors_Cruise_LbsNm_Drag0, vectors_Cruise_LbsNm_Drag4];
};

const vectors_Cruise_LbsNm_Drag0: Map<number, number[]> = new Map([
  [0, [0.106, -1.21e-6, 6.79e-12]],
  [5000, [0.116, -6.74e-7, -6.79e-12]],
  [10000, [0.155, -2.43e-6, 1.79e-11]],
  [15000, [0.163, -2.2e-6, 1.18e-11]],
  [20000, [0.198, -3.25e-6, 2.14e-11]],
  [25000, [0.239, -4.65e-6, 3.57e-11]],
  [30000, [0.237, -3.26e-6, 5e-12]],
]);

const vectors_Cruise_LbsNm_Drag4: Map<number, number[]> = new Map([
  [0, [0.0892, -5.77e-7, -1.79e-12]],
  [5000, [0.11, -1.03e-6, 1.64e-12]],
  [10000, [0.129, -1.57e-6, 7.86e-12]],
  [15000, [0.148, -2.1e-6, 1.39e-11]],
  [20000, [0.157, -1.8e-6, 5.71e-12]],
  [25000, [0.182, -2.24e-6, 5.71e-12]],
  [30000, [0.247, -5.16e-6, 4e-11]],
]);

const vectors_Cruise_LbsNm_Drag8: Map<number, number[]> = new Map([
  [0, [0.0641, 3.8e-7, -1.25e-11]],
  [5000, [0.121, -2.02e-6, 1.61e-11]],
  [10000, [0.126, -1.76e-6, 1.11e-11]],
  [15000, [0.101, 8.04e-8, -1.25e-11]],
  [20000, [0.16, -2.35e-6, 1.29e-11]],
  [25000, [0.189, -3.42e-6, 2.57e-11]],
  [30000, [0.232, -4.98e-6, 4e-11]],
]);

const NMperLbs = (coeff: number[] | undefined, weight: number) => {
  if (typeof coeff == 'undefined') return 0;
  const fuelUsed = coeff[0] + coeff[1] * weight + coeff[2] * weight * weight;
  return fuelUsed >= 0 ? fuelUsed : 0;
};

const NMPerLbsFor = (
  vDrag: Map<number, number[]>,
  cruisePressureAlt: number,
  cruiseWeight: number,
  step: number,
  AltRangeStart: number
) => {
  const lowValue = NMperLbs(vDrag.get(AltRangeStart), cruiseWeight);
  const highValue = NMperLbs(vDrag.get(AltRangeStart + step), cruiseWeight);

  // Linear interpolation between 40 and 45 GW charts
  const increment = (highValue - lowValue) / step;

  const distancePerLbs =
    lowValue + increment * (cruisePressureAlt - AltRangeStart);
  return distancePerLbs > 0 ? distancePerLbs : 0;
};
