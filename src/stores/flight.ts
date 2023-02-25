import { FlightPhase, PhaseType, QNH } from './../components/models';
import { defineStore } from 'pinia';
import { PressureAltitude } from 'src/service/conversionTool';

export const useFlightStore = defineStore('flight', {
  state: () => ({
    Qnh: {} as QNH,
    FlightLevel: 160 as number,
    fuelReserve: 1500 as number,
    missionRange: 100 as number,
    cruiseHeadWind: 0 as number,
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
      },
      {
        label: 'On Zone',
        type: PhaseType.ONZONE,
        startWeight: 0,
        FuelOnBoard: 0,
        releasedWeight: 0,
        FuelUsed: 0,
        Distance: 0,
        Duration: 0,
        FuelFlow: 0,
        Drag: 0,
        comment: '',
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
  },

  actions: {
    Recalc() {
      // Calculate Fuel Weight etc..
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
  },
});
