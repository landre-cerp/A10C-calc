import { QNH, QNH_Unit } from './../components/models';
import { IWind, Wind, WindDirections } from 'src/service/conversionTool';
import {
  convertAltitudeUnits,
  deltaFromStandardTemp,
  PressureAltitude,

} from 'src/service/conversionTool';

import { defineStore } from 'pinia';
import { RCR } from 'src/service/calculators/Rcr';

export const useAirportStore = defineStore('airport', {
  state: () => ({
    Temp: 15,
    AirportElevation: 0 as number,
    WindDirection: 0 as number,
    WindSpeed: 0 as number,
    Qnh: { value: 1013, unit: QNH_Unit.hPa } as QNH,
    runwayLength: 0 as number,
    runwayQFU: 0 as number,
    rcr: RCR.DRY as number,
  }),

  getters: {
    AirportPressureAltitude(): number {
      return Math.ceil(PressureAltitude(this.AirportElevation, this.Qnh));
    },

    DeltaTemp(): number {
      return (
        Math.ceil(
          deltaFromStandardTemp(this.AirportElevation, this.Temp) * 10
        ) / 10
      );
    },

    RelativeHeadwind(): number {

      const wind = new Wind(this.WindDirection, this.WindSpeed);
      const { front, longitudinalDirection } = wind.Winds(this.runwayQFU);

      if (longitudinalDirection == WindDirections.Head) {
        return front;
      }
      else {
        return - front;
      }

    },

    Winds(): IWind {
      return new Wind(this.WindDirection, this.WindSpeed).Winds(this.runwayQFU);
    }

  },

  actions: {
    switchQnhUnit() {
      this.Qnh.unit = (this.Qnh.unit + 1) % 2;
      this.Qnh.value = convertAltitudeUnits(this.Qnh);
    },
  },
});
