import { FlightContext } from './flight-context';
import { useA10CStore } from 'src/stores/a10c';
import { useTakeoffStore } from 'src/stores/takeoff';
import { useLandingStore } from 'src/stores/landing';

/**
 * Flight Context Factory
 * Creates FlightContext instances from store state
 */
export class FlightContextFactory {
  /**
   * Create FlightContext from takeoff store state
   * @returns FlightContext with takeoff environment data
   */
  static createTakeoffContext(): FlightContext {
    const aircraft = useA10CStore();
    const airport = useTakeoffStore();

    return {
      aircraft: {
        takeoffWeight: aircraft.TakeOffWeight,
        fuelWeight: aircraft.FuelWeight,
        taxiFuel: aircraft.taxiFuel,
        drag: aircraft.Drag,
        configuration: aircraft.configuration,
      },
      environment: {
        pressureAltitude: airport.AirportPressureAltitude,
        temperature: airport.Temp,
        windDirection: airport.WindDirection,
        windSpeed: airport.WindSpeed,
        runwayQFU: airport.runwayQFU,
        qnh: airport.Qnh,
      },
    };
  }

  /**
   * Create FlightContext from landing store state
   * @returns FlightContext with landing environment data
   */
  static createLandingContext(): FlightContext {
    const aircraft = useA10CStore();
    const airport = useLandingStore();

    return {
      aircraft: {
        takeoffWeight: aircraft.TakeOffWeight,
        fuelWeight: aircraft.FuelWeight,
        taxiFuel: aircraft.taxiFuel,
        drag: aircraft.Drag,
        configuration: aircraft.configuration,
      },
      environment: {
        pressureAltitude: airport.AirportPressureAltitude,
        temperature: airport.Temp,
        windDirection: airport.WindDirection,
        windSpeed: airport.WindSpeed,
        runwayQFU: airport.runwayQFU,
        qnh: airport.Qnh,
      },
    };
  }

  /**
   * Create FlightContext with custom environment data
   * @param overrides - Partial environment overrides
   * @returns FlightContext with custom environment data
   */
  static createCustomContext(
    overrides: Partial<FlightContext['environment']> = {}
  ): FlightContext {
    const baseContext = this.createTakeoffContext();
    
    return {
      ...baseContext,
      environment: {
        ...baseContext.environment,
        ...overrides,
      },
    };
  }
}