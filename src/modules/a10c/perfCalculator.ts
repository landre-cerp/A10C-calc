import { ICorrectionTable } from './CorrectionTable';

export type Drag = number;
export type DeltaT = number;
export type Altitude = number;

export abstract class PerfCalculator {
  constructor(
    private name: string,
    protected correctionTable: ICorrectionTable
  ) {}

  public getName(): string {
    return this.name;
  }

  abstract Calc(...params: number[]): number;
}
