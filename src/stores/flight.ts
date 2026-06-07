import { IFlightPhase, PhaseType, QNH } from './../components/models';
import { defineStore } from 'pinia';

import { FlightPhase } from 'src/service/FlightPhase';
import { FlightPhaseFactory } from 'src/service/FlightPhaseFactory';
import { PressureAltitude } from 'src/service/conversionTool';

import { FlightStateMachine } from 'src/service/FlightStateMachine';
import { MissionProfile } from 'src/service/MissionProfileBuilder';

export const useFlightStore = defineStore('flight', {
  state: () => ({
    Qnh: {} as QNH,
    FlightLevel: 160 as number,
    fuelReserve: 1500 as number,
    missionRange: 0 as number,
    cruiseHeadwind: 0 as number,

    phases: [] as FlightPhase[],
  }),

  getters: {
    NextPhases(): PhaseType[] {
      if (this.phases.length === 0) {
        return [FlightStateMachine.getInitialState()];
      }
      return FlightStateMachine.getNextStates(
        this.phases[this.phases.length - 1].type,
      );
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
      if (this.phases.length === 0) {
        if (phaseType !== FlightStateMachine.getInitialState()) return;
        this.phases.push(FlightPhaseFactory.createTakoffPhase());
      } else {
        const currentType = this.phases[this.phases.length - 1].type;
        if (!FlightStateMachine.canTransitionTo(currentType, phaseType)) return;
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

    LoadProfile(profile: MissionProfile) {
      this.phases = [];
      for (const config of profile.phases) {
        this.AddPhase(config.type);
        const phase = this.phases[this.phases.length - 1];
        if (!phase) continue;
        if (config.altitude !== undefined) phase.ChangeAltitude(config.altitude);
        if (config.distance !== undefined) phase.ChangeDistance(config.distance);
        if (config.duration !== undefined) phase.ChangePhaseDuration(config.duration);
        if (config.fuelFlow !== undefined) phase.ChangeFuelFlow(config.fuelFlow);
        if (config.refuelTotal !== undefined) phase.Refuel(config.refuelTotal);
        phase.Recalc();
      }
    },
  },
});
