import { QNH, QNH_Unit } from './../components/models';

const convertAltitudeUnits = (qnh: QNH) => {
  if (qnh.unit == QNH_Unit.inMg)
    return (qnh.value = Math.round((qnh.value / 1013) * 2992) / 100);

  return (qnh.value = Math.round((qnh.value / 29.92) * 1013));
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

const getStdTemp = (altitude: number): number => {
  return -1.98e-3 * altitude + 15;
};

const deltaFromStandardTemp = (altitude: number, temp: number): number => {
  const standardTemp = getStdTemp(altitude);
  return temp - standardTemp;
};

export {
  convertAltitudeUnits,
  PressureAltitude,
  deltaFromStandardTemp,
  getStdTemp,
};
