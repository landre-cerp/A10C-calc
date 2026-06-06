import { StoresConfiguration } from 'src/components/models';

/**
 * Context interface for phases that need airport temperature deviation.
 * Injected by FlightPhaseFactory; avoids direct Pinia store dependency in service classes.
 */
export interface IAirportContext {
  readonly deltaTemp: number;
}

/**
 * Context interface for the take-off phase, providing all aircraft and airport
 * parameters needed by TakeOffPhase.Recalc().
 */
export interface ITakeOffContext {
  readonly takeOffWeight: number;
  readonly fuelWeight: number;
  readonly taxiFuel: number;
  readonly drag: number;
  readonly configuration: StoresConfiguration;
  readonly airportPressureAltitude: number;
  readonly runwayQFU: number;
  readonly windDirection: number;
  readonly windSpeed: number;
}
