import { PhaseType } from 'src/components/models';
import { 
  FlightPhaseCalculator, 
  FlightPhaseConfig, 
  FlightPhaseData, 
  BaseFlightPhaseData 
} from '../flight-context';
import { ClimbDistanceNeeded } from '../../modules/a10c/climb/ClimbDistance';
import { ClimbFuelUsed } from '../../modules/a10c/climb/ClimbFuel';
import { ClimbTimeNeeded } from '../../modules/a10c/climb/ClimbTime';

/**
 * Climb Phase Calculator
 * Handles calculations specific to climb phase
 */
export class ClimbPhaseCalculator implements FlightPhaseCalculator {
  calculate(config: FlightPhaseConfig): FlightPhaseData {
    const { context, previousPhase } = config;
    
    if (!previousPhase) {
      throw new Error('Climb phase requires a previous phase');
    }

    // Default climb target altitude (can be made configurable)
    const targetAltitude = 16000; // feet
    const startAltitude = previousPhase.altitude;
    const altitudeGain = targetAltitude - startAltitude;
    
    // Calculate climb performance using existing modules
    const distance = this.calculateClimbDistance(altitudeGain, context.aircraft.drag);
    const duration = this.calculateClimbTime(altitudeGain, context.aircraft.drag);
    const fuelUsed = this.calculateClimbFuel(altitudeGain, context.aircraft.drag, context.environment.temperature);
    
    return new BaseFlightPhaseData({
      type: PhaseType.CLIMB,
      label: 'Climb',
      comment: `Climb to ${targetAltitude} ft`,
      startWeight: previousPhase.startWeight - previousPhase.fuelUsed,
      fuelUsed,
      fuelFlow: duration > 0 ? fuelUsed / duration : 0,
      refuelled: 0,
      distance,
      duration,
      drag: context.aircraft.drag,
      machSpeed: 0.4, // Typical climb mach speed
      trueAirSpeed: 300, // Typical climb TAS
      altitude: targetAltitude,
      qnh: context.environment.qnh,
      windDirection: context.environment.windDirection,
      windSpeed: context.environment.windSpeed,
      course: 0, // Will be set based on flight plan
      storesConfiguration: context.aircraft.configuration,
    });
  }

  private calculateClimbDistance(altitudeGain: number, drag: number): number {
    try {
      return ClimbDistanceNeeded(altitudeGain, drag) || 0;
    } catch {
      // Fallback calculation if module fails
      return altitudeGain * 0.003; // Rough approximation: 3 nm per 1000 ft
    }
  }

  private calculateClimbTime(altitudeGain: number, drag: number): number {
    try {
      return ClimbTimeNeeded(altitudeGain, drag) || 0;
    } catch {
      // Fallback calculation if module fails
      return altitudeGain / 1500; // Rough approximation: 1500 fpm climb rate
    }
  }

  private calculateClimbFuel(altitudeGain: number, drag: number, temperature: number): number {
    try {
      return ClimbFuelUsed(altitudeGain, drag, temperature) || 0;
    } catch {
      // Fallback calculation if module fails
      const duration = this.calculateClimbTime(altitudeGain, drag);
      return duration * 3000; // Rough approximation: 3000 lbs/hr fuel flow
    }
  }
}