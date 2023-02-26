import { PhaseType } from './../components/models';
import { FlightPhase } from './FlightPhase';
import { TakeOffPhase } from './TakeOffPhase';
import { ClimbPhase } from './ClimbPhase';

export class FlightPhaseFactory {
  static createTakoffPhase() {
    const phase = new TakeOffPhase();
    return phase;
  }
  static createPhase(type: PhaseType, lastPhase: FlightPhase) {
    switch (type) {
      case PhaseType.CLIMB:
        const climbPhase = new ClimbPhase();
        climbPhase.startWeight = lastPhase.getEndingWeight();
        climbPhase.fuelOnBoard = lastPhase.getRemainingFuel();
        climbPhase.drag = lastPhase.getEndingDrag();
        climbPhase.storesConfiguration = lastPhase.storesConfiguration;
        climbPhase.Recalc();
        return climbPhase;

      default:
        const phase = new FlightPhase(PhaseType[type], '', type);
        phase.startWeight = lastPhase.getEndingWeight();
        phase.fuelOnBoard = lastPhase.getRemainingFuel();
        phase.drag = lastPhase.getEndingDrag();
        phase.storesConfiguration = lastPhase.storesConfiguration;
        phase.jettisonStores = lastPhase.jettisonStores;
        return phase;
    }
  }
}
