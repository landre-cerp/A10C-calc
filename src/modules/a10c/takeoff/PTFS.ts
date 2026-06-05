export const PTFS = (temp: number): number => {
  if (temp <= -30) {
    return 0.1355 * temp + 90.529;
  }

  const k = 84.49667731507539;
  const a = -0.09989323265199185;
  const b = -0.0010014770789936352;
  const c = 0.000005170931496965901;

  return k + temp * (a + temp * (b + temp * c));
};
