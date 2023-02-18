export const GroundRun = (
  takeoffIndex: number,
  weight: number,
  headWind: number
): number => {
  let increment = 0;
  let groundRunDist = 0;

  if (weight >= 30000 && weight < 35000) {
    increment =
      (GroundRunFormula(vectors_GR[35], takeoffIndex) -
        GroundRunFormula(vectors_GR[30], takeoffIndex)) /
      5000;
    groundRunDist =
      GroundRunFormula(vectors_GR[30], takeoffIndex) +
      increment * (weight - 30000);
  }
  if (weight >= 35000 && weight < 40000) {
    increment =
      (GroundRunFormula(vectors_GR[40], takeoffIndex) -
        GroundRunFormula(vectors_GR[35], takeoffIndex)) /
      5000;
    groundRunDist =
      GroundRunFormula(vectors_GR[35], takeoffIndex) +
      increment * (weight - 35000);
  }
  if (weight >= 40000 && weight < 45000) {
    increment =
      (GroundRunFormula(vectors_GR[45], takeoffIndex) -
        GroundRunFormula(vectors_GR[40], takeoffIndex)) /
      5000;
    groundRunDist =
      GroundRunFormula(vectors_GR[40], takeoffIndex) +
      increment * (weight - 40000);
  }
  if (weight >= 45000)
    groundRunDist = GroundRunFormula(vectors_GR[45], takeoffIndex);

  // Apply headwing Correction
  if (groundRunDist < 2000) {
    increment =
      (GR_windCorrectFormula(vectors_GR_wind[2000], headWind) -
        GR_windCorrectFormula(vectors_GR_wind[1000], headWind)) /
      1000;
    return (
      GR_windCorrectFormula(vectors_GR_wind[1000], headWind) +
      increment * (groundRunDist - 1000)
    );
  }
  if (groundRunDist >= 2000 && groundRunDist < 3000) {
    increment =
      (GR_windCorrectFormula(vectors_GR_wind[3000], headWind) -
        GR_windCorrectFormula(vectors_GR_wind[2000], headWind)) /
      1000;
    return (
      GR_windCorrectFormula(vectors_GR_wind[2000], headWind) +
      increment * (groundRunDist - 2000)
    );
  }
  if (groundRunDist >= 3000 && groundRunDist < 4000) {
    increment =
      (GR_windCorrectFormula(vectors_GR_wind[4000], headWind) -
        GR_windCorrectFormula(vectors_GR_wind[3000], headWind)) /
      1000;
    return (
      GR_windCorrectFormula(vectors_GR_wind[3000], headWind) +
      increment * (groundRunDist - 3000)
    );
  }
  if (groundRunDist >= 4000 && groundRunDist < 5000) {
    increment =
      (GR_windCorrectFormula(vectors_GR_wind[5000], headWind) -
        GR_windCorrectFormula(vectors_GR_wind[4000], headWind)) /
      1000;
    return (
      GR_windCorrectFormula(vectors_GR_wind[4000], headWind) +
      increment * (groundRunDist - 4000)
    );
  }
  if (groundRunDist >= 5000) {
    increment =
      (GR_windCorrectFormula(vectors_GR_wind[6000], headWind) -
        GR_windCorrectFormula(vectors_GR_wind[5000], headWind)) /
      1000;
    return (
      GR_windCorrectFormula(vectors_GR_wind[5000], headWind) +
      increment * (groundRunDist - 5000)
    );
  }
  return 0;
};

/*
  Ground run formulas
*/

const vectors_GR = {
  30: [6536, -495, -2.38],
  35: [10202, -879, 5.36],
  40: [15521, -1492, 20.5],
  45: [23743, -2592, 56],
};

const GroundRunFormula = (coeff: number[], takeoffIndex: number): number => {
  return (
    coeff[0] + coeff[1] * takeoffIndex + coeff[2] * takeoffIndex * takeoffIndex
  );
};

const vectors_GR_wind = {
  1000: [-13.5, 975],
  2000: [-24.5, 1950],
  3000: [-34.5, 2925],
  4000: [-53, 4150],
  5000: [-51, 4750],
  6000: [-66, 5950],
};
const GR_windCorrectFormula = (coeff: number[], headWind: number): number => {
  return coeff[0] * headWind + coeff[1];
};
