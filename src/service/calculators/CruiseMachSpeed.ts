import {
  CorrectionTable,
  DragCorrectionTable,
  CorrectionVector,
} from './CorrectionTable';

export const CruiseMachSpeed = (
  cruisePressureAlt: number,
  cruiseWeight: number,
  deltaTemp: number,
  drag: number
): number => {
  // Enter chart with Cruise GrossWeigth , pressure Altitude , Drag Index
  const [v, vnext, step, startDrag] = MachSpeedDragCorrection.getInterval(drag);

  let trueMach = v.GetLinear(cruisePressureAlt, cruiseWeight);

  if (step != 0) {
    const nextTrueMach = vnext.GetLinear(cruisePressureAlt, cruiseWeight);

    const incrementSpeed = (nextTrueMach - trueMach) / step;
    trueMach = trueMach + incrementSpeed * (drag - startDrag);
  }

  return trueMach < 0 ? 0 : trueMach;
};

const vector_MachSpeed_Drag0 = new CorrectionTable(
  'Mach Speed for Drag 0',
  new Map([
    [0, new CorrectionVector([0.241, 2.79e-7, 5e-11])],
    [5000, new CorrectionVector([0.195, 3.41e-6, 1.43e-11])],
    [10000, new CorrectionVector([0.261, 2.23e-6, 1.79e-11])],
    [15000, new CorrectionVector([0.273, 3.45e-6, 3.57e-12])],
    [20000, new CorrectionVector([0.224, 7.14e-6, -3.57e-11])],
    [25000, new CorrectionVector([0.299, 5.56e-6, -1.43e-11])],
    [30000, new CorrectionVector([0.224, 1.12e-5, -8e-11])],
    [35000, new CorrectionVector([0.34, 6e-6, 2e-28])],
  ])
);

const vector_MachSpeed_Drag4 = new CorrectionTable(
  'Mach Speed for Drag 4',
  new Map([
    [0, new CorrectionVector([0.205, 2.21e-6, 1.43e-11])],
    [5000, new CorrectionVector([0.147, 6.4e-6, -3.93e-11])],
    [10000, new CorrectionVector([0.205, 4.1e-6, -3.57e-12])],
    [15000, new CorrectionVector([0.154, 8.51e-6, -5.71e-11])],
    [20000, new CorrectionVector([0.159, 9.81e-6, -7.14e-11])],
    [25000, new CorrectionVector([0.222, 8.49e-6, -5e-11])],
    [30000, new CorrectionVector([0.16, 1.34e-5, -1.04e-10])],
    [35000, new CorrectionVector([0.22, 1.25e-5, -1e-10])],
  ])
);

const vector_MachSpeed_Drag8 = new CorrectionTable(
  'Mach Speed for Drag 8',
  new Map([
    [0, new CorrectionVector([0.196, 2.03e-6, 1.79e-11])],
    [5000, new CorrectionVector([0.145, 5.87e-6, -3.21e-11])],
    [10000, new CorrectionVector([0.17, 5.28e-6, -1.79e-11])],
    [15000, new CorrectionVector([0.132, 9.18e-6, -6.79e-11])],
    [20000, new CorrectionVector([0.196, 7.29e-6, -3.93e-11])],
    [25000, new CorrectionVector([0.226, 7.48e-6, -3.57e-11])],
    [30000, new CorrectionVector([0.204, 1.06e-5, -7.14e-11])],
    [35000, new CorrectionVector([0.31, 6e-6, 1.11e-24])],
  ])
);

const MachSpeedDragCorrection = new DragCorrectionTable(
  'Mach speed drag correction',
  new Map([
    [0, vector_MachSpeed_Drag0],
    [4, vector_MachSpeed_Drag4],
    [8, vector_MachSpeed_Drag8],
  ])
);
