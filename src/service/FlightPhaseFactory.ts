import { CombatPhase } from './CombatPhase';
import { PhaseType } from './../components/models';
import { FlightPhase } from './FlightPhase';
import { TakeOffPhase } from './TakeOffPhase';
import { ClimbPhase } from './ClimbPhase';
import { CruisePhase } from './CruisePhase';
import { DescentPhase } from './DescentPhase';
import { LandingPhase } from './LandingPhase';
import { RefuelPhase } from './RefuelPhase';

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

      case PhaseType.COMBAT:
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
