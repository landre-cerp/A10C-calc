import {
  CorrectionTable,
  CorrectionVector,
  DragCorrectionTable,
} from '../CorrectionTable';

const CruiseFuelDragCorrection = new DragCorrectionTable(
  'Cruise NM per lbs fuel',
  new Map([
    [
      0,
      new CorrectionTable(
        'Drag 0',
        new Map([
          [0, new CorrectionVector([0.106, -1.21e-6, 6.79e-12])],
          [5000, new CorrectionVector([0.116, -6.74e-7, -6.79e-12])],
          [10000, new CorrectionVector([0.155, -2.43e-6, 1.79e-11])],
          [15000, new CorrectionVector([0.163, -2.2e-6, 1.18e-11])],
          [20000, new CorrectionVector([0.198, -3.25e-6, 2.14e-11])],
          [25000, new CorrectionVector([0.239, -4.65e-6, 3.57e-11])],
          [30000, new CorrectionVector([0.237, -3.26e-6, 5e-12])],
        ]),
      ),
    ],
    [
      4,
      new CorrectionTable(
        'Drag 4',
        new Map([
          [0, new CorrectionVector([0.0892, -5.77e-7, -1.79e-12])],
          [5000, new CorrectionVector([0.11, -1.03e-6, 1.64e-12])],
          [10000, new CorrectionVector([0.129, -1.57e-6, 7.86e-12])],
          [15000, new CorrectionVector([0.148, -2.1e-6, 1.39e-11])],
          [20000, new CorrectionVector([0.157, -1.8e-6, 5.71e-12])],
          [25000, new CorrectionVector([0.182, -2.24e-6, 5.71e-12])],
          [30000, new CorrectionVector([0.247, -5.16e-6, 4e-11])],
        ]),
      ),
    ],
    [
      8,
      new CorrectionTable(
        'Drag 8',
        new Map([
          [0, new CorrectionVector([0.0641, 3.8e-7, -1.25e-11])],
          [5000, new CorrectionVector([0.121, -2.02e-6, 1.61e-11])],
          [10000, new CorrectionVector([0.126, -1.76e-6, 1.11e-11])],
          [15000, new CorrectionVector([0.101, 8.04e-8, -1.25e-11])],
          [20000, new CorrectionVector([0.16, -2.35e-6, 1.29e-11])],
          [25000, new CorrectionVector([0.189, -3.42e-6, 2.57e-11])],
          [30000, new CorrectionVector([0.232, -4.98e-6, 4e-11])],
        ]),
      ),
    ],
  ]),
);

export const CruiseNMperLbsUsed = (
  cruisePressureAlt: number,
  cruiseWeight: number,
  drag: number,
): number => {
  const result = CruiseFuelDragCorrection.getLinear(
    drag,
    cruisePressureAlt,
    cruiseWeight,
  );
  return result < 0 ? 0 : result;
};
