import { CorrectionTable, CorrectionVector } from '../CorrectionTable';

export const GroundRun = (
  takeoffIndex: number,
  weight: number,
  headWind: number,
): number => {
  // calculate ground run distance
  const groundRunDist = GroundRuncCorrectionTable.GetLinear(
    weight,
    takeoffIndex,
  );

  // then correct for head wind
  return (
    Math.ceil(
      GroundRuncCorrectionTable_wind.GetLinear(groundRunDist, headWind) / 100,
    ) * 100
  );
};

// F(Weight , takeoffIndex)
const GroundRuncCorrectionTable = new CorrectionTable(
  'Ground Run',
  new Map([
    [30000, new CorrectionVector([6430, -465, -4.17])],
    [35000, new CorrectionVector([10517, -984, 13.2])],
    [40000, new CorrectionVector([15521, -1492, 20.5])],
    [45000, new CorrectionVector([23743, -2592, 56])],
    [50000, new CorrectionVector([36320, -4180, 100])],
  ]),
);

const GroundRuncCorrectionTable_wind = new CorrectionTable(
  'Ground Run Head Wind Correction',
  new Map([
    [1000, new CorrectionVector([975, -13.5])],
    [2000, new CorrectionVector([1950, -24.5])],
    [3000, new CorrectionVector([2925, -34.5])],
    [4000, new CorrectionVector([4150, -53])],
    [5000, new CorrectionVector([4750, -51])],
    [6000, new CorrectionVector([5950, -66])],
    [7000, new CorrectionVector([6800, -73])],
    [8000, new CorrectionVector([7750, -80])],
    [9000, new CorrectionVector([8750, -90])],
    [10000, new CorrectionVector([9800, -104])],
    [11000, new CorrectionVector([10900, -113])],
    [12000, new CorrectionVector([11850, -120])],
    [13000, new CorrectionVector([13050, -136])],
    [14000, new CorrectionVector([13700, -132])],
  ]),
);
