<template>
  <div class="q-pa-sm items-start q-gutter-sm">
    <div class="row q-gutter-sm">
      <q-input
        filled
        dense
        debounce="500"
        class="q-mr-md"
        v-model.number="FlightLevel"
        mask="###"
        label="Flight Level (Ex 160)"
        :hint="'Optimum Cruise Altitude' + optimum_cruise_altitude.toFixed(0)"
      >
      </q-input>
      <q-input
        filled
        dense
        debounce="500"
        class="q-mr-md"
        v-model.number="fuelReserve"
        label="Fuel Reserve"
        :rules="[(val) => val >= 0]"
      ></q-input>
      <q-input
        filled
        dense
        debounce="500"
        class="q-mr-md"
        v-model.number="missionRange"
        label="Mission Range"
      ></q-input>

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
      <q-item>
        <q-item-section>
          <q-item-label>BINGO </q-item-label>
          <p class="text-h6">{{ flight.Bingo }}</p>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>BINGO </q-item-label>
          <p class="text-h6">
            {{
              airport.Winds[1] == WindDirections.Head
                ? 'Head wind : '
                : 'Tail wind : '
            }}
            {{ airport.Winds[0] }} Kts
          </p>
        </q-item-section>
      </q-item>
    </div>

    <q-markup-table class="text-right" separator="cell">
      <thead>
        <tr>
          <th>Phase</th>
          <th>Weight (lbs)</th>
          <th>FOB (lbs)</th>
          <th>Fuel Used</th>
          <th>F.Flow</th>
          <th>AT (ft)</th>
          <th>To (ft)</th>
          <th>Dist.( NM )</th>
          <th>Dur. (min)</th>
          <th>Drag</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(phase, index) in flight.FlightPhases" :key="index">
          <TakeoffPhaseViewer
            v-if="phase.type == PhaseType.TAKEOFF"
            :phase="phase"
          />
          <ClimbPhaseViewer
            v-else-if="phase.type == PhaseType.CLIMB"
            :phase="phase"
          />
          <CruisePhaseViewer
            v-else-if="phase.type == PhaseType.CRUISE"
            :phase="phase"
          />
          <CombatPhaseViewer
            v-else-if="phase.type == PhaseType.COMBAT"
            :phase="phase"
          />
          <RefuelPhaseViewer
            v-else-if="phase.type == PhaseType.REFUEL"
            :phase="phase"
          />
          <LandingPhaseViewer
            v-else-if="phase.type == PhaseType.LANDING"
            :phase="phase"
          />
          <DescentPhaseViewer
            v-else-if="phase.type == PhaseType.DESCENT"
            :phase="phase"
          />
          <PhaseViewer v-else :phase="phase" />
          <td>
            <q-btn
              color="primary"
              icon="update"
              @click="phase.Recalc()"
            ></q-btn>
            <q-btn
              color="red"
              v-if="index == flight.FlightPhases.length - 1"
              icon="delete"
              @click="flight.RemovePhase()"
            ></q-btn>
          </td>
        </tr>
        <tr v-if="flight.FlightPhases.length == 0">
          <td colspan="2" class="text-left">
            <q-btn @click="flight.AddPhase(PhaseType.TAKEOFF)">{{
              PhaseType[PhaseType.TAKEOFF]
            }}</q-btn>
          </td>
          <td colspan="*"></td>
        </tr>
        <tr v-else>
          <td colspan="7" class="text-left">
            <q-btn
              color="primary"
              v-for="(possible, idxPhase) in flight.NextPhases"
              :key="idxPhase"
              @click="flight.AddPhase(possible)"
              >{{ PhaseType[possible] }}
            </q-btn>
          </td>
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

import { PhaseType } from './models';

import { OptimumCruiseAltitude } from 'src/service/calculators/OptimumCruiseAltitude';

import { computed } from 'vue';
import PhaseViewer from './PhaseViewer.vue';
import TakeoffPhaseViewer from './TakeoffPhaseViewer.vue';
import ClimbPhaseViewer from './ClimbPhaseViewer.vue';
import CruisePhaseViewer from './CruisePhaseViewer.vue';
import CombatPhaseViewer from './CombatPhaseViewer.vue';
import RefuelPhaseViewer from './RefuelPhaseViewer.vue';
import LandingPhaseViewer from './LandingPhaseViewer.vue';
import DescentPhaseViewer from './DescentPhaseViewer.vue';
import { WindDirections } from 'src/service/conversionTool';

const aircraft = useA10CStore();
const airport = useAirportStore();
const flight = useFlightStore();

flight.Qnh = airport.Qnh;

const { missionRange, fuelReserve, FlightLevel } = storeToRefs(flight);

const optimum_cruise_altitude = computed(() => {
  {
    return OptimumCruiseAltitude(
      aircraft.Drag,
      aircraft.TakeOffWeight,
      missionRange.value
    );
  }
});
</script>
