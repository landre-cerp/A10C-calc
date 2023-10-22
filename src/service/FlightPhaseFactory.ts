import { CombatPhase } from './flight/CombatPhase';
import { PhaseType } from './../components/models';
import { FlightPhase } from './FlightPhase';
import { TakeOffPhase } from './flight/TakeOffPhase';
import { ClimbPhase } from './flight/ClimbPhase';
import { CruisePhase } from './flight/CruisePhase';
import { DescentPhase } from './flight/DescentPhase';
import { LandingPhase } from './flight/LandingPhase';
import { RefuelPhase } from './flight/RefuelPhase';

export class FlightPhaseFactory {
  static createTakoffPhase() {
    const phase = new TakeOffPhase();
    return phase;
  }
  static createPhase(type: PhaseType, previous: FlightPhase) {
    switch (type) {
      case PhaseType.CLIMB:
        const climbPhase = new ClimbPhase(previous);

        climbPhase.Recalc();
        return climbPhase;

      case PhaseType.CRUISE:
        const cruisePhase = new CruisePhase(previous);
        cruisePhase.Recalc();
        return cruisePhase;

      case PhaseType.HI_COMBAT:
        const combatPhase = new CombatPhase(previous);
        combatPhase.Recalc();
        return combatPhase;

      case PhaseType.DESCENT:
        const descentPhase = new DescentPhase(previous);
        descentPhase.Recalc();

        return descentPhase;

      case PhaseType.LANDING:
        const landingPhase = new LandingPhase(previous);
        landingPhase.Recalc();
        return landingPhase;

      case PhaseType.REFUEL:
        const refuelPhase = new RefuelPhase(previous);
        return refuelPhase;
        break;
    }
  }
}
