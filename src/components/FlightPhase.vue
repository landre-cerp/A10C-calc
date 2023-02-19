<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<template>
  <div class="q-pa-md items-start q-gutter-sm">
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
            :rules="[(val) => val >= 0 && descentPhase.FuelOnBoard >= val]"
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

    <q-markup-table separator="cell" wrap-cell>
      <thead>
        <tr>
          <th></th>
          <th class="text-center" colspan="2">Starting Phase with</th>
          <th colspan="5"></th>
        </tr>
        <tr>
          <th class="text-left">Phase</th>
          <th class="text-right">W (lbs)</th>
          <th class="text-right">FOB (lbs)</th>
          <th class="text-center">Comment</th>
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

          <td
            class="text-right"
            v-if="phase.type == PhaseType.CRUISE || phase.type == PhaseType.RTB"
          >
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
                        getStdTemp(flight.CruisePressureAlt) + airport.DeltaTemp
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
                        getStdTemp(flight.CruisePressureAlt) + airport.DeltaTemp
                      ) - cruiseHeadWind
                    }}
                    Kts
                  </q-item>
                  <q-item>
                    {{ phase.FuelFlow.toFixed(0) }}
                    Lbs/hr
                  </q-item>
                  <q-item
                    class="text-bold col"
                    v-if="phase.type == PhaseType.RTB"
                  >
                    ALL WEAPONS Releases
                  </q-item>
                </q-list>
              </q-item-section>
            </q-item>
          </td>
          <td v-if="phase.type == PhaseType.ONZONE">
            <q-input
              class="q-mr-md"
              v-model.number="combatFuelFlow"
              label="Combat Fuel Flow"
            >
              <template v-slot:append>{{
                ((combatFuelFlow * combatduration) / 60).toFixed(0)
              }}</template>
            </q-input>
          </td>

          <td v-else class="text-right">
            <q-item>{{ phase.comment }}</q-item>
          </td>

          <td
            class="text-right text-bold"
            v-if="phase.type == PhaseType.CRUISE || phase.type == PhaseType.RTB"
          >
            {{ phase.FuelUsed.toFixed(0) }}
          </td>
          <td v-else class="text-right">{{ phase.FuelUsed.toFixed(0) }}</td>

          <td v-if="phase.type == PhaseType.ONZONE" class="text-right"></td>
          <td v-else class="text-right">{{ phase.Distance }}</td>

          <td v-if="phase.type == PhaseType.ONZONE">
            <q-input
              class="q-mr-md"
              v-model.number="combatduration"
              label="Combat Duration"
            ></q-input>
          </td>

          <td v-else class="text-right">{{ phase.Duration }}</td>
          <td
            v-if="phase.type == PhaseType.ONZONE"
            class="text-right text-bold"
          >
            {{
              combatCeiling(
                phase.startWeight,
                airport.DeltaTemp,
                aircraft.Drag
              ).toFixed(0)
            }}
          </td>
          <td v-else class="text-right"></td>
        </tr>
      </tbody>
    </q-markup-table>
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
import { onMounted, onUpdated, ref } from 'vue';

const aircraft = useA10CStore();
const airport = useAirportStore();
const flight = useFlightStore();

flight.Qnh = airport.Qnh;

const { cruiseHeadWind, missionRange, fuelReserve, phases, FlightLevel } =
  storeToRefs(flight);

const combatFuelFlow = ref(7000);
const combatduration = ref(30);
const descentPhase = ref(phases.value.find((p) => p.type == PhaseType.DESCENT));

onMounted(() => {
  // init Phases with Stores Value;
  const TakeOffPhase = phases.value.find((p) => p.type == PhaseType.TAXI);

  if (TakeOffPhase) {
    TakeOffPhase.FuelOnBoard = Math.ceil(aircraft.FuelWeight);
    TakeOffPhase.startWeight = Math.ceil(aircraft.TotalWeight);
    TakeOffPhase.Drag = aircraft.Drag;
  }

  // At component init, set params and recalc
  const ClimbPhase = phases.value.find((p) => p.type == PhaseType.CLIMB);

  if (ClimbPhase && TakeOffPhase) {
    ClimbPhase.startWeight = TakeOffPhase.startWeight - TakeOffPhase.FuelUsed;
    ClimbPhase.Drag = aircraft.Drag;
  }

  const CruisePhase = phases.value.find((p) => p.type == PhaseType.CRUISE);

  const onZonePhase = phases.value.find((p) => p.type == PhaseType.ONZONE);
  if (onZonePhase && CruisePhase) {
    onZonePhase.FuelUsed = (combatFuelFlow.value / 60) * combatduration.value;
  }

  const RTBPhase = phases.value.find((p) => p.type == PhaseType.RTB);
  if (CruisePhase && RTBPhase) {
    RTBPhase.Distance = CruisePhase.Distance;
  }

  // Descent Phase
  const DescentPhase = phases.value.find((p) => p.type == PhaseType.DESCENT);
  if (DescentPhase && CruisePhase) {
    DescentPhase.Drag = aircraft.Drag;
    DescentPhase.FuelOnBoard = fuelReserve.value;
    DescentPhase.startWeight = aircraft.ZeroFuelWeight + fuelReserve.value;
  }
  Recalc();
});

onUpdated(() => {
  Recalc();
});

function RecalcClimb(ClimbPhase: FlightPhase) {
  // Recalc Climb Phase

  ClimbPhase.FuelUsed = ClimbFuelUsed(
    airport.AirportPressureAltitude,
    flight.CruisePressureAlt,
    ClimbPhase.startWeight,
    airport.DeltaTemp,
    ClimbPhase.Drag
  );

  ClimbPhase.Duration = ClimbTimeNeeded(
    airport.AirportPressureAltitude,
    flight.CruisePressureAlt,
    ClimbPhase.startWeight,
    airport.DeltaTemp,
    ClimbPhase.Drag
  );

  ClimbPhase.Distance = ClimbDistanceNeeded(
    airport.AirportPressureAltitude,
    flight.CruisePressureAlt,
    ClimbPhase.startWeight,
    airport.DeltaTemp,
    ClimbPhase.Drag
  );
}

function RecalcCruise(ClimbPhase: FlightPhase, CruisePhase: FlightPhase) {
  // Step 1 - Optimum Cruise Altitude with startWeight
  CruisePhase.Drag = ClimbPhase.Drag;

  CruisePhase.Distance = missionRange.value - ClimbPhase.Distance;
  const AverageWeight = getCruiseAverageWeight(CruisePhase);

  const Ktas = TrueAirspeed(
    CruiseMachSpeed(
      flight.CruisePressureAlt,
      AverageWeight,
      airport.DeltaTemp,
      CruisePhase.Drag
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
      CruisePhase.Drag
    );

  CruisePhase.Duration = Math.ceil(CruisePhase.Distance / (groundSpeed / 60));
  CruisePhase.FuelUsed = Math.ceil((FuelFlow * CruisePhase.Duration) / 60);
  CruisePhase.FuelFlow = FuelFlow;
}

function RecalcRTB(distance: number, RTBPhase: FlightPhase) {
  // RTB is different because we need to calculate the fuel needed to reach the RTB point
  // it depends on the armament used during the combat

  // Let's calculate the worst case scenario
  // no weapon used during the combat

  const AverageWeight =
    (RTBPhase.startWeight + aircraft.ZeroFuelWeight + fuelReserve.value) / 2;
  console.log('Average', AverageWeight);

  RTBPhase.Distance = distance;

  const Ktas = TrueAirspeed(
    CruiseMachSpeed(
      flight.CruisePressureAlt,
      AverageWeight,
      airport.DeltaTemp,
      RTBPhase.Drag
    ),
    getStdTemp(flight.CruisePressureAlt) + airport.DeltaTemp
  );
  const groundSpeed = Ktas + cruiseHeadWind.value;

  const FuelFlow =
    Ktas /
    CruiseNMperLbsUsed(
      flight.CruisePressureAlt,
      AverageWeight,
      airport.DeltaTemp,
      RTBPhase.Drag
    );

  console.log('FuelFlow', FuelFlow, 'Ktas', Ktas, 'groundSpeed', groundSpeed);

  RTBPhase.Duration = Math.ceil(distance / (groundSpeed / 60));
  RTBPhase.FuelUsed = Math.ceil((FuelFlow * RTBPhase.Duration) / 60);
  RTBPhase.FuelFlow = FuelFlow;
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
  const RTBPhase = phases.value[4];

  RecalcClimb(ClimbPhase);
  RecalcCruise(ClimbPhase, CruisePhase);
  RTBPhase.startWeight = CruisePhase.startWeight - CruisePhase.FuelUsed - 4930; // Wepons
  RTBPhase.Drag = aircraft.Drag - 3.72;
  RecalcRTB(CruisePhase.Distance, RTBPhase);

  flight.Recalc();
}
</script>
