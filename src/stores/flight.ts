import { IFlightPhase, PhaseType, QNH } from './../components/models';
import { defineStore } from 'pinia';
import { FlightPhaseData } from 'src/service/flight-context';
import { ImprovedFlightPhaseFactory } from 'src/service/improved-flight-phase-factory';
import { FlightContextFactory } from 'src/service/flight-context-factory';
import { PressureAltitude } from 'src/service/conversionTool';
import { ValidationService } from 'src/service/validation.service';

// Legacy imports for backward compatibility
import { FlightPhase } from 'src/service/FlightPhase';
import { FlightPhaseFactory } from 'src/service/FlightPhaseFactory';

export const useFlightStore = defineStore('flight', {
  state: () => ({
    Qnh: {} as QNH,
    FlightLevel: 160 as number,
    fuelReserve: 1500 as number,
    missionRange: 0 as number,
    cruiseHeadwind: 0 as number,

    // Legacy support - keeping existing phases
    phases: [] as FlightPhase[],
    
    // New improved phases array
    improvedPhases: [] as FlightPhaseData[],

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
        return [PhaseType.TAKEOFF];
      } else {
        const lastPhase = this.phases[this.phases.length - 1];
        return ImprovedFlightPhaseFactory.getValidNextPhases(lastPhase.type);
      }
    },

    /**
     * Get next available phases using improved architecture
     */
    NextImprovedPhases(): PhaseType[] {
      if (this.improvedPhases.length === 0) {
        return [PhaseType.TAKEOFF];
      } else {
        const lastPhase = this.improvedPhases[this.improvedPhases.length - 1];
        return ImprovedFlightPhaseFactory.getValidNextPhases(lastPhase.type);
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
    // Legacy method - keeping for backward compatibility
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

    // Legacy method - keeping for backward compatibility
    RemovePhase() {
      const removed = this.phases.pop() as FlightPhase;
      removed?.previousPhase?.setNextPhase(null);
    },

    /**
     * Add a new phase using improved architecture
     * @param phaseType - Type of phase to add
     */
    addImprovedPhase(phaseType: PhaseType): void {
      try {
        const context = FlightContextFactory.createTakeoffContext();
        const previousPhase = this.improvedPhases.length > 0 
          ? this.improvedPhases[this.improvedPhases.length - 1] 
          : undefined;

        const newPhase = ImprovedFlightPhaseFactory.createPhase(
          phaseType,
          context,
          previousPhase
        );

        this.improvedPhases.push(newPhase);
      } catch (error) {
        console.error('Failed to add flight phase:', error);
        throw error;
      }
    },

    /**
     * Remove the last phase using improved architecture
     */
    removeImprovedPhase(): void {
      if (this.improvedPhases.length > 0) {
        this.improvedPhases.pop();
      }
    },

    /**
     * Clear all phases
     */
    clearPhases(): void {
      this.phases.length = 0;
      this.improvedPhases.length = 0;
    },

    /**
     * Set flight level with validation
     * @param flightLevel - Flight level in hundreds of feet
     */
    setFlightLevel(flightLevel: number): void {
      const sanitized = ValidationService.sanitizeNumber(flightLevel, this.FlightLevel, 10, 600);
      this.FlightLevel = sanitized;
    },

    /**
     * Set fuel reserve with validation
     * @param reserve - Fuel reserve in pounds
     */
    setFuelReserve(reserve: number): void {
      const sanitized = ValidationService.sanitizeNumber(reserve, this.fuelReserve, 0);
      this.fuelReserve = sanitized;
    },
  },
});
