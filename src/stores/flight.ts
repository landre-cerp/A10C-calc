
import { IFlightPhase, PhaseType, QNH } from './../components/models';
import { defineStore } from 'pinia';

import { FlightPhase } from 'src/service/FlightPhase';
import { FlightPhaseFactory } from 'src/service/FlightPhaseFactory';
import { PressureAltitude } from 'src/service/conversionTool';

import { FlightGraph } from 'src/service/FlightPhase';

export const useFlightStore = defineStore('flight', {
  state: () => ({
    Qnh: {} as QNH,
    FlightLevel: 160 as number,
    fuelReserve: 1500 as number,
    missionRange: 0 as number,
    cruiseHeadwind: 0 as number,

    phases: [] as FlightPhase[],

    releasedStore: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ] as boolean[],
  }),

  getters: {
    NextPhases(): PhaseType[] {
      if (this.phases.length == 0) {
        return (
          FlightGraph.find((p) => p.start == PhaseType.TAKEOFF)?.next || []
        );
      } else {
        const nextphases =
          FlightGraph.find(
            (p) => p.start == this.phases[this.phases.length - 1].type
          )?.next || [];

        return nextphases;
      }
    },

    Bingo(): number {
      return 0;
    },

    CruisePressureAlt(): number {
      return PressureAltitude(this.FlightLevel * 100, this.Qnh);
    },

    FlightPhases(): IFlightPhase[] {
      return this.phases;

    },

  },

  actions: {
    AddPhase(phaseType: PhaseType) {
      if (phaseType == PhaseType.TAKEOFF) {
        this.phases.push(FlightPhaseFactory.createTakoffPhase());
      } else {
        const newPhase = FlightPhaseFactory.createPhase(
          phaseType,
          this.phases[this.phases.length - 1] as FlightPhase
        );
        if (newPhase) {

          this.phases.push(newPhase);
        }

      }
    },
    RemovePhase() {
      this.phases.pop();
    },


  },
});
