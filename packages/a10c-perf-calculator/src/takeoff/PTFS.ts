export const PTFS = (temp: number): number => {
  if (temp <= -35) {
    return 0.05 * temp + 88.1;
  } else {
    return 84.6 - 0.0915 * temp - 1.05e-3 * temp * temp;
  }
};
