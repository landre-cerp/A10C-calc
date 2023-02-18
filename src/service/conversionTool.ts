import { QNH, QNH_Unit } from './../components/models';

const convertAltitudeUnits = (qnh: QNH) => {
  if (qnh.unit == QNH_Unit.inMg)
    return (qnh.value = Math.round((qnh.value / 1013) * 2992) / 100);

  return (qnh.value = Math.round((qnh.value / 29.92) * 1013));
};

const ApplyDeltaTempTCorrection = (
  selector: (delta: number) => Map<number, number[]>,
  initialNumber: number,
  deltaT: number,
  startRange: number,
  step: number
) => {
  const correctionTable = selector(deltaT);
  const startCoeff = correctionTable.get(startRange);
  const endCoeff = correctionTable.get(startRange + step);

  const startCompute = deltaT * startCoeff[0] + startCoeff[1];
  const endCompute = deltaT * endCoeff[0] + endCoeff[1];

  const increment = (endCompute - startCompute) / step;
  return startCompute + increment * (initialNumber - startRange);
};

const PressureAltitude = (altitude: number, Qnh: QNH): number => {
  let pressAlt = 0;
  if (Qnh.unit == QNH_Unit.hPa) {
    pressAlt = 30 * (1013 - Qnh.value);
  } else if (Qnh.unit == QNH_Unit.inMg) {
    pressAlt = 1000 * (29.92 - Qnh.value);
  }
  pressAlt = altitude + pressAlt;

  return pressAlt;
};

export { convertAltitudeUnits, ApplyDeltaTempTCorrection, PressureAltitude };
