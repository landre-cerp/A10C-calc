import { PhaseType, StoresConfiguration, QNH } from 'src/components/models';

/**
 * Flight Context Interface
 * Provides environment and aircraft data to flight phases without tight coupling to stores
 */
export interface FlightContext {
  // Aircraft data
  readonly aircraft: {
    readonly takeoffWeight: number;
    readonly fuelWeight: number;
    readonly taxiFuel: number;
    readonly drag: number;
    readonly configuration: StoresConfiguration;
  };

  // Airport/Environment data
  readonly environment: {
    readonly pressureAltitude: number;
    readonly temperature: number;
    readonly windDirection: number;
    readonly windSpeed: number;
    readonly runwayQFU: number;
    readonly qnh: QNH;
  };
}

/**
 * Flight Phase Configuration
 * Immutable configuration for creating flight phases
 */
export interface FlightPhaseConfig {
  readonly type: PhaseType;
  readonly label: string;
  readonly comment: string;
  readonly context: FlightContext;
  readonly previousPhase?: FlightPhaseData;
}

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
 * Flight Phase Calculator Interface
 * Defines the contract for flight phase calculation services
 */
export interface FlightPhaseCalculator {
  /**
   * Calculate flight phase data based on configuration
   * @param config - Flight phase configuration
   * @returns Calculated flight phase data
   */
  calculate(config: FlightPhaseConfig): FlightPhaseData;
}

/**
 * Base implementation of FlightPhaseData
 */
export class BaseFlightPhaseData implements FlightPhaseData {
  readonly type: PhaseType;
  readonly label: string;
  readonly comment: string;
  readonly startWeight: number;
  readonly fuelUsed: number;
  readonly fuelFlow: number;
  readonly refuelled: number;
  readonly distance: number;
  readonly duration: number;
  readonly drag: number;
  readonly machSpeed: number;
  readonly trueAirSpeed: number;
  readonly altitude: number;
  readonly qnh: QNH;
  readonly windDirection: number;
  readonly windSpeed: number;
  readonly course: number;
  readonly storesConfiguration: StoresConfiguration;

  constructor(data: Partial<FlightPhaseData> & Pick<FlightPhaseData, 'type' | 'label' | 'comment'>) {
    this.type = data.type;
    this.label = data.label;
    this.comment = data.comment;
    this.startWeight = data.startWeight ?? 0;
    this.fuelUsed = data.fuelUsed ?? 0;
    this.fuelFlow = data.fuelFlow ?? 0;
    this.refuelled = data.refuelled ?? 0;
    this.distance = data.distance ?? 0;
    this.duration = data.duration ?? 0;
    this.drag = data.drag ?? 0;
    this.machSpeed = data.machSpeed ?? 0;
    this.trueAirSpeed = data.trueAirSpeed ?? 0;
    this.altitude = data.altitude ?? 0;
    this.qnh = data.qnh ?? { value: 1013, unit: 0 };
    this.windDirection = data.windDirection ?? 0;
    this.windSpeed = data.windSpeed ?? 0;
    this.course = data.course ?? 0;
    this.storesConfiguration = data.storesConfiguration ?? {
      name: '',
      pylonsLoad: []
    };
  }
}