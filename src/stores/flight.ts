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
            (p) => p.start == this.phases[this.phases.length - 1].type,
          )?.next || [];

        return nextphases;
      }
    },

    Bingo(): number {
      let bingo = 0;

      if (this.phases.length != 0) {
        // find existence of a landing phase
        const landingPhase = this.phases.find(
          (p) => p.type == PhaseType.LANDING,
        );

        if (landingPhase) {
          const descentPhase = landingPhase.previousPhase;
          const rtb = descentPhase?.previousPhase;
          if (rtb && descentPhase) {
            bingo =
              this.fuelReserve +
              rtb.fuelUsed +
              descentPhase.fuelUsed +
              landingPhase.fuelUsed;
          } else {
            bingo = 0;
          }
        }
      }

      return bingo;
    },

    CruisePressureAlt(): number {
      return PressureAltitude(this.FlightLevel * 100, this.Qnh);
    },

    FlightPhases(): IFlightPhase[] {
      return this.phases;
    },

    TotalDistance(): number {
      let totalDistance = 0;
      this.phases.forEach((phase) => {
        totalDistance += phase.distance;
      });
      return totalDistance;
    },

    TotalFuelUsed(): number {
      let totalFuelUsed = 0;
      this.phases.forEach((phase) => {
        totalFuelUsed += phase.fuelUsed;
      });
      return totalFuelUsed;
    },
    TotalDuration(): number {
      let totalDuration = 0;
      this.phases.forEach((phase) => {
        totalDuration += phase.duration;
      });
      return totalDuration;
    },

    CruiseAltitude(): number {
      const cruisePhases = this.phases.filter(
        (p) => p.type == PhaseType.CRUISE,
      );
      let cruiseAltitude = 0;
      cruisePhases.forEach((phase) => {
        if (phase.altitude > cruiseAltitude) {
          cruiseAltitude = phase.altitude;
        }
      });

      return cruiseAltitude;
    },
  },

  actions: {
    AddPhase(phaseType: PhaseType) {
      if (phaseType == PhaseType.TAKEOFF) {
        this.phases.push(FlightPhaseFactory.createTakoffPhase());
      } else {
        const newPhase = FlightPhaseFactory.createPhase(
          phaseType,
          this.phases[this.phases.length - 1] as FlightPhase,
        );
        if (newPhase) {
          this.phases.push(newPhase);
        }
      }
    },
    RemovePhase() {
      const removed = this.phases.pop() as FlightPhase;
      removed.previousPhase?.setNextPhase(null);
    },
  },
});
