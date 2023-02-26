import { useAirportStore } from './Airport';
import { useA10CStore } from './a10c';

import { FlightPhase, PhaseType, QNH } from './../components/models';
import { defineStore } from 'pinia';
import { getStdTemp, PressureAltitude } from 'src/service/conversionTool';

import { ClimbFuelUsed } from 'src/service/calculators/ClimbFuel';
import { ClimbTimeNeeded } from 'src/service/calculators/ClimbTime';
import { ClimbDistanceNeeded } from 'src/service/calculators/ClimbDistance';
import { CruiseNMperLbsUsed } from 'src/service/calculators/CruiseFuel';
import {
  CruiseMachSpeed,
  TrueAirspeed,
} from 'src/service/calculators/CruiseMachSpeed';

export const useFlightStore = defineStore('flight', {
  state: () => ({
    Qnh: {} as QNH,
    FlightLevel: 160 as number,
    fuelReserve: 1500 as number,
    missionRange: 100 as number,
    cruiseHeadwind: 0 as number,

    phases: [
      {
        label: 'Taxi & Takeoff',
        type: PhaseType.TAXI,
        startWeight: 0,
        FuelOnBoard: 0,
        releasedWeight: 0,
        // constants froms charts
        FuelUsed: 0,
        Distance: 2,
        Duration: 1,
        FuelFlow: 0,
        Drag: 0,
        comment: 'Taxi fuel + 200lbs',
        headwind: 0,
        machSpeed: 0,
        trueAirSpeed: 0,
      },
      {
        label: 'Climb',
        type: PhaseType.CLIMB,
        startWeight: 0,
        FuelOnBoard: 0,
        releasedWeight: 0,
        FuelUsed: 0,
        Distance: 0,
        Duration: 0,
        FuelFlow: 0,
        Drag: 0,
        comment: '',
        headwind: 0,
        machSpeed: 0,
        trueAirSpeed: 0,
      },
      {
        label: 'Cruise',
        type: PhaseType.CRUISE,
        startWeight: 0,
        FuelOnBoard: 0,
        releasedWeight: 0,
        FuelUsed: 0,
        Distance: 0,
        Duration: 0,
        FuelFlow: 0,
        Drag: 0,
        comment: '',
        headwind: 0,
        machSpeed: 0,
        trueAirSpeed: 0,
      },
      {
        label: 'On Zone',
        type: PhaseType.ONZONE,
        startWeight: 0,
        FuelOnBoard: 0,
        releasedWeight: 0,
        FuelUsed: 0,
        Distance: 0,
        Duration: 10,
        FuelFlow: 5000,
        Drag: 0,
        comment: '',
        headwind: 0,
        machSpeed: 0,
        trueAirSpeed: 0,
      },
      {
        label: 'RTB',
        type: PhaseType.RTB,
        startWeight: 0,
        FuelOnBoard: 0,
        releasedWeight: 0,
        FuelUsed: 500,
        Distance: 0,
        Duration: 0,
        FuelFlow: 0,
        Drag: 0,
        comment: '',
        headwind: 0,
        machSpeed: 0,
        trueAirSpeed: 0,
      },
      {
        label: 'TOP of Descent',
        type: PhaseType.DESCENT,
        startWeight: 0,
        FuelOnBoard: 0,
        releasedWeight: 0,
        FuelUsed: 0,
        Distance: 0,
        Duration: 0,
        FuelFlow: 0,
        Drag: 0,
        comment: '',
        headwind: 0,
        machSpeed: 0,
        trueAirSpeed: 0,
      },
    ] as FlightPhase[],
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
    Bingo(): number {
      // As you should have 2000 fuel reserve on TOD at then end of RTB
      return (
        Math.ceil(1 + (this.fuelReserve + this.phases[4].FuelUsed) / 100) * 100
      );
    },
    CruisePressureAlt(): number {
      return PressureAltitude(this.FlightLevel * 100, this.Qnh);
    },
    FlightPhases(): FlightPhase[] {
      return this.phases;
    },

    combatFuelFlow(): number {
      return this.phases[3].FuelFlow;
    },
    combatDuration(): number {
      return this.phases[3].Duration;
    },
  },

  actions: {
    InitFlight() {
      const airport = useAirportStore();
      const aircraft = useA10CStore();

      // Init Taxi & Takeoff
      this.Qnh = airport.Qnh;

      const TaxiAndTakeOffPhase = this.phases.find(
        (p) => p.type == PhaseType.TAXI
      );
      if (TaxiAndTakeOffPhase) {
        TaxiAndTakeOffPhase.headwind = airport.HeadWind;
        TaxiAndTakeOffPhase.FuelOnBoard = Math.ceil(aircraft.FuelWeight);
        TaxiAndTakeOffPhase.startWeight = Math.ceil(aircraft.TotalWeight);
        TaxiAndTakeOffPhase.Drag = aircraft.Drag;
      }

      // Init Climb

      // At component init, set params and recalc
      const ClimbPhase = this.phases.find((p) => p.type == PhaseType.CLIMB);

      if (ClimbPhase && TaxiAndTakeOffPhase) {
        ClimbPhase.headwind = airport.HeadWind;
        this.RecalCalcCurrentPhaseStartingWeightAndFOB(
          ClimbPhase,
          TaxiAndTakeOffPhase
        );

        ClimbPhase.Drag = aircraft.Drag;
      }

      // Init Cruise

      const CruisePhase = this.phases.find((p) => p.type == PhaseType.CRUISE);
      if (CruisePhase && ClimbPhase) {
        CruisePhase.headwind = this.cruiseHeadwind;
        this.RecalCalcCurrentPhaseStartingWeightAndFOB(CruisePhase, ClimbPhase);
        CruisePhase.Drag = aircraft.Drag;
      }

      // Init On Zone
      const onZonePhase = this.phases.find((p) => p.type == PhaseType.ONZONE);
      if (onZonePhase && CruisePhase) {
        onZonePhase.FuelFlow = 5000;
        onZonePhase.FuelUsed = 0;
        onZonePhase.headwind = 0;
        this.RecalCalcCurrentPhaseStartingWeightAndFOB(
          onZonePhase,
          CruisePhase
        );
      }

      // Init RTB

      const RTBPhase = this.phases.find((p) => p.type == PhaseType.RTB);
      if (CruisePhase && RTBPhase) {
        RTBPhase.Distance = CruisePhase.Distance;
        RTBPhase.headwind = -this.cruiseHeadwind;
        this.RecalCalcCurrentPhaseStartingWeightAndFOB(RTBPhase, CruisePhase);
        RTBPhase.Drag = aircraft.Drag;
      }

      // Init Descent

      const DescentPhase = this.phases.find((p) => p.type == PhaseType.DESCENT);
      if (DescentPhase && CruisePhase) {
        DescentPhase.Drag = aircraft.Drag;
        DescentPhase.headwind = -this.cruiseHeadwind;
        DescentPhase.FuelOnBoard = this.fuelReserve;
        DescentPhase.startWeight = aircraft.ZeroFuelWeight + this.fuelReserve;
      }
    },

    RecalCalcCurrentPhaseStartingWeightAndFOB(
      CurrentPhase: FlightPhase,
      PreviousPhase: FlightPhase
    ) {
      CurrentPhase.FuelOnBoard =
        PreviousPhase.FuelOnBoard - PreviousPhase.FuelUsed;
      CurrentPhase.startWeight =
        PreviousPhase.startWeight -
        PreviousPhase.FuelUsed -
        PreviousPhase.releasedWeight;
    },

    Recalc() {
      // Calculate Fuel Weight etc..

      const aircraft = useA10CStore();

      const TakeOffPhase = this.phases[0];
      const ClimbPhase = this.phases[1];
      const CruisePhase = this.phases[2];
      const onZonePhase = this.phases[3];
      const RTBPhase = this.phases[4];

      TakeOffPhase.FuelUsed = aircraft.taxiFuel + 200;

      this.RecalcClimb(ClimbPhase);
      this.RecalcCruise(ClimbPhase, CruisePhase);

      onZonePhase.FuelUsed = Math.ceil(
        (onZonePhase.FuelFlow / 60) * onZonePhase.Duration
      );

      this.RecalcRTB(
        CruisePhase.Distance,
        RTBPhase,
        onZonePhase.releasedWeight
      );

      const newPhases = [{ ...this.phases[0] }];

      for (let index = 1; index < this.phases.length; index++) {
        this.phases[index].startWeight =
          this.phases[index - 1].startWeight -
          this.phases[index - 1].FuelUsed -
          this.phases[index - 1].releasedWeight;
        this.phases[index].FuelOnBoard =
          this.phases[index - 1].FuelOnBoard - this.phases[index - 1].FuelUsed;

        newPhases.push({ ...this.phases[index] });
      }

      this.phases = [...newPhases];
    },

    RecalcClimb(ClimbPhase: FlightPhase) {
      // Recalc Climb Phase
      const airport = useAirportStore();

      ClimbPhase.FuelUsed = ClimbFuelUsed(
        airport.AirportPressureAltitude,
        this.CruisePressureAlt,
        ClimbPhase.startWeight,
        airport.DeltaTemp,
        ClimbPhase.Drag
      );

      ClimbPhase.Duration = ClimbTimeNeeded(
        airport.AirportPressureAltitude,
        this.CruisePressureAlt,
        ClimbPhase.startWeight,
        airport.DeltaTemp,
        ClimbPhase.Drag
      );

      ClimbPhase.Distance = ClimbDistanceNeeded(
        airport.AirportPressureAltitude,
        this.CruisePressureAlt,
        ClimbPhase.startWeight,
        airport.DeltaTemp,
        ClimbPhase.Drag
      );
    },

    RecalcRTB(distance: number, RTBPhase: FlightPhase, releasedWeight: number) {
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

    RecalcCruise(ClimbPhase: FlightPhase, CruisePhase: FlightPhase) {
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

    getCruiseAverageWeight(CruisePhase: FlightPhase): number {
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
