export enum RCR {
  DRY = 23,
  WET = 12,
  ICY = 5,
}
export const RCRWithoutAntiSkid = (rcr: number): number => {
  return 0.695 * rcr + 6.15e-3;
};
