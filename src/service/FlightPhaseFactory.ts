import { CombatPhase } from './CombatPhase';
import { PhaseType } from './../components/models';
import { FlightPhase } from './FlightPhase';
import { TakeOffPhase } from './TakeOffPhase';
import { ClimbPhase } from './ClimbPhase';
import { CruisePhase } from './CruisePhase';

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
      case PhaseType.LANDING:
      case PhaseType.RTB:
      case PhaseType.REFUEL:
        break;
    }
  }
}
