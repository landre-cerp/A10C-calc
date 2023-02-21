import {
  CorrectionTable,
  CorrectionVector,
  PosNegCorrectionTable,
} from './CorrectionTable';

export const CriticalFieldLength = (
  takeoffindex: number,
  weight: number,
  rcr: number,
  wind: number
): number => {
  let criticalFieldLength = vectors_CriticalFieldLength.GetLinear(
    weight,
    takeoffindex
  );

  if (wind != 0) {
    criticalFieldLength = vectors_CriticalFieldLength_wind.GetLinear(
      criticalFieldLength,
      wind
    );
  }

  criticalFieldLength = rcr_correction_table.GetLinear(
    criticalFieldLength,
    rcr
  );
  return criticalFieldLength;
};

const vectors_CriticalFieldLength = new CorrectionTable(
  'Critical Field Length',
  new Map([
    [30000, new CorrectionVector([8950, -575, -8.33])],
    [35000, new CorrectionVector([15000, -1385, 20.2])],
    [40000, new CorrectionVector([19434, -1599, 7.14])],
    [45000, new CorrectionVector([35446, -3947, 92.5])],
    [50000, new CorrectionVector([63300, -8150, 250])],
  ])
);

const vectors_CriticalFieldLength_wind = new PosNegCorrectionTable(
  'Critical Field Length Correction table ',

  new CorrectionTable(
    'Critical Field Length positive wind',
    new Map([
      [1000, new CorrectionVector([1006, -22.8, 0.107])],
      [2000, new CorrectionVector([1999, -31.7, 0.143])],
      [3000, new CorrectionVector([3009, -43.7, 0.143])],
      [4000, new CorrectionVector([4003, -53.6, 0.214])],
      [5000, new CorrectionVector([4974, -55.9, 0.0714])],
      [6000, new CorrectionVector([6007, -74.4, 0.286])],
      [7000, new CorrectionVector([6995, -80.7, 0.257])],
      [8000, new CorrectionVector([8020, -92.5, 0.25])],
      [9000, new CorrectionVector([8990, -99.5, 0.25])],
      [10000, new CorrectionVector([9999, -115, 0.393])],
      [11000, new CorrectionVector([10993, -119, 0.214])],
      [12000, new CorrectionVector([11974, -139, 0.571])],
    ])
  ),

  new CorrectionTable(
    'Critical Field Length negative wind',
    new Map([
      [0, new CorrectionVector([0, 10])],
      [1000, new CorrectionVector([1000, -20])],
      [2000, new CorrectionVector([2000, -30])],
      [3000, new CorrectionVector([3000, -40])],
      [4000, new CorrectionVector([4000, -60])],
      [5000, new CorrectionVector([5000, -65])],
      [6000, new CorrectionVector([6000, -80])],
      [7000, new CorrectionVector([7000, -90])],
      [8000, new CorrectionVector([8000, -100])],
      [9000, new CorrectionVector([9000, -115])],
      [10000, new CorrectionVector([10000, -120])],
      [11000, new CorrectionVector([11000, -125])],
    ])
  )
);

const rcr_correction_table = new CorrectionTable(
  'RCR correction table',
  new Map([
    [1000, new CorrectionVector([1470, -42.2, 0.947])],
    [2000, new CorrectionVector([3411, -127, 2.84])],
    [3000, new CorrectionVector([5823, -253, 5.68])],
    [4000, new CorrectionVector([7555, -277, 5.3])],
    [5000, new CorrectionVector([9286, -300, 4.92])],
    [6000, new CorrectionVector([11018, -323, 4.55])],
    [7000, new CorrectionVector([13795, -461, 7.2])],
    [8000, new CorrectionVector([14482, -369, 3.79])],
    [9000, new CorrectionVector([17364, -538, 7.58])],
    [10000, new CorrectionVector([16900, -300, 0])],
  ])
);
