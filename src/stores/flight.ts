import { useAirportStore } from './Airport';
import { useA10CStore } from './a10c';

import { IFlightPhase, PhaseType, QNH } from './../components/models';
import { defineStore } from 'pinia';
import { getStdTemp, PressureAltitude } from 'src/service/conversionTool';

import { CruiseNMperLbsUsed } from 'src/service/calculators/CruiseFuel';
import {
  CruiseMachSpeed,
  TrueAirspeed,
} from 'src/service/calculators/CruiseMachSpeed';
import { FlightPhase } from 'src/service/FlightPhase';
import { FlightPhaseFactory } from 'src/service/FlightPhaseFactory';

const FlightGraph = [
  { start: PhaseType.TAKEOFF, next: [PhaseType.CLIMB] },
  { start: PhaseType.CLIMB, next: [PhaseType.CRUISE] },
  {
    start: PhaseType.CRUISE,
    next: [
      PhaseType.CLIMB,
      PhaseType.CRUISE,
      PhaseType.COMBAT,
      PhaseType.REFUEL,
      PhaseType.DESCENT,
    ],
  },
  { start: PhaseType.COMBAT, next: [PhaseType.CRUISE, PhaseType.CLIMB] },
  { start: PhaseType.DESCENT, next: [PhaseType.LANDING] },
  { start: PhaseType.REFUEL, next: [PhaseType.CRUISE] },
];

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
      // As you should have 2000 fuel reserve on TOD at then end of RTB
      // return (
      //   Math.ceil(1 + (this.fuelReserve + this.phases[4].FuelUsed) / 100) * 100
      // );
      return 0;
    },
    CruisePressureAlt(): number {
      return PressureAltitude(this.FlightLevel * 100, this.Qnh);
    },
    FlightPhases(): IFlightPhase[] {
      return this.phases;
    },

    combatFuelFlow(): number {
      return 0;
      // return this.phases[3].FuelFlow;
    },
    combatDuration(): number {
      //return this.phases[3].Duration;
      return 0;
    },
  },

  actions: {
    AddPhase(phaseType: PhaseType) {
      if (phaseType == PhaseType.TAKEOFF) {
        this.phases.push(FlightPhaseFactory.createTakoffPhase());
      } else {
        this.phases.push(
          FlightPhaseFactory.createPhase(
            phaseType,
            this.phases[this.phases.length - 1]
          )
        );
      }
    },
    RemovePhase() {
      this.phases.pop();
    },

    // RecalCalcCurrentPhaseStartingWeightAndFOB(
    //   CurrentPhase: IFlightPhase,
    //   PreviousPhase: IFlightPhase
    // ) {
    //   CurrentPhase.setFuelOnBoard(PreviousPhase.fuelOnBoard - PreviousPhase.fuelUsed;
    //   CurrentPhase.startWeight =
    //     PreviousPhase.startWeight - PreviousPhase.fuelUsed;
    // },

    // Recalc() {
    //   // Calculate Fuel Weight etc..

    //   const newPhases: FlightPhase[] = [];
    //   newPhases.push({ ...this.phases[0] });

    //   newPhases[0].Recalc();

    //   for (let index = 1; index < this.phases.length; index++) {
    //     this.phases[index].startWeight =
    //       this.phases[index - 1].startWeight - this.phases[index - 1].fuelUsed;
    //     this.phases[index].Recalc();

    //     this.phases[index].fuelOnBoard =
    //       this.phases[index - 1].fuelOnBoard - this.phases[index - 1].fuelUsed;

    //     newPhases.push({ ...this.phases[index] });
    //   }

    //   this.phases = [...newPhases];
    // },

    RecalcRTB(distance: number, RTBPhase: IFlightPhase) {
      // RTB is different because we need to calculate the fuel needed to reach the RTB point
      // it depends on the armament used during the combat

      const aircraft = useA10CStore();
      const airport = useAirportStore();

      const AverageWeight =
        (RTBPhase.startWeight, aircraft.ZeroFuelWeight + this.fuelReserve) / 2;

      RTBPhase.Distance = distance;
      RTBPhase.machSpeed = CruiseMachSpeed(
        this.CruisePressureAlt,
        AverageWeight,
        RTBPhase.Drag
      );

      const Ktas = TrueAirspeed(
        RTBPhase.machSpeed,

        getStdTemp(this.CruisePressureAlt) + airport.DeltaTemp
      );
      RTBPhase.trueAirSpeed = Ktas;

      const groundSpeed = Ktas - RTBPhase.headwind;

      const FuelFlow =
        Ktas /
        CruiseNMperLbsUsed(
          this.CruisePressureAlt,
          AverageWeight,
          RTBPhase.Drag
        );

      RTBPhase.Duration = Math.ceil(distance / (groundSpeed / 60));
      RTBPhase.FuelUsed = 10 * Math.ceil((FuelFlow * RTBPhase.Duration) / 600);
      RTBPhase.FuelFlow = FuelFlow;
    },

    ChangeCruiseHeadwind() {
      const cruisePhase = this.phases.find((p) => p.type == PhaseType.CRUISE);
      if (cruisePhase) {
        cruisePhase.headwind = this.cruiseHeadwind;
      }
      const RTB = this.phases.find((p) => p.type == PhaseType.RTB);
      if (RTB) {
        RTB.headwind = -this.cruiseHeadwind;
      }
      this.Recalc();
    },
  },
});
