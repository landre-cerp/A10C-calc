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

export interface ICorrectionTable {
  name: string;
  /**
   * Get the correction table for the given value
   * @param value The value to get the correction table for
   * @returns The correction table for the given value
   * @example const [low, high, delta] = vectors_TOI.getInterval(pressureAltitude);
   * const lowVal = low.calc(temp);
   * const highVal = high.calc(temp);
   * const result = lowVal + (highVal - lowVal) * delta;
   */
  getInterval: (
    value: number
  ) => [
    lowVector: CorrectionVector,
    highVector: CorrectionVector,
    step: number,
    LowRangeValue: number
  ];

  /**
   *
   * @param intervalValue The value to get the correction table for
   * @param value The value to get the result for
   * @returns The result for the given value
   * @example const result = vectors_TOI.GetLinear(pressureAltitude, temp);
   * because the CorrectionTable is made of one vector per altitude,
   */
  GetLinear: (intervalValue: number, value: number) => number;
}

export class CorrectionTable implements ICorrectionTable {
  private ranges: number[] = [];
  public name: string;

  constructor(
    name: string,
    private correctionTables: Map<number, CorrectionVector>
  ) {
    this.name = name;
    // instantiate the ranges from the table values.
    this.ranges = Array.from(correctionTables.keys()).sort((a, b) => a - b);
  }

  /**
   * @param value The drag value to get the correction table for
   * @returns The correction tables for the drag value (low and high)
   */
  public getInterval(
    value: number
  ): [CorrectionVector, CorrectionVector, number, number] {
    // find low and high index in ranges given the value
    let lowIndex = this.ranges.length - 1;
    let highIndex = 0;

    while (value < this.ranges[lowIndex] && lowIndex > 0) {
      lowIndex--;
    }

    while (
      value > this.ranges[highIndex] &&
      highIndex < this.ranges.length - 1
    ) {
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

  GetLinear(intervalValue: number, value: number) {
    const [lowVector, highVector, step, lowRangeStart] =
      this.getInterval(intervalValue);

    const returnValue = lowVector.calc(value);

    if (step == 0) {
      return returnValue;
    }
    const highVal = highVector.calc(value);

    return (
      returnValue +
      ((highVal - returnValue) / step) * (intervalValue - lowRangeStart)
    );
  }
}

interface IVector {
  calc(x: number): number;
}

export class CorrectionVector implements IVector {
  constructor(private vector: number[]) {}

  public calc(x: number): number {
    let result = 0;
    for (let i = 0; i < this.vector.length; i++) {
      const coeff = this.vector[i];
      result += coeff * Math.pow(x, i);
    }
    return result;
  }
}

export class PosNegCorrectionTable {
  name: string;

  constructor(
    name: string,
    private positive: ICorrectionTable,
    private negative: ICorrectionTable
  ) {
    this.name = name;
  }

  getInterval(
    intervalValue: number,
    value: number
  ): [CorrectionVector, CorrectionVector, number, number] {
    const mapToUse = value > 0 ? this.positive : this.negative;

    return mapToUse.getInterval(intervalValue);
  }

  GetLinear(intervalValue: number, value: number) {
    const [lowVector, highVector, step, lowRangeStart] = this.getInterval(
      intervalValue,
      value
    );
    const returnValue = lowVector.calc(value);

    if (step == 0) {
      return returnValue;
    }
    const highVal = highVector.calc(value);
    return (
      returnValue +
      ((highVal - returnValue) / step) * (intervalValue - lowRangeStart)
    );
  }
}

export class DragCorrectionTable {
  name: string;
  private ranges: number[] = [];

  constructor(name: string, private dragTable: Map<number, ICorrectionTable>) {
    this.name = name;
    this.ranges = Array.from(this.dragTable.keys()).sort((a, b) => a - b);
  }

  getInterval(
    drag: number
  ): [ICorrectionTable, ICorrectionTable, number, number] {
    // find low and high index in ranges given the value
    let lowIndex = this.ranges.length - 1;
    let highIndex = 0;

    while (drag < this.ranges[lowIndex] && lowIndex > 0) {
      lowIndex--;
    }

    while (
      drag > this.ranges[highIndex] &&
      highIndex < this.ranges.length - 1
    ) {
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
}
