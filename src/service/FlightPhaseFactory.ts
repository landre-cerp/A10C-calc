import { CombatPhase } from './flight/CombatPhase';
import { PhaseType } from './../components/models';
import { FlightPhase } from './FlightPhase';
import { TakeOffPhase } from './flight/TakeOffPhase';
import { ClimbPhase } from './flight/ClimbPhase';
import { CruisePhase } from './flight/CruisePhase';
import { DescentPhase } from './flight/DescentPhase';
import { LandingPhase } from './flight/LandingPhase';
import { RefuelPhase } from './flight/RefuelPhase';
import { useA10CStore } from '../stores/a10c';
import { useTakeOffStore } from '../stores/Airport';
import { IAirportContext, ITakeOffContext } from './flight/FlightContext';

export class FlightPhaseFactory {
  static createTakoffPhase() {
    const aircraft = useA10CStore();
    const airport = useTakeOffStore();

    const context: ITakeOffContext = {
      get takeOffWeight() { return aircraft.TakeOffWeight; },
      get fuelWeight() { return aircraft.FuelWeight; },
      get taxiFuel() { return aircraft.taxiFuel; },
      get drag() { return aircraft.Drag; },
      get configuration() { return aircraft.configuration; },
      get airportPressureAltitude() { return airport.AirportPressureAltitude; },
      get runwayQFU() { return airport.runwayQFU; },
      get windDirection() { return airport.WindDirection; },
      get windSpeed() { return airport.WindSpeed; },
    };

    return new TakeOffPhase(context);
  }

  static createPhase(
    type: PhaseType,
    previous: FlightPhase,
  ): FlightPhase | undefined {
    const airport = useTakeOffStore();

    const airportContext: IAirportContext = {
      get deltaTemp() { return airport.DeltaTemp; },
    };

    switch (type) {
      case PhaseType.CLIMB: {
        const climbPhase = new ClimbPhase(previous, airportContext);
        climbPhase.Recalc();
        return climbPhase;
      }

      case PhaseType.CRUISE: {
        const cruisePhase = new CruisePhase(previous, airportContext);
        cruisePhase.Recalc();
        return cruisePhase;
      }

      case PhaseType.HI_COMBAT: {
        const combatPhase = new CombatPhase(previous);
        combatPhase.Recalc();
        return combatPhase;
      }

      case PhaseType.DESCENT: {
        const descentPhase = new DescentPhase(previous);
        descentPhase.Recalc();
        return descentPhase;
      }

      case PhaseType.LANDING: {
        const landingPhase = new LandingPhase(previous);
        landingPhase.Recalc();
        return landingPhase;
      }

      case PhaseType.REFUEL: {
        const refuelPhase = new RefuelPhase(previous);
        return refuelPhase;
      }

      default:
        return undefined;
    }
  }
}
