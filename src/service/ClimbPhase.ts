import { PhaseType } from 'src/components/models';
import { useAirportStore } from 'src/stores/Airport';
import { useFlightStore } from 'src/stores/flight';
import { ClimbDistanceNeeded } from './calculators/ClimbDistance';
import { ClimbFuelUsed } from './calculators/ClimbFuel';
import { ClimbTimeNeeded } from './calculators/ClimbTime';
import { FlightPhase } from './FlightPhase';

const airport = useAirportStore();

export class ClimbPhase extends FlightPhase {
  constructor() {
    const flight = useFlightStore();
    super('Climb', 'Climb to cruise altitude', PhaseType.CLIMB);

    console.log(airport.AirportPressureAltitude, airport.DeltaTemp);

    this.altitude = flight.CruisePressureAlt;

    this.fuelUsed = this.FuelUsed();
    this.duration = this.Duration();
    this.distance = this.Distance();
    this.fuelFlow = (this.FuelUsed() / this.Duration()) * 60;
  }

  private FuelUsed(): number {
    return ClimbFuelUsed(
      airport.AirportPressureAltitude,
      this.altitude,
      this.startWeight,
      airport.DeltaTemp,
      this.drag
    );
  }

  private Duration(): number {
    return ClimbTimeNeeded(
      airport.AirportPressureAltitude,
      this.altitude,
      this.startWeight,
      airport.DeltaTemp,
      this.drag
    );
  }

  private Distance(): number {
    return ClimbDistanceNeeded(
      airport.AirportPressureAltitude,
      this.altitude,
      this.startWeight,
      airport.DeltaTemp,
      this.drag
    );
  }

  Recalc() {
    this.fuelUsed = this.FuelUsed();
    this.duration = this.Duration();
    this.distance = this.Distance();
  }
}
