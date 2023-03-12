import { CorrectionTable, CorrectionVector, DragCorrectionTable } from '../CorrectionTable';

export const FuelPenetrationDescent = (
    grossweight: number,
    drag: number,
    altitude: number): number => {

    return Math.ceil(FuelPenetrationDragTable.getLinear(drag, altitude, grossweight));

}

export const TimePenetrationDescent = (
    grossweight: number,
    drag: number,
    altitude: number): number => {
    return Math.ceil(TimePenetrationDragTable.getLinear(drag, altitude, grossweight));
}

export const DistancePenetrationDescent = (
    grossweight: number,
    drag: number,
    altitude: number): number => {
    return Math.ceil(DistancePenetrationDragTable.getLinear(drag, altitude, grossweight));
}



//================================================================================================
// Time Penetration Descent
//================================================================================================

const TimePenetrationDescent_Drag0 = new CorrectionTable(
    'Time Penetration Descent Drag 0',
    new Map([
        [0, new CorrectionVector([0, 0, 0])],
        [5000, new CorrectionVector([-1.32, 0.000152, -1.61E-09])],
        [10000, new CorrectionVector([1.39, 0.000063, -4.02E-42])],
        [15000, new CorrectionVector([-1.39, 0.000285, -2.5E-09])],
        [20000, new CorrectionVector([-0.536, 0.000317, -2.68E-09])],
        [25000, new CorrectionVector([-0.286, 0.000386, -3.39E-09])],
        [30000, new CorrectionVector([-1.25, 0.000525, -5E-09])],
        [35000, new CorrectionVector([2.36, 0.000404, -3.21E-09])]
    ])
);
const TimePenetrationDescent_Drag4 = new CorrectionTable(
    'Time Penetration Descent Drag 4',
    new Map([
        [0, new CorrectionVector([0, 0, 0])],
        [5000, new CorrectionVector([-1.57, 0.000152, -1.61E-09])],
        [10000, new CorrectionVector([-1.54, 0.000217, -2.32E-09])],
        [15000, new CorrectionVector([-1.29, 0.000262, -2.5E-09])],
        [20000, new CorrectionVector([-1.89, 0.000359, -3.39E-09])],
        [25000, new CorrectionVector([-1.32, 0.000395, -3.57E-09])],
        [30000, new CorrectionVector([-2, 0.00052, -5.18E-09])],
        [35000, new CorrectionVector([0.821, 0.000413, -3.39E-09])]
    ])
);


const TimePenetrationDescent_Drag8 = new CorrectionTable(
    'Time Penetration Descent Drag 8',
    new Map([
        [0, new CorrectionVector([0, 0, 0])],
        [5000, new CorrectionVector([-0.607, 8.7E-05, -8.93E-10])],
        [10000, new CorrectionVector([-0.5, 1.24E-04, -8.93E-10])],
        [15000, new CorrectionVector([-0.393, 1.86E-04, -1.57E-09])],
        [20000, new CorrectionVector([-1.79, 3.36E-04, -3.39E-09])],
        [25000, new CorrectionVector([-0.179, 2.99E-04, -2.5E-09])],
        [30000, new CorrectionVector([-0.179, 3.73E-04, -3.39E-09])],
        [35000, new CorrectionVector([-0.786, 4.6E-04, -4.29E-09])]
    ])
);

const TimePenetrationDragTable = new DragCorrectionTable(
    'Time Penetration Descent',
    new Map([
        [0, TimePenetrationDescent_Drag0],
        [4, TimePenetrationDescent_Drag4],
        [8, TimePenetrationDescent_Drag8]
    ])
);


//================================================================================================
// Fuel Penetration Descent
//================================================================================================

const FuelPenetrationDescent_Drag0 = new CorrectionTable(
    'Fuel Penetration Descent Drag 0',
    new Map([
        [0, new CorrectionVector([0, 0, 0])],
        [5000, new CorrectionVector([13.4, 0.00162, -7.14E-09])],
        [10000, new CorrectionVector([-35.7, 0.00682, -6.43E-08])],
        [15000, new CorrectionVector([-47.9, 0.0101, -9.64E-08])],
        [20000, new CorrectionVector([-55, 0.0131, -1.21E-07])],
        [25000, new CorrectionVector([-27.1, 0.0147, -1.36E-07])],
        [30000, new CorrectionVector([-40.7, 0.0182, -1.68E-07])],
        [35000, new CorrectionVector([-15.7, 0.0198, -1.82E-07])]
    ])
);

const FuelPenetrationDescent_Drag4 = new CorrectionTable(
    'Fuel Penetration Descent Drag 4',
    new Map([
        [0, new CorrectionVector([0, 0, 0])],
        [5000, new CorrectionVector([-14.6, 0.00255, -1.93E-08])],
        [10000, new CorrectionVector([-20.7, 0.00538, -4.79E-08])],
        [15000, new CorrectionVector([-20.7, 0.00772, -6.79E-08])],
        [20000, new CorrectionVector([-14.1, 0.00958, -7.86E-08])],
        [25000, new CorrectionVector([-20.1, 0.0126, -1.11E-07])],
        [30000, new CorrectionVector([-63.6, 0.0178, -1.68E-07])],
        [35000, new CorrectionVector([-11.6, 0.0175, -1.57E-07])]
    ])
);

const FuelPenetrationDescent_Drag8 = new CorrectionTable(
    'Fuel Penetration Descent Drag 8',
    new Map([
        [0, new CorrectionVector([0, 0, 0])],
        [5000, new CorrectionVector([10, 0.001, 0])],
        [10000, new CorrectionVector([-16.7, 0.00467, -4.07E-08])],
        [15000, new CorrectionVector([-28.6, 0.00746, -6.79E-08])],
        [20000, new CorrectionVector([-38, 0.01, -8.93E-08])],
        [25000, new CorrectionVector([-32.1, 0.0123, -1.14E-07])],
        [30000, new CorrectionVector([-31.4, 0.0145, -1.32E-07])],
        [35000, new CorrectionVector([2.86, 0.015, -1.32E-07])]
    ])
);

const FuelPenetrationDragTable = new DragCorrectionTable(
    'Fuel Penetration Descent',
    new Map([
        [0, FuelPenetrationDescent_Drag0],
        [4, FuelPenetrationDescent_Drag4],
        [8, FuelPenetrationDescent_Drag8],
    ])
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
        [10000, new CorrectionVector([-1.43, 0.000567, -4.29E-09])],
        // -0,286 + 8,08E-04x + -6,43E-09x^2
        [15000, new CorrectionVector([-0.286, 0.000808, -6.43E-09])],
        // -6,71 + 1,49E-03x + -1,36E-08x^2
        [20000, new CorrectionVector([-6.71, 0.00149, -1.36E-08])],
        // -9,57 + 1,93E-03x + -1,71E-08x^2
        [25000, new CorrectionVector([-9.57, 0.00193, -1.71E-08])],
        // -8,57 + 2,25E-03x + -2E-08x^2
        [30000, new CorrectionVector([-8.57, 0.00225, -2E-08])],
        // -6,43 + 2,49E-03x + -2,21E-08x^2
        [35000, new CorrectionVector([-6.43, 0.00249, -2.21E-08])]
    ])
);

const DistancePenetrationDescent_Drag4 = new CorrectionTable(
    'Distance Penetration Descent Drag 4',
    new Map([
        [0, new CorrectionVector([0, 0, 0])],
        // -10,9 + 8,53E-04x + -1E-08x^2
        [5000, new CorrectionVector([-10.9, 0.000853, -1E-08])],
        // -3,29 + 5,31E-04x + -3,57E-09x^2
        [10000, new CorrectionVector([-3.29, 0.000531, -3.57E-09])],
        // -8,29 + 1,1E-03x + -1E-08x^2
        [15000, new CorrectionVector([-8.29, 0.0011, -1E-08])],
        // -9,57 + 1,46E-03x + -1,29E-08x^2
        [20000, new CorrectionVector([-9.57, 0.00146, -1.29E-08])],
        // -10 + 1,8E-03x + -1,64E-08x^2
        [25000, new CorrectionVector([-10, 0.0018, -1.64E-08])],
        // -11,6 + 2,23E-03x + -2,07E-08x^2
        [30000, new CorrectionVector([-11.6, 0.00223, -2.07E-08])],
        // -2,14 + 2,04E-03x + -1,71E-08x^2
        [35000, new CorrectionVector([-2.14, 0.00204, -1.71E-08])]
    ])
);

const DistancePenetrationDescent_Drag8 = new CorrectionTable(
    'Distance Penetration Descent Drag 8',
    new Map([
        [0, new CorrectionVector([0, 0, 0])],
        // -8,29 + 6,08E-04x + -6,43E-09x^2
        [5000, new CorrectionVector([-8.29, 0.000608, -6.43E-09])],
        // -6,71 + 6,99E-04x + -6,43E-09x^2
        [10000, new CorrectionVector([-6.71, 0.000699, -6.43E-09])],
        // -2,86 + 7,56E-04x + -6,43E-09x^2
        [15000, new CorrectionVector([-2.86, 0.000756, -6.43E-09])],
        // -5,29 + 1,13E-03x + -9,29E-09x^2
        [20000, new CorrectionVector([-5.29, 0.00113, -9.29E-09])],
        // -8,14 + 1,54E-03x + -1,36E-08x^2
        [25000, new CorrectionVector([-8.14, 0.00154, -1.36E-08])],
        // -12 + 2,1E-03x + -2E-08x^2
        [30000, new CorrectionVector([-12, 0.0021, -2E-08])],
        // -14,4 + 2,49E-03x + -2,36E-08x^2
        [35000, new CorrectionVector([-14.4, 0.00249, -2.36E-08])]
    ])
);

const DistancePenetrationDragTable = new DragCorrectionTable(
    'Distance Penetration Descent',
    new Map([
        [0, DistancePenetrationDescent_Drag0],
        [4, DistancePenetrationDescent_Drag4],
        [8, DistancePenetrationDescent_Drag8],
    ])
);








