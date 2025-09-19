/*===============================================================================================
 Generic Correction Table
 is used to get the correction table for a given value.

For example,
        [25000, [-1.07, 0.814, -0.0242, 1.2e-3, 3.03e-6]],
        [30000, [8.5, -2.35, 0.369, -0.017, 2.94e-4]],
        [35000, [4.75, -0.657, 0.187, -9.5e-3, 2.17e-4]],
        [40000, [21.4, -7.62, 1.14, -0.0581, 1.08e-3]],
        [45000, [2.5, 0.1, 0.228, -0.016, 4.67e-4]],
        [50000, [0, 0, 0, 0, 1]],

        ranges = [25000, 30000, 35000, 40000, 45000, 50000]

        and interval for value = 28000 is [25000, 30000]

        then the calcultaor should calculate result for 25000 and 30000 , then interpolate the result
*/
export class CorrectionTable {
    correctionTables;
    ranges = [];
    name;
    constructor(name, correctionTables) {
        this.correctionTables = correctionTables;
        this.name = name;
        // instantiate the ranges from the table values.
        this.ranges = Array.from(correctionTables.keys()).sort((a, b) => a - b);
    }
    /**
     * @param value The drag value to get the correction table for
     * @returns The correction tables for the drag value (low and high)
     */
    getInterval(value) {
        // find low and high index in ranges given the value
        let lowIndex = this.ranges.length - 1;
        let highIndex = 0;
        while (value < this.ranges[lowIndex] && lowIndex > 0) {
            lowIndex--;
        }
        while (value > this.ranges[highIndex] &&
            highIndex < this.ranges.length - 1) {
            highIndex++;
        }
        const lowRange = this.ranges[lowIndex];
        const highRange = this.ranges[highIndex];
        const lowTable = this.correctionTables.get(lowRange);
        const highTable = this.correctionTables.get(highRange);
        return [
            lowTable ? lowTable : new CorrectionVector([]),
            highTable ? highTable : new CorrectionVector([]),
            highRange - lowRange,
            lowRange,
        ];
    }
    GetLinear(intervalValue, value) {
        const [lowVector, highVector, step, lowRangeStart] = this.getInterval(intervalValue);
        const returnValue = lowVector.calc(value);
        if (step == 0) {
            return returnValue;
        }
        const highVal = highVector.calc(value);
        return (returnValue +
            ((highVal - returnValue) / step) * (intervalValue - lowRangeStart));
    }
}
export class CorrectionVector {
    vector;
    constructor(vector) {
        this.vector = vector;
    }
    calc(x) {
        let result = 0;
        for (let i = 0; i < this.vector.length; i++) {
            const coeff = this.vector[i];
            result += coeff * Math.pow(x, i);
        }
        return result;
    }
}
export class PosNegCorrectionTable {
    positive;
    negative;
    name;
    constructor(name, positive, negative) {
        this.positive = positive;
        this.negative = negative;
        this.name = name;
    }
    getInterval(intervalValue, value) {
        const mapToUse = value > 0 ? this.positive : this.negative;
        return mapToUse.getInterval(intervalValue);
    }
    GetLinear(intervalValue, value) {
        const [lowVector, highVector, step, lowRangeStart] = this.getInterval(intervalValue, value);
        const returnValue = lowVector.calc(value);
        if (step == 0) {
            return returnValue;
        }
        const highVal = highVector.calc(value);
        return (returnValue +
            ((highVal - returnValue) / step) * (intervalValue - lowRangeStart));
    }
}
export class DragCorrectionTable {
    dragTable;
    name;
    ranges = [];
    constructor(name, dragTable) {
        this.dragTable = dragTable;
        this.name = name;
        this.ranges = Array.from(this.dragTable.keys()).sort((a, b) => a - b);
    }
    /**
     *
     * @param drag Value to get the intervals for
     * @returns [lowDragTable, highDragTable, step, lowRangeStart]
     * @example const [lowDragTable, highDragTable, step, lowRangeStart] = dragTable.getInterval(drag);
     
     */
    getInterval(drag) {
        // find low and high index in ranges given the value
        let lowIndex = this.ranges.length - 1;
        let highIndex = 0;
        while (drag < this.ranges[lowIndex] && lowIndex > 0) {
            lowIndex--;
        }
        while (drag > this.ranges[highIndex] &&
            highIndex < this.ranges.length - 1) {
            highIndex++;
        }
        const lowDragRange = this.ranges[lowIndex];
        const highDragRange = this.ranges[highIndex];
        const lowDragTable = this.dragTable.get(lowDragRange);
        const highDragTable = this.dragTable.get(highDragRange);
        return [
            lowDragTable ? lowDragTable : new CorrectionTable('', new Map()),
            highDragTable ? highDragTable : new CorrectionTable('', new Map()),
            highDragRange - lowDragRange,
            lowDragRange,
        ];
    }
    getLinear(drag, intervalValue, knownValue) {
        const [v, vnext, step, startDrag] = this.getInterval(drag);
        let wantedValue = v.GetLinear(intervalValue, knownValue);
        if (step != 0) {
            const nexWantedValue = vnext.GetLinear(intervalValue, knownValue);
            const increment = (nexWantedValue - wantedValue) / step;
            wantedValue =
                wantedValue + (increment > 0 ? increment * (drag - startDrag) : 0);
        }
        return wantedValue;
    }
}
