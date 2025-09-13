import { PhaseType } from 'src/components/models';
import { 
  FlightPhaseCalculator, 
  FlightPhaseConfig, 
  FlightPhaseData, 
  FlightContext 
} from './flight-context';
import { TakeoffPhaseCalculator } from './calculators/takeoff-calculator';
import { ClimbPhaseCalculator } from './calculators/climb-calculator';

/**
 * Registry of flight phase calculators
 */
const calculators: Record<PhaseType, FlightPhaseCalculator> = {
  [PhaseType.TAKEOFF]: new TakeoffPhaseCalculator(),
  [PhaseType.CLIMB]: new ClimbPhaseCalculator(),
  [PhaseType.CRUISE]: new TakeoffPhaseCalculator(), // Placeholder - will be implemented
  [PhaseType.HI_COMBAT]: new TakeoffPhaseCalculator(), // Placeholder - will be implemented
  [PhaseType.DESCENT]: new TakeoffPhaseCalculator(), // Placeholder - will be implemented
  [PhaseType.LANDING]: new TakeoffPhaseCalculator(), // Placeholder - will be implemented
  [PhaseType.REFUEL]: new TakeoffPhaseCalculator(), // Placeholder - will be implemented
};

/**
 * Improved Flight Phase Factory
 * Uses dependency injection and calculator pattern for better separation of concerns
 */
export class ImprovedFlightPhaseFactory {
  /**
   * Create a flight phase using the appropriate calculator
   * @param type - Type of flight phase to create
   * @param context - Flight context with aircraft and environment data
   * @param previousPhase - Previous phase data (if any)
   * @returns Calculated flight phase data
   */
  static createPhase(
    type: PhaseType,
    context: FlightContext,
    previousPhase?: FlightPhaseData
  ): FlightPhaseData {
    const calculator = calculators[type];
    
    if (!calculator) {
      throw new Error(`No calculator found for phase type: ${type}`);
    }

    const config: FlightPhaseConfig = {
      type,
      label: this.getPhaseLabel(type),
      comment: this.getPhaseComment(type),
      context,
      previousPhase,
    };

    return calculator.calculate(config);
  }

  /**
   * Register a custom calculator for a phase type
   * @param type - Phase type
   * @param calculator - Calculator implementation
   */
  static registerCalculator(type: PhaseType, calculator: FlightPhaseCalculator): void {
    calculators[type] = calculator;
  }

  /**
   * Get available phase types that can follow the given phase
   * @param currentPhase - Current phase type
   * @returns Array of valid next phase types
   */
  static getValidNextPhases(currentPhase: PhaseType): PhaseType[] {
    const validTransitions: Record<PhaseType, PhaseType[]> = {
      [PhaseType.TAKEOFF]: [PhaseType.CLIMB],
      [PhaseType.CLIMB]: [PhaseType.CRUISE],
      [PhaseType.CRUISE]: [
        PhaseType.CLIMB,
        PhaseType.CRUISE,
        PhaseType.HI_COMBAT,
        PhaseType.REFUEL,
        PhaseType.DESCENT,
      ],
      [PhaseType.HI_COMBAT]: [PhaseType.CRUISE, PhaseType.CLIMB],
      [PhaseType.DESCENT]: [PhaseType.LANDING, PhaseType.CRUISE],
      [PhaseType.REFUEL]: [PhaseType.CRUISE],
      [PhaseType.LANDING]: [], // No phases after landing
    };

    return validTransitions[currentPhase] || [];
  }

  private static getPhaseLabel(type: PhaseType): string {
    const labels: Record<PhaseType, string> = {
      [PhaseType.TAKEOFF]: 'Takeoff',
      [PhaseType.CLIMB]: 'Climb',
      [PhaseType.CRUISE]: 'Cruise',
      [PhaseType.HI_COMBAT]: 'Combat',
      [PhaseType.DESCENT]: 'Descent',
      [PhaseType.LANDING]: 'Landing',
      [PhaseType.REFUEL]: 'Refuel',
    };

    return labels[type] || 'Unknown';
  }

  private static getPhaseComment(type: PhaseType): string {
    const comments: Record<PhaseType, string> = {
      [PhaseType.TAKEOFF]: 'Taxi and takeoff',
      [PhaseType.CLIMB]: 'Climb to cruise altitude',
      [PhaseType.CRUISE]: 'Cruise flight',
      [PhaseType.HI_COMBAT]: 'High altitude combat',
      [PhaseType.DESCENT]: 'Descent to landing',
      [PhaseType.LANDING]: 'Approach and landing',
      [PhaseType.REFUEL]: 'Air-to-air refueling',
    };

    return comments[type] || 'Flight phase';
  }
}