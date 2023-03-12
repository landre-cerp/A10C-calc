import {
    CorrectionTable,
    CorrectionVector,

} from '../CorrectionTable';

export const SpeedForMaxRangeDescent = (
    grossweight: number,
    drag: number): number => {
    return MaxRangeSpeedTable.GetLinear(grossweight, drag);
}


/// Tables

const MaxRangeSpeedTable = new CorrectionTable(
    'Max Range Speed',
    new Map([
        [25000, new CorrectionVector([135, -0.725, -0.0313])],
        [30000, new CorrectionVector([147, -0.95, 0])],
        [35000, new CorrectionVector([159, -1, 0])],
        [40000, new CorrectionVector([169, -1.14, 0.0156])],
        [45000, new CorrectionVector([179, -1.28, 0.0313])],
        [50000, new CorrectionVector([190, -1.25, 0])],
    ])
);
