
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

export interface IWind {
  front: number;
  cross: number;
  longitudinalDirection: WindDirections.Head | WindDirections.Tail | WindDirections.Neutral;
  lateralDirection: WindDirections.CrossLeft | WindDirections.CrossRight | WindDirections.Neutral;
}


export enum WindDirections { Head, Tail, CrossLeft, CrossRight, Neutral }

export class Wind {
  constructor(public direction: number, public speed: number) { }

  Winds(course: number): IWind {

    const [headOrTailWind, direction] = this.HeadOrTailwind(course);
    const [crossWind, crossDirection] = this.CrossWind(course);

    return { front: headOrTailWind, cross: crossWind, longitudinalDirection: direction, lateralDirection: crossDirection };

  }

  HeadOrTailwind(course: number): [number, WindDirections.Head | WindDirections.Tail | WindDirections.Neutral] {
    const [angle, headOrTail] = this.getAngle(course);
    const headOrTailWind = Math.abs(this.speed * Math.cos(angle / 180 * Math.PI));

    return [Math.ceil(10 * headOrTailWind) / 10, headOrTail];
  }

  CrossWind(course: number): [number, WindDirections.CrossLeft | WindDirections.CrossRight | WindDirections.Neutral] {

    const [angle, , crossDirection] = this.getAngle(course);
    const crossWind = Math.abs(this.speed * Math.sin(angle / 180 * Math.PI));

    return [Math.ceil(10 * crossWind) / 10, crossDirection];
  }

  private getAngle(course: number): [
    number, WindDirections.Head | WindDirections.Tail | WindDirections.Neutral,
    WindDirections.CrossLeft | WindDirections.CrossRight | WindDirections.Neutral] {
    let angle = (this.direction + 360 - course) % 360;
    let headtailDirection: WindDirections.Head | WindDirections.Tail | WindDirections.Neutral = WindDirections.Neutral;
    let crossDirection: WindDirections.CrossLeft | WindDirections.CrossRight | WindDirections.Neutral = WindDirections.Neutral;

    if (angle < 90 || angle > 270) headtailDirection = WindDirections.Head;
    if (angle > 90 && angle < 270) headtailDirection = WindDirections.Tail;
    if (angle > 0 && angle < 180) crossDirection = WindDirections.CrossRight
    if (angle > 180 && angle < 360) crossDirection = WindDirections.CrossLeft

    if (headtailDirection == WindDirections.Tail) {
      angle = Math.abs(180 - angle);
    }

    return [angle, headtailDirection, crossDirection];

  }

  ReverseCourse(course: number): number {
    return (course + 180) % 360;
  }

}


export {
  convertAltitudeUnits,
  PressureAltitude,
  deltaFromStandardTemp,
  getStdTemp,
};
