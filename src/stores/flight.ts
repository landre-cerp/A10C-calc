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
        console.log(this.phases[this.phases.length - 1]);
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
    InitFlight() {
      const airport = useAirportStore();
      const aircraft = useA10CStore();

      // Init Taxi & Takeoff
      this.Qnh = airport.Qnh;

      const TaxiAndTakeOffPhase = this.phases.find(
        (p) => p.type == PhaseType.TAKEOFF
      );
      if (TaxiAndTakeOffPhase) {
        TaxiAndTakeOffPhase.headwind = airport.Wind.speed;
        TaxiAndTakeOffPhase.fuelOnBoard = Math.ceil(aircraft.FuelWeight);
        TaxiAndTakeOffPhase.startWeight = Math.ceil(aircraft.TotalWeight);
        TaxiAndTakeOffPhase.drag = aircraft.Drag;
      }

      // // Init Climb

      // // At component init, set params and recalc
      // const ClimbPhase = this.phases.find((p) => p.type == PhaseType.CLIMB);

      // if (ClimbPhase && TaxiAndTakeOffPhase) {
      //   ClimbPhase.headwind = airport.HeadWind;
      //   this.RecalCalcCurrentPhaseStartingWeightAndFOB(
      //     ClimbPhase,
      //     TaxiAndTakeOffPhase
      //   );

      //   ClimbPhase.Drag = aircraft.Drag;
      // }

      // // Init Cruise

      // const CruisePhase = this.phases.find((p) => p.type == PhaseType.CRUISE);
      // if (CruisePhase && ClimbPhase) {
      //   this.RecalCalcCurrentPhaseStartingWeightAndFOB(CruisePhase, ClimbPhase);
      //   CruisePhase.Drag = aircraft.Drag;
      // }

      // // Init On Zone
      // const onZonePhase = this.phases.find((p) => p.type == PhaseType.COMBAT);
      // if (onZonePhase && CruisePhase) {
      //   onZonePhase.FuelFlow = 5000;
      //   onZonePhase.FuelUsed = 0;
      //   onZonePhase.headwind = 0;
      //   this.RecalCalcCurrentPhaseStartingWeightAndFOB(
      //     onZonePhase,
      //     CruisePhase
      //   );
      // }

      // // Init RTB

      // const RTBPhase = this.phases.find((p) => p.type == PhaseType.RTB);
      // if (CruisePhase && RTBPhase) {
      //   RTBPhase.Distance = CruisePhase.Distance;

      //   this.RecalCalcCurrentPhaseStartingWeightAndFOB(RTBPhase, CruisePhase);
      //   RTBPhase.Drag = aircraft.Drag;
      // }

      // // Init Descent

      // const DescentPhase = this.phases.find((p) => p.type == PhaseType.DESCENT);
      // if (DescentPhase && CruisePhase) {
      //   DescentPhase.Drag = aircraft.Drag;

      //   DescentPhase.FuelOnBoard = this.fuelReserve;
      //   DescentPhase.startWeight = aircraft.ZeroFuelWeight + this.fuelReserve;
      // }
    },

    RecalCalcCurrentPhaseStartingWeightAndFOB(
      CurrentPhase: IFlightPhase,
      PreviousPhase: IFlightPhase
    ) {
      CurrentPhase.FuelOnBoard =
        PreviousPhase.FuelOnBoard - PreviousPhase.FuelUsed;
      CurrentPhase.startWeight =
        PreviousPhase.startWeight - PreviousPhase.FuelUsed;
    },

    Recalc() {
      // Calculate Fuel Weight etc..

      const aircraft = useA10CStore();

      const TakeOffPhase = this.phases[0];
      // const ClimbPhase = this.phases[1];
      // const CruisePhase = this.phases[2];
      // const onZonePhase = this.phases[3];
      // const RTBPhase = this.phases[4];

      TakeOffPhase.FuelUsed = aircraft.taxiFuel + 200;

      // this.RecalcClimb(ClimbPhase);
      // this.RecalcCruise(ClimbPhase, CruisePhase);

      // onZonePhase.FuelUsed = Math.ceil(
      //   (onZonePhase.FuelFlow / 60) * onZonePhase.Duration
      // );

      // this.RecalcRTB(CruisePhase.Distance, RTBPhase);

      const newPhases = [{ ...this.phases[0] }];

      for (let index = 1; index < this.phases.length; index++) {
        this.phases[index].startWeight =
          this.phases[index - 1].startWeight - this.phases[index - 1].FuelUsed;

        this.phases[index].FuelOnBoard =
          this.phases[index - 1].FuelOnBoard - this.phases[index - 1].FuelUsed;

        newPhases.push({ ...this.phases[index] });
      }

      this.phases = [...newPhases];
    },

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

    RecalcCruise(ClimbPhase: IFlightPhase, CruisePhase: IFlightPhase) {
      // Step 1 - Optimum Cruise Altitude with startWeight

      const airport = useAirportStore();

      CruisePhase.Drag = ClimbPhase.Drag;

      CruisePhase.Distance = this.missionRange - ClimbPhase.Distance;
      const AverageWeight = this.getCruiseAverageWeight(CruisePhase);

      CruisePhase.machSpeed = CruiseMachSpeed(
        this.CruisePressureAlt,
        AverageWeight,
        CruisePhase.Drag
      );

      const Ktas = TrueAirspeed(
        CruisePhase.machSpeed,
        getStdTemp(this.CruisePressureAlt) + airport.DeltaTemp
      );
      CruisePhase.trueAirSpeed = Ktas;
      const groundSpeed = Ktas - CruisePhase.headwind;

      const FuelFlow =
        Ktas /
        CruiseNMperLbsUsed(
          this.CruisePressureAlt,
          AverageWeight,
          CruisePhase.Drag
        );

      CruisePhase.Duration = Math.ceil(
        CruisePhase.Distance / (groundSpeed / 60)
      );
      CruisePhase.FuelUsed =
        10 * Math.ceil((FuelFlow * CruisePhase.Duration) / 600);
      CruisePhase.FuelFlow = FuelFlow;
      CruisePhase.machSpeed = CruiseMachSpeed(
        this.CruisePressureAlt,
        AverageWeight,
        CruisePhase.Drag
      );
    },

    getCruiseAverageWeight(CruisePhase: IFlightPhase): number {
      const aircraft = useA10CStore();
      const airport = useAirportStore();

      const cruiseMach = CruiseMachSpeed(
        this.CruisePressureAlt,
        CruisePhase.startWeight, // Start Weight  , then half the fuel Used.
        aircraft.Drag
      );

      const Ktas = TrueAirspeed(
        cruiseMach,
        getStdTemp(this.CruisePressureAlt) + airport.DeltaTemp
      );

      const groundSpeed = Ktas - CruisePhase.headwind;

      const FuelFlow =
        Ktas /
        CruiseNMperLbsUsed(
          this.CruisePressureAlt,
          CruisePhase.startWeight,
          aircraft.Drag
        );

      // then duration  = distance with ground Speed.
      const duration = CruisePhase.Distance / (groundSpeed / 60);
      const fuelUsedForMaxWeight = (FuelFlow / 60) * duration;

      // then Same calcul with Avegage Weight
      return CruisePhase.startWeight - fuelUsedForMaxWeight / 2;
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
