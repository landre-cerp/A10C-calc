import { PhaseType } from '../components/models';

export interface PhaseConfig {
  type: PhaseType;
  altitude?: number;
  distance?: number;
  duration?: number;
  fuelFlow?: number;
  refuelTotal?: number;
}

export interface MissionProfile {
  name: string;
  phases: PhaseConfig[];
}

export class MissionProfileBuilder {
  private phases: PhaseConfig[] = [];

  constructor(private readonly name: string) {}

  withTakeoff(): this {
    this.phases.push({ type: PhaseType.TAKEOFF });
    return this;
  }

  withClimb(altitude: number): this {
    this.phases.push({ type: PhaseType.CLIMB, altitude });
    return this;
  }

  withCruise(distance: number): this {
    this.phases.push({ type: PhaseType.CRUISE, distance });
    return this;
  }

  withHiCombat(duration: number, fuelFlow?: number): this {
    this.phases.push({ type: PhaseType.HI_COMBAT, duration, fuelFlow });
    return this;
  }

  withDescent(targetAltitude: number): this {
    this.phases.push({ type: PhaseType.DESCENT, altitude: targetAltitude });
    return this;
  }

  withRefuel(refuelTotal: number): this {
    this.phases.push({ type: PhaseType.REFUEL, refuelTotal });
    return this;
  }

  withLanding(): this {
    this.phases.push({ type: PhaseType.LANDING });
    return this;
  }

  build(): MissionProfile {
    return { name: this.name, phases: [...this.phases] };
  }
}
