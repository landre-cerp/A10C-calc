import { PhaseType } from 'src/components/models';
import { 
  FlightPhaseCalculator, 
  FlightPhaseConfig, 
  FlightPhaseData, 
  BaseFlightPhaseData 
} from '../flight-context';

/**
 * Takeoff Phase Calculator
 * Handles calculations specific to takeoff phase
 */
export class TakeoffPhaseCalculator implements FlightPhaseCalculator {
  calculate(config: FlightPhaseConfig): FlightPhaseData {
    const { context } = config;
    
    // Takeoff specific calculations
    const startWeight = context.aircraft.takeoffWeight;
    const fuelUsed = context.aircraft.taxiFuel + 200; // Taxi fuel + takeoff fuel
    const distance = 2; // Takeoff distance in nautical miles
    const duration = 0.0167; // 1 minute in hours (1/60)
    
    return new BaseFlightPhaseData({
      type: PhaseType.TAKEOFF,
      label: 'Takeoff',
      comment: 'Taxi and takeoff',
      startWeight,
      fuelUsed,
      fuelFlow: fuelUsed / duration, // Calculate fuel flow
      refuelled: 0,
      distance,
      duration,
      drag: context.aircraft.drag,
      machSpeed: 0, // Ground operations
      trueAirSpeed: 0, // Ground operations
      altitude: context.environment.pressureAltitude,
      qnh: context.environment.qnh,
      windDirection: context.environment.windDirection,
      windSpeed: context.environment.windSpeed,
      course: context.environment.runwayQFU,
      storesConfiguration: context.aircraft.configuration,
    });
  }
}