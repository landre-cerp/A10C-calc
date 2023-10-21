export const TakeoffSpeed = (weight: number): number => {
  return (
    43.8 + 3.11e-3 * weight + -2.38e-8 * weight ** 2 + 1.08e-13 * weight ** 3
  );
};
