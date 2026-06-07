import { PhaseType } from '../components/models';

const transitions: Map<PhaseType, PhaseType[]> = new Map([
  [PhaseType.TAKEOFF, [PhaseType.CLIMB]],
  [PhaseType.CLIMB, [PhaseType.CRUISE]],
  [
    PhaseType.CRUISE,
    [
      PhaseType.CLIMB,
      PhaseType.CRUISE,
      PhaseType.HI_COMBAT,
      PhaseType.REFUEL,
      PhaseType.DESCENT,
    ],
  ],
  [PhaseType.HI_COMBAT, [PhaseType.CRUISE, PhaseType.CLIMB]],
  [PhaseType.DESCENT, [PhaseType.LANDING, PhaseType.CRUISE]],
  [PhaseType.REFUEL, [PhaseType.CRUISE]],
]);

export class FlightStateMachine {
  static getInitialState(): PhaseType {
    return PhaseType.TAKEOFF;
  }

  static getNextStates(current: PhaseType): PhaseType[] {
    return transitions.get(current) ?? [];
  }

  static canTransitionTo(current: PhaseType, next: PhaseType): boolean {
    return FlightStateMachine.getNextStates(current).includes(next);
  }
}
