import {
  CorrectionTable,
  CorrectionVector,
  DragCorrectionTable,
} from '../CorrectionTable';

export const FuelPenetrationDescent = (
  grossweight: number,
  drag: number,
  altitude: number,
): number => {
  return Math.ceil(
    FuelPenetrationDragTable.getLinear(drag, altitude, grossweight),
  );
};

export const TimePenetrationDescent = (
  grossweight: number,
  drag: number,
  altitude: number,
): number => {
  return Math.ceil(
    TimePenetrationDragTable.getLinear(drag, altitude, grossweight),
  );
};

export const DistancePenetrationDescent = (
  grossweight: number,
  drag: number,
  altitude: number,
): number => {
  return Math.ceil(
    DistancePenetrationDragTable.getLinear(drag, altitude, grossweight),
  );
};

//================================================================================================
// Time Penetration Descent
//================================================================================================

const TimePenetrationDescent_Drag0 = new CorrectionTable(
  'Time Penetration Descent Drag 0',
  new Map([
    [0, new CorrectionVector([0, 0, 0])],
    [5000, new CorrectionVector([-1.32, 0.000152, -1.61e-9])],
    [10000, new CorrectionVector([1.39, 0.000063, -4.02e-42])],
    [15000, new CorrectionVector([-1.39, 0.000285, -2.5e-9])],
    [20000, new CorrectionVector([-0.536, 0.000317, -2.68e-9])],
    [25000, new CorrectionVector([-0.286, 0.000386, -3.39e-9])],
    [30000, new CorrectionVector([-1.25, 0.000525, -5e-9])],
    [35000, new CorrectionVector([2.36, 0.000404, -3.21e-9])],
  ]),
);
const TimePenetrationDescent_Drag4 = new CorrectionTable(
  'Time Penetration Descent Drag 4',
  new Map([
    [0, new CorrectionVector([0, 0, 0])],
    [5000, new CorrectionVector([-1.57, 0.000152, -1.61e-9])],
    [10000, new CorrectionVector([-1.54, 0.000217, -2.32e-9])],
    [15000, new CorrectionVector([-1.29, 0.000262, -2.5e-9])],
    [20000, new CorrectionVector([-1.89, 0.000359, -3.39e-9])],
    [25000, new CorrectionVector([-1.32, 0.000395, -3.57e-9])],
    [30000, new CorrectionVector([-2, 0.00052, -5.18e-9])],
    [35000, new CorrectionVector([0.821, 0.000413, -3.39e-9])],
  ]),
);

const TimePenetrationDescent_Drag8 = new CorrectionTable(
  'Time Penetration Descent Drag 8',
  new Map([
    [0, new CorrectionVector([0, 0, 0])],
    [5000, new CorrectionVector([-0.607, 8.7e-5, -8.93e-10])],
    [10000, new CorrectionVector([-0.5, 1.24e-4, -8.93e-10])],
    [15000, new CorrectionVector([-0.393, 1.86e-4, -1.57e-9])],
    [20000, new CorrectionVector([-1.79, 3.36e-4, -3.39e-9])],
    [25000, new CorrectionVector([-0.179, 2.99e-4, -2.5e-9])],
    [30000, new CorrectionVector([-0.179, 3.73e-4, -3.39e-9])],
    [35000, new CorrectionVector([-0.786, 4.6e-4, -4.29e-9])],
  ]),
);

const TimePenetrationDragTable = new DragCorrectionTable(
  'Time Penetration Descent',
  new Map([
    [0, TimePenetrationDescent_Drag0],
    [4, TimePenetrationDescent_Drag4],
    [8, TimePenetrationDescent_Drag8],
  ]),
);

//================================================================================================
// Fuel Penetration Descent
//================================================================================================

const FuelPenetrationDescent_Drag0 = new CorrectionTable(
  'Fuel Penetration Descent Drag 0',
  new Map([
    [0, new CorrectionVector([0, 0, 0])],
    [5000, new CorrectionVector([13.4, 0.00162, -7.14e-9])],
    [10000, new CorrectionVector([-35.7, 0.00682, -6.43e-8])],
    [15000, new CorrectionVector([-47.9, 0.0101, -9.64e-8])],
    [20000, new CorrectionVector([-55, 0.0131, -1.21e-7])],
    [25000, new CorrectionVector([-27.1, 0.0147, -1.36e-7])],
    [30000, new CorrectionVector([-40.7, 0.0182, -1.68e-7])],
    [35000, new CorrectionVector([-15.7, 0.0198, -1.82e-7])],
  ]),
);

const FuelPenetrationDescent_Drag4 = new CorrectionTable(
  'Fuel Penetration Descent Drag 4',
  new Map([
    [0, new CorrectionVector([0, 0, 0])],
    [5000, new CorrectionVector([-14.6, 0.00255, -1.93e-8])],
    [10000, new CorrectionVector([-20.7, 0.00538, -4.79e-8])],
    [15000, new CorrectionVector([-20.7, 0.00772, -6.79e-8])],
    [20000, new CorrectionVector([-14.1, 0.00958, -7.86e-8])],
    [25000, new CorrectionVector([-20.1, 0.0126, -1.11e-7])],
    [30000, new CorrectionVector([-63.6, 0.0178, -1.68e-7])],
    [35000, new CorrectionVector([-11.6, 0.0175, -1.57e-7])],
  ]),
);

const FuelPenetrationDescent_Drag8 = new CorrectionTable(
  'Fuel Penetration Descent Drag 8',
  new Map([
    [0, new CorrectionVector([0, 0, 0])],
    [5000, new CorrectionVector([10, 0.001, 0])],
    [10000, new CorrectionVector([-16.7, 0.00467, -4.07e-8])],
    [15000, new CorrectionVector([-28.6, 0.00746, -6.79e-8])],
    [20000, new CorrectionVector([-38, 0.01, -8.93e-8])],
    [25000, new CorrectionVector([-32.1, 0.0123, -1.14e-7])],
    [30000, new CorrectionVector([-31.4, 0.0145, -1.32e-7])],
    [35000, new CorrectionVector([2.86, 0.015, -1.32e-7])],
  ]),
);

const FuelPenetrationDragTable = new DragCorrectionTable(
  'Fuel Penetration Descent',
  new Map([
    [0, FuelPenetrationDescent_Drag0],
    [4, FuelPenetrationDescent_Drag4],
    [8, FuelPenetrationDescent_Drag8],
  ]),
);

//================================================================================================
// distance penetration descent
//================================================================================================

const DistancePenetrationDescent_Drag0 = new CorrectionTable(
  'Distance Penetration Descent Drag 0',
  new Map([
    [0, new CorrectionVector([0, 0, 0])],
    // 8 + 0x + 0x^2
    [5000, new CorrectionVector([8, 0, 0])],
    // -1,43 + 5,67E-04x + -4,29E-09x^2
    [10000, new CorrectionVector([-1.43, 0.000567, -4.29e-9])],
    // -0,286 + 8,08E-04x + -6,43E-09x^2
    [15000, new CorrectionVector([-0.286, 0.000808, -6.43e-9])],
    // -6,71 + 1,49E-03x + -1,36E-08x^2
    [20000, new CorrectionVector([-6.71, 0.00149, -1.36e-8])],
    // -9,57 + 1,93E-03x + -1,71E-08x^2
    [25000, new CorrectionVector([-9.57, 0.00193, -1.71e-8])],
    // -8,57 + 2,25E-03x + -2E-08x^2
    [30000, new CorrectionVector([-8.57, 0.00225, -2e-8])],
    // -6,43 + 2,49E-03x + -2,21E-08x^2
    [35000, new CorrectionVector([-6.43, 0.00249, -2.21e-8])],
  ]),
);

const DistancePenetrationDescent_Drag4 = new CorrectionTable(
  'Distance Penetration Descent Drag 4',
  new Map([
    [0, new CorrectionVector([0, 0, 0])],
    // -10,9 + 8,53E-04x + -1E-08x^2
    [5000, new CorrectionVector([-10.9, 0.000853, -1e-8])],
    // -3,29 + 5,31E-04x + -3,57E-09x^2
    [10000, new CorrectionVector([-3.29, 0.000531, -3.57e-9])],
    // -8,29 + 1,1E-03x + -1E-08x^2
    [15000, new CorrectionVector([-8.29, 0.0011, -1e-8])],
    // -9,57 + 1,46E-03x + -1,29E-08x^2
    [20000, new CorrectionVector([-9.57, 0.00146, -1.29e-8])],
    // -10 + 1,8E-03x + -1,64E-08x^2
    [25000, new CorrectionVector([-10, 0.0018, -1.64e-8])],
    // -11,6 + 2,23E-03x + -2,07E-08x^2
    [30000, new CorrectionVector([-11.6, 0.00223, -2.07e-8])],
    // -2,14 + 2,04E-03x + -1,71E-08x^2
    [35000, new CorrectionVector([-2.14, 0.00204, -1.71e-8])],
  ]),
);

const DistancePenetrationDescent_Drag8 = new CorrectionTable(
  'Distance Penetration Descent Drag 8',
  new Map([
    [0, new CorrectionVector([0, 0, 0])],
    // -8,29 + 6,08E-04x + -6,43E-09x^2
    [5000, new CorrectionVector([-8.29, 0.000608, -6.43e-9])],
    // -6,71 + 6,99E-04x + -6,43E-09x^2
    [10000, new CorrectionVector([-6.71, 0.000699, -6.43e-9])],
    // -2,86 + 7,56E-04x + -6,43E-09x^2
    [15000, new CorrectionVector([-2.86, 0.000756, -6.43e-9])],
    // -5,29 + 1,13E-03x + -9,29E-09x^2
    [20000, new CorrectionVector([-5.29, 0.00113, -9.29e-9])],
    // -8,14 + 1,54E-03x + -1,36E-08x^2
    [25000, new CorrectionVector([-8.14, 0.00154, -1.36e-8])],
    // -12 + 2,1E-03x + -2E-08x^2
    [30000, new CorrectionVector([-12, 0.0021, -2e-8])],
    // -14,4 + 2,49E-03x + -2,36E-08x^2
    [35000, new CorrectionVector([-14.4, 0.00249, -2.36e-8])],
  ]),
);

const DistancePenetrationDragTable = new DragCorrectionTable(
  'Distance Penetration Descent',
  new Map([
    [0, DistancePenetrationDescent_Drag0],
    [4, DistancePenetrationDescent_Drag4],
    [8, DistancePenetrationDescent_Drag8],
  ]),
);
