import { PhaseType, StoresConfiguration, QNH } from 'src/components/models';

/**
 * Flight Phase Data Interface
 * Represents the data structure for a flight phase without business logic
 */
export interface FlightPhaseData {
  readonly type: PhaseType;
  readonly label: string;
  readonly comment: string;
  
  // Weight and fuel
  readonly startWeight: number;
  readonly fuelUsed: number;
  readonly fuelFlow: number;
  readonly refuelled: number;

  // Performance
  readonly distance: number;
  readonly duration: number;
  readonly drag: number;
  readonly machSpeed: number;
  readonly trueAirSpeed: number;
  readonly altitude: number;

  // Environment
  readonly qnh: QNH;
  readonly windDirection: number;
  readonly windSpeed: number;
  readonly course: number;

  // Configuration
  readonly storesConfiguration: StoresConfiguration;
}

/**
 * Flight Phase Service
 * Provides utility functions for flight phase calculations
 */
export class FlightPhaseService {
  /**
   * Calculate ending weight after fuel consumption
   * @param startWeight - Starting weight in pounds
   * @param fuelUsed - Fuel consumed in pounds
   * @returns Ending weight in pounds
   */
  static calculateEndingWeight(startWeight: number, fuelUsed: number): number {
    return Math.max(0, startWeight - fuelUsed);
  }

  /**
   * Calculate remaining fuel after phase
   * @param fuelOnBoard - Fuel on board at start in pounds
   * @param fuelUsed - Fuel consumed in pounds
   * @param refuelled - Fuel added during phase in pounds
   * @returns Remaining fuel in pounds
   */
  static calculateRemainingFuel(
    fuelOnBoard: number,
    fuelUsed: number,
    refuelled: number = 0
  ): number {
    return Math.max(0, fuelOnBoard - fuelUsed + refuelled);
  }

  /**
   * Calculate fuel consumption from fuel flow and duration
   * @param fuelFlow - Fuel flow in pounds per hour
   * @param duration - Duration in hours
   * @returns Fuel consumed in pounds
   */
  static calculateFuelConsumption(fuelFlow: number, duration: number): number {
    return fuelFlow * duration;
  }

  /**
   * Calculate flight duration from distance and speed
   * @param distance - Distance in nautical miles
   * @param groundSpeed - Ground speed in knots
   * @returns Duration in hours
   */
  static calculateDuration(distance: number, groundSpeed: number): number {
    if (groundSpeed <= 0) return 0;
    return distance / groundSpeed;
  }

  /**
   * Calculate ground speed from true airspeed and headwind
   * @param trueAirspeed - True airspeed in knots
   * @param headwind - Headwind component in knots (positive for headwind, negative for tailwind)
   * @returns Ground speed in knots
   */
  static calculateGroundSpeed(trueAirspeed: number, headwind: number): number {
    return Math.max(0, trueAirspeed - headwind);
  }

  /**
   * Validate phase type transition
   * @param currentPhase - Current phase type
   * @param nextPhase - Proposed next phase type
   * @returns True if transition is valid
   */
  static isValidTransition(currentPhase: PhaseType, nextPhase: PhaseType): boolean {
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

    return validTransitions[currentPhase]?.includes(nextPhase) ?? false;
  }

  /**
   * Calculate relative headwind component
   * @param windDirection - Wind direction in degrees
   * @param windSpeed - Wind speed in knots  
   * @param course - Course/track in degrees
   * @returns Headwind component in knots (positive for headwind)
   */
  static calculateRelativeHeadwind(
    windDirection: number,
    windSpeed: number,
    course: number
  ): number {
    const windAngle = ((windDirection - course + 180) % 360) * (Math.PI / 180);
    return windSpeed * Math.cos(windAngle);
  }
}