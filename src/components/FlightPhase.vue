<template>
  <div class="q-pa-md row items-start q-gutter-sm">
    <div class="col">
      <div class="row q-gutter-md">
        <div class="col">
          <div class="row">
            <q-input
              v-model.number="FlightLevel"
              mask="###"
              label="Flight Level (Ex 160)"
              @update:model-value="Recalc"
            >
            </q-input>
            <q-input
              v-model.number="fuelReserve"
              label="Fuel Reserve"
              @update:model-value="Recalc"
            ></q-input>
          </div>
          <q-item-label>
            Pressure Altitude {{ flight.CruisePressureAlt }} with QNH
            {{ flight.Qnh.value }} {{ QNH_Unit[flight.Qnh.unit] }}
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
        <q-markup-table separator="vertical">
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
                <div class="col">
                  <q-item> {{ phase.FuelUsed.toFixed(5) }} NM/Lbs </q-item>
                  <q-item>
                    {{
                      CruiseMachSpeed(
                        flight.CruisePressureAlt,
                        phase.startWeight,
                        airport.DeltaTemp,
                        aircraft.Drag,
                        phase.Distance
                      ).toFixed(2)
                    }}
                    Mach
                  </q-item>
                </div>
              </td>
              <td v-else class="text-right">{{ phase.FuelUsed }}</td>
              <td v-if="phase.type == PhaseType.CRUISE" class="text-right">
                <q-input
                  input-class="text-right"
                  v-model.number="phase.Distance"
                  label="Distance in Phase"
                  @update:model-value="Recalc"
                  :rules="[(val) => val >= 0]"
                ></q-input>
              </td>
              <td v-else class="text-right">{{ phase.Distance }}</td>
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
import { PhaseType, QNH_Unit } from './models';

import { ClimbFuelUsed } from 'src/service/calculators/ClimbFuel';
import { ClimbTimeNeeded } from 'src/service/calculators/ClimbTime';
import { ClimbDistanceNeeded } from 'src/service/calculators/ClimbDistance';
import {
  CruiseFuelUsed,
  CruiseMachSpeed,
} from 'src/service/calculators/CruiseFuel';

import { QInput, QItem, QItemSection, QItemLabel, QMarkupTable } from 'quasar';
import { combatCeiling } from 'src/service/calculators/CombatCeiling';

const aircraft = useA10CStore();
const airport = useAirportStore();
const flight = useFlightStore();

flight.Qnh = airport.Qnh;
const { fuelReserve, phases, FlightLevel } = storeToRefs(flight);

// init Phases with Stores Value;
const TakeOffPhase = phases.value[0];
TakeOffPhase.FuelOnBoard = Math.ceil(aircraft.FuelWeight);
TakeOffPhase.startWeight = Math.ceil(aircraft.TotalWeight);

// At component init, set params and recalc
const ClimbPhase = phases.value[1];
ClimbPhase.startWeight = TakeOffPhase.startWeight - TakeOffPhase.FuelUsed;

Recalc();

function Recalc() {
  const ClimbPhase = phases.value[1];
  const CruisePhase = phases.value[2];

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

  CruisePhase.FuelUsed = CruiseFuelUsed(
    flight.CruisePressureAlt,
    CruisePhase.startWeight,
    airport.DeltaTemp,
    aircraft.Drag,
    CruisePhase.Distance
  );

  ClimbPhase.Distance = ClimbDistanceNeeded(
    airport.AirportPressureAltitude,
    flight.CruisePressureAlt,
    ClimbPhase.startWeight,
    airport.DeltaTemp,
    aircraft.Drag
  );

  CruisePhase.FuelUsed = CruiseFuelUsed(
    flight.CruisePressureAlt,
    CruisePhase.startWeight,
    airport.DeltaTemp,
    aircraft.Drag,
    CruisePhase.Distance
  );

  flight.Recalc();
}
</script>
