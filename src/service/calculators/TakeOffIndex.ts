export const TakeoffIndex = (
  temp: number,
  pressureAltitude: number
): number => {
  let increment = 0;
  let toi = 4;

  if (pressureAltitude < 2000) {
    increment =
      (TOI(vectors_TOI[2000], temp) - TOI(vectors_TOI[0], temp)) / 2000;
    toi = TOI(vectors_TOI[0], temp) + increment * pressureAltitude;
  }
  if (pressureAltitude >= 2000 && pressureAltitude < 4000) {
    increment =
      (TOI(vectors_TOI[4000], temp) - TOI(vectors_TOI[2000], temp)) / 2000;
    toi = TOI(vectors_TOI[2000], temp) + increment * (pressureAltitude - 2000);
  }

  if (pressureAltitude >= 4000 && pressureAltitude < 6000) {
    increment =
      (TOI(vectors_TOI[6000], temp) - TOI(vectors_TOI[4000], temp)) / 2000;
    toi = TOI(vectors_TOI[4000], temp) + increment * (pressureAltitude - 4000);
  }

  if (pressureAltitude >= 6000) toi = TOI(vectors_TOI[6000], temp);
  if (toi < 4) toi = 4;
  if (toi > 11) toi = 11;

  return toi;
};

/*
  TAKE OFF INDEX
*/
const vectors_TOI = {
  0: [10.4, -0.0241, -4.11e-4],
  2000: [9.93, -0.0306, -3.8e-4],
  4000: [9.5, -0.0401, -4.81e-4],
  6000: [8.98, -0.0471, -6.2e-4],
};

const TOI = (coeff: number[], temp: number) => {
  return coeff[0] + coeff[1] * temp + coeff[2] * temp * temp;
};
