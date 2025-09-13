import { QNH, QNH_Unit } from './../components/models';
import { IWind, Wind, WindDirections } from 'src/service/Wind';
import {
  convertAltitudeUnits,
  deltaFromStandardTemp,
  PressureAltitude,
} from 'src/service/conversionTool';
import { ValidationService } from 'src/service/validation.service';

import { defineStore } from 'pinia';
import { RCR } from 'src/modules/a10c/Rcr';

/**
 * Landing Store
 * Manages state for landing calculations and airport conditions
 */
export const useLandingStore = defineStore('landing', {
  state: () => ({
    Temp: 15,
    AirportElevation: 0 as number,
    WindDirection: 0 as number,
    WindSpeed: 0 as number,
    Qnh: { value: 1013, unit: QNH_Unit.hPa } as QNH,
    runwayLength: 0 as number,
    runwayQFU: 0 as number,
    rcr: RCR.DRY as number,
    // Note: This should be handled by the aircraft store
    grossWeight: 0 as number,
  }),

  getters: {
    AirportPressureAltitude(): number {
      return Math.ceil(PressureAltitude(this.AirportElevation, this.Qnh));
    },

    DeltaTemp(): number {
      return (
        Math.ceil(
          deltaFromStandardTemp(this.AirportElevation, this.Temp) * 10,
        ) / 10
      );
    },

    RelativeHeadwind(): number {
      const wind = new Wind(this.WindDirection, this.WindSpeed);
      const { front, longitudinalDirection } = wind.Winds(this.runwayQFU);

      if (longitudinalDirection == WindDirections.Head) {
        return front;
      } else {
        return -front;
      }
    },

    Winds(): IWind {
      return new Wind(this.WindDirection, this.WindSpeed).Winds(
        this.runwayQFU,
      );
    },
  },

  actions: {
    switchQnhUnit() {
      this.Qnh.unit = (this.Qnh.unit + 1) % 2;
      this.Qnh.value = convertAltitudeUnits(this.Qnh);
    },

    /**
     * Set airport temperature with validation
     * @param temperature - Temperature in Celsius
     */
    setTemperature(temperature: number): void {
      const sanitized = ValidationService.sanitizeNumber(temperature, this.Temp, -50, 60);
      this.Temp = sanitized;
    },

    /**
     * Set airport elevation with validation
     * @param elevation - Elevation in feet
     */
    setElevation(elevation: number): void {
      const sanitized = ValidationService.sanitizeNumber(elevation, this.AirportElevation);
      this.AirportElevation = sanitized;
    },

    /**
     * Set wind conditions with validation
     * @param direction - Wind direction in degrees (0-360)
     * @param speed - Wind speed in knots
     */
    setWind(direction: number, speed: number): void {
      const sanitizedDirection = ValidationService.sanitizeNumber(direction, this.WindDirection, 0, 360);
      const sanitizedSpeed = ValidationService.sanitizeNumber(speed, this.WindSpeed, 0);
      
      this.WindDirection = sanitizedDirection;
      this.WindSpeed = sanitizedSpeed;
    },

    /**
     * Set runway information with validation
     * @param length - Runway length in feet
     * @param qfu - Runway heading in degrees
     */
    setRunway(length: number, qfu: number): void {
      const sanitizedLength = ValidationService.sanitizeNumber(length, this.runwayLength, 0);
      const sanitizedQfu = ValidationService.sanitizeNumber(qfu, this.runwayQFU, 0, 360);
      
      this.runwayLength = sanitizedLength;
      this.runwayQFU = sanitizedQfu;
    },
  },
});