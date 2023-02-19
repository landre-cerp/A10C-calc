<template>
  <div class="q-pa-md row items-start q-gutter-sm">
    <div class="col">
      <div class="row q-gutter-md">
        <div class="col">
          <div class="row q-mb-md">
            <q-input
              class="text-h6 q-mr-md"
              v-model.number="FlightLevel"
              mask="###"
              label="Flight Level (Ex 160)"
            >
            </q-input>
            <q-input
              class="text-h6 q-mr-md"
              v-model.number="fuelReserve"
              label="Fuel Reserve"
            ></q-input>
            <q-input
              class="text-h6 q-mr-md"
              v-model.number="missionRange"
              label="Mission Range"
            ></q-input>
            <q-input
              class="text-h6 q-mr-md"
              v-model.number="cruiseHeadWind"
              label="Cruise Head Wind"
            ></q-input>
          </div>
          <q-item-label class="q-mb-md">
            Pressure Altitude {{ Math.ceil(flight.CruisePressureAlt) }} with QNH
            {{ flight.Qnh.value }} {{ QNH_Unit[flight.Qnh.unit] }}
          </q-item-label>

          <q-item-label class="q-mb-md">
            Optimum Cruise Altitude
            {{
              OptimumCruiseAltitude(
                aircraft.Drag,
                aircraft.TakeOffWeight,
                missionRange
              ).toFixed(0)
            }}
          </q-item-label>
        </div>

        <q-item>
          <q-item-section>
            <q-item-label>BINGO</q-item-label>
            <p class="text-h6">{{ flight.Bingo }}</p>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>STD Day T° Dev</q-item-label>
            <p class="text-h6">{{ airport.DeltaTemp }}</p>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Drag</q-item-label>
            <p class="text-h6">{{ aircraft.Drag.toFixed(2) }}</p>
          </q-item-section>
        </q-item>
      </div>
      <div class="col">
        <q-markup-table separator="cell">
          <thead>
            <tr>
              <th></th>
              <th class="text-center" colspan="2">Starting Phase with</th>
              <th colspan="4"></th>
            </tr>
            <tr>
              <th class="text-left">Phase</th>
              <th class="text-right">W (lbs)</th>
              <th class="text-right">FOB (lbs)</th>
              <th class="text-right">F. Used (lbs)</th>
              <th class="text-right">Dist (NM)</th>
              <th class="text-right">Time (min)</th>
              <th class="text-right">Combat Ceiling (500fpm)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(phase, index) in phases" :key="index">
              <td class="text-left text-h6">{{ phase.label }}</td>
              <td class="text-right">{{ phase.startWeight }}</td>
              <td class="text-right">{{ phase.FuelOnBoard }}</td>
              <td class="text-right" v-if="phase.type == PhaseType.CRUISE">
                <q-item>
                  <q-item-section>
                    <q-list dense>
                      <q-item>Optimum params</q-item>
                      <q-item>
                        {{
                          CruiseMachSpeed(
                            flight.CruisePressureAlt,
                            phase.startWeight,
                            airport.DeltaTemp,
                            aircraft.Drag
                          ).toFixed(2)
                        }}
                        Mach
                      </q-item>
                      <q-item>
                        {{
                          TrueAirspeed(
                            CruiseMachSpeed(
                              flight.CruisePressureAlt,
                              phase.startWeight,
                              airport.DeltaTemp,
                              aircraft.Drag
                            ),
                            getStdTemp(flight.CruisePressureAlt) +
                              airport.DeltaTemp
                          ).toFixed(0)
                        }}
                        Kts
                      </q-item>
                      <q-item>
                        {{
                          TrueAirspeed(
                            CruiseMachSpeed(
                              flight.CruisePressureAlt,
                              phase.startWeight,
                              airport.DeltaTemp,
                              aircraft.Drag
                            ),
                            getStdTemp(flight.CruisePressureAlt) +
                              airport.DeltaTemp
                          ) - cruiseHeadWind
                        }}
                        Kts
                      </q-item>
                      <q-item>
                        {{ phase.FuelFlow.toFixed(0) }}
                        Lbs/hr
                      </q-item>
                    </q-list>
                  </q-item-section>

                  <q-item-section>
                    <q-item class="text-bold">
                      {{ phase.FuelUsed.toFixed(0) }} Lbs
                    </q-item>
                  </q-item-section>
                </q-item>
              </td>
              <td v-else class="text-right">{{ phase.FuelUsed }}</td>
              <td class="text-right">{{ phase.Distance }}</td>
              <td class="text-right">{{ phase.Duration }}</td>
              <td class="text-right">
                {{
                  combatCeiling(
                    phase.startWeight,
                    airport.DeltaTemp,
                    aircraft.Drag
                  ).toFixed(0)
                }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useA10CStore } from 'src/stores/a10c';
import { useAirportStore } from 'src/stores/Airport';
import { useFlightStore } from 'src/stores/flight';
import { storeToRefs } from 'pinia';
import { FlightPhase, PhaseType, QNH_Unit } from './models';

import { ClimbFuelUsed } from 'src/service/calculators/ClimbFuel';
import { ClimbTimeNeeded } from 'src/service/calculators/ClimbTime';
import { ClimbDistanceNeeded } from 'src/service/calculators/ClimbDistance';
import { CruiseNMperLbsUsed } from 'src/service/calculators/CruiseFuel';
import {
  CruiseMachSpeed,
  TrueAirspeed,
} from 'src/service/calculators/CruiseMachSpeed';
import { OptimumCruiseAltitude } from 'src/service/calculators/OptimumCruiseAltitude';

import { QInput, QItem, QItemSection, QItemLabel, QMarkupTable } from 'quasar';
import { combatCeiling } from 'src/service/calculators/CombatCeiling';
import { getStdTemp } from 'src/service/conversionTool';
import { onMounted, onUpdated } from 'vue';

const aircraft = useA10CStore();
const airport = useAirportStore();
const flight = useFlightStore();

flight.Qnh = airport.Qnh;
console.log(flight.Qnh);
const { cruiseHeadWind, missionRange, fuelReserve, phases, FlightLevel } =
  storeToRefs(flight);

// init Phases with Stores Value;
const TakeOffPhase = phases.value[0];
TakeOffPhase.FuelOnBoard = Math.ceil(aircraft.FuelWeight);
TakeOffPhase.startWeight = Math.ceil(aircraft.TotalWeight);

// At component init, set params and recalc
const ClimbPhase = phases.value[1];
ClimbPhase.startWeight = TakeOffPhase.startWeight - TakeOffPhase.FuelUsed;

onMounted(() => {
  Recalc();
});

onUpdated(() => {
  Recalc();
});

function recalcClimb(ClimbPhase: FlightPhase) {
  // Recalc Climb Phase

  ClimbPhase.FuelUsed = ClimbFuelUsed(
    airport.AirportPressureAltitude,
    flight.CruisePressureAlt,
    ClimbPhase.startWeight,
    airport.DeltaTemp,
    aircraft.Drag
  );

  ClimbPhase.Duration = ClimbTimeNeeded(
    airport.AirportPressureAltitude,
    flight.CruisePressureAlt,
    ClimbPhase.startWeight,
    airport.DeltaTemp,
    aircraft.Drag
  );

  ClimbPhase.Distance = ClimbDistanceNeeded(
    airport.AirportPressureAltitude,
    flight.CruisePressureAlt,
    ClimbPhase.startWeight,
    airport.DeltaTemp,
    aircraft.Drag
  );
}

function RecalcCruise(ClimbPhase: FlightPhase, CruisePhase: FlightPhase) {
  // Step 1 - Optimum Cruise Altitude with startWeight

  CruisePhase.Distance = missionRange.value - ClimbPhase.Distance;
  const AverageWeight = getCruiseAverageWeight(CruisePhase);

  const Ktas = TrueAirspeed(
    CruiseMachSpeed(
      flight.CruisePressureAlt,
      AverageWeight,
      airport.DeltaTemp,
      aircraft.Drag
    ),
    getStdTemp(flight.CruisePressureAlt) + airport.DeltaTemp
  );
  const groundSpeed = Ktas - cruiseHeadWind.value;

  const FuelFlow =
    Ktas /
    CruiseNMperLbsUsed(
      flight.CruisePressureAlt,
      AverageWeight,
      airport.DeltaTemp,
      aircraft.Drag
    );

  CruisePhase.Duration = Math.ceil(CruisePhase.Distance / (groundSpeed / 60));
  CruisePhase.FuelUsed = Math.ceil((FuelFlow * CruisePhase.Duration) / 60);
  CruisePhase.FuelFlow = FuelFlow;
}

const getCruiseAverageWeight = (CruisePhase: FlightPhase): number => {
  const cruiseMach = CruiseMachSpeed(
    flight.CruisePressureAlt,
    CruisePhase.startWeight, // Start Weight  , then half the fuel Used.
    airport.DeltaTemp,
    aircraft.Drag
  );

  const Ktas = TrueAirspeed(
    cruiseMach,
    getStdTemp(flight.CruisePressureAlt) + airport.DeltaTemp
  );

  const groundSpeed = Ktas - cruiseHeadWind.value;

  const FuelFlow =
    Ktas /
    CruiseNMperLbsUsed(
      flight.CruisePressureAlt,
      CruisePhase.startWeight,
      airport.DeltaTemp,
      aircraft.Drag
    );

  // then duration  = distance with ground Speed.
  const duration = CruisePhase.Distance / (groundSpeed / 60);
  const fuelUsedForMaxWeight = (FuelFlow / 60) * duration;

  // then Same calcul with Avegage Weight
  return CruisePhase.startWeight - fuelUsedForMaxWeight / 2;
};

function Recalc() {
  const ClimbPhase = phases.value[1];
  const CruisePhase = phases.value[2];

  recalcClimb(ClimbPhase);
  RecalcCruise(ClimbPhase, CruisePhase);

  flight.Recalc();
}
</script>
