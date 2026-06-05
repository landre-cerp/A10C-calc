import { FLAPS } from './TakeoffEnums.js';

export const TakeoffSpeed = (
  weight: number,
  flaps: FLAPS = FLAPS.TO,
): number => {
  if (flaps === FLAPS.UP) {
    return 52.4 + weight * (2.67e-3 + weight * -1.1e-8);
  }

  return 43.8 + weight * (3.11e-3 + weight * (-2.38e-8 + weight * 1.08e-13));
};

export const RotationSpeed = (
  weight: number,
  flaps: FLAPS = FLAPS.TO,
): number => TakeoffSpeed(weight, flaps) - 10;
