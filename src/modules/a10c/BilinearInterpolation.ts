export interface Table2D {
  xAxis: readonly number[];
  yAxis: readonly number[];
  matrix: readonly (readonly number[])[];
}

const INVALID_VALUE = -1;

export function bilinearInterpolate(
  table: Table2D,
  x: number,
  y: number,
): number {
  const { xAxis, yAxis, matrix } = table;

  if (!isInRange(xAxis, x) || !isInRange(yAxis, y)) {
    return INVALID_VALUE;
  }

  const i = findInterval(xAxis, x);
  const j = findInterval(yAxis, y);

  const x1 = xAxis[i];
  const x2 = xAxis[i + 1];
  const y1 = yAxis[j];
  const y2 = yAxis[j + 1];

  const q11 = matrix[i]?.[j] ?? INVALID_VALUE;
  const q21 = matrix[i + 1]?.[j] ?? INVALID_VALUE;
  const q12 = matrix[i]?.[j + 1] ?? INVALID_VALUE;
  const q22 = matrix[i + 1]?.[j + 1] ?? INVALID_VALUE;

  const t = x2 === x1 ? 0 : (x - x1) / (x2 - x1);
  const u = y2 === y1 ? 0 : (y - y1) / (y2 - y1);

  return weightedAverage([
    [q11, (1 - t) * (1 - u)],
    [q21, t * (1 - u)],
    [q12, (1 - t) * u],
    [q22, t * u],
  ]);
}

function weightedAverage(points: ReadonlyArray<readonly [number, number]>): number {
  let result = 0;

  for (const [value, weight] of points) {
    if (weight === 0) {
      continue;
    }

    if (value === INVALID_VALUE) {
      return INVALID_VALUE;
    }

    result += value * weight;
  }

  return result;
}

function isInRange(axis: readonly number[], value: number): boolean {
  return value >= axis[0] && value <= axis[axis.length - 1];
}

function findInterval(arr: readonly number[], val: number): number {
  for (let i = 0; i < arr.length - 1; i++) {
    if (val >= arr[i] && val <= arr[i + 1]) {
      return i;
    }
  }

  return arr.length - 2;
}
