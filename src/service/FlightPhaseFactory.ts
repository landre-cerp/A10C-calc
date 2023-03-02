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
        climbPhase.drag = previous.getEndingDrag();
        climbPhase.storesConfiguration = previous.storesConfiguration;

        climbPhase.Recalc();
        return climbPhase;

      case PhaseType.CRUISE:
        const cruisePhase = new CruisePhase(previous);

        cruisePhase.drag = previous.getEndingDrag();
        cruisePhase.storesConfiguration = previous.storesConfiguration;

        cruisePhase.Recalc();
        return cruisePhase;

      case PhaseType.COMBAT:
        const combatPhase = new CombatPhase(previous);
        return combatPhase;

      case PhaseType.DESCENT:
        const descentPhase = new DescentPhase(previous);
        return descentPhase;

      case PhaseType.LANDING:
        const landingPhase = new LandingPhase(previous);
        return landingPhase;

      case PhaseType.REFUEL:
        const refuelPhase = new RefuelPhase(previous);
        return refuelPhase;
        break;
    }
  }
}
