import { CruiseNMperLbsUsed } from 'src/service/calculators/cruise/CruiseFuel';
import { PhaseType } from 'src/components/models';
import { useTakeOffStore } from 'src/stores/Airport';

import { CruiseMachSpeed, TrueAirspeed } from '../calculators/cruise/CruiseMachSpeed';
import { getStdTemp } from '../conversionTool';

import { FlightPhase } from '../FlightPhase';

const airport = useTakeOffStore();

export class CruisePhase extends FlightPhase {
  private averageWeight = 0;

  constructor(previous: FlightPhase) {
    super('Cruise', 'Cruise at same altitude', PhaseType.CRUISE, previous);

    this.altitude = this.getStartingAltitude();
    this.distance = this.Distance();
    this.fuelUsed = this.FuelUsed();
    this.duration = this.Duration();
    this.fuelFlow = (this.FuelUsed() / this.Duration()) * 60;
    this.averageWeight = this.getCruiseAverageWeight();
  }

  MachSpeed(): number {
    this.machSpeed = CruiseMachSpeed(
      this.altitude,
      this.getStartingWeight(),
      this.drag
    );
    return this.machSpeed;
  }

  private FuelUsed(): number {
    const FuelFlow =
      this.trueAirSpeed /
      CruiseNMperLbsUsed(this.altitude, this.averageWeight, this.drag);

    this.fuelUsed = 10 * Math.ceil((FuelFlow * this.Duration()) / 600);
    this.fuelFlow = FuelFlow;
    this.MachSpeed();
    return this.fuelUsed;
  }

  private Duration(): number {
    this.trueAirSpeed = TrueAirspeed(
      this.machSpeed,
      getStdTemp(this.altitude) + airport.DeltaTemp
    );

    const groundSpeed = this.trueAirSpeed - this.wind.RelativeHeadwind(this.course);
    const duration = this.distance / (groundSpeed / 60);
    this.duration = duration;
    return duration;
  }

  private Distance(): number {
    return this.distance;
  }

  Recalc() {
    this.fuelUsed = this.FuelUsed();
    this.duration = this.Duration();
    this.distance = this.Distance();
  }

  ChangeDistance(distance: number) {
    this.distance = distance;
    this.Recalc();
  }

  private getCruiseAverageWeight(): number {
    const cruiseMach = CruiseMachSpeed(
      this.altitude,
      this.getStartingWeight(),
      this.drag
    );

    const Ktas = TrueAirspeed(
      cruiseMach,
      getStdTemp(this.altitude) + airport.DeltaTemp
    );

    const groundSpeed = Ktas - this.wind.RelativeHeadwind(this.course);

    const FuelFlow =
      Ktas /
      CruiseNMperLbsUsed(this.altitude, this.getStartingWeight(), this.drag);

    // then duration  = distance with ground Speed.
    const duration = this.distance / (groundSpeed / 60);
    const fuelUsedForMaxWeight = (FuelFlow / 60) * duration;

    // then Same calcul with Avegage Weight
    return this.getStartingWeight() - fuelUsedForMaxWeight / 2;
  }
}
