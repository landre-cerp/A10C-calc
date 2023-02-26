<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<template>
  <div class="q-pa-sm items-start q-gutter-sm">
    <div class="row q-gutter-sm">
      <q-input
        filled
        debounce="500"
        class="text-h6 q-mr-md"
        v-model.number="FlightLevel"
        mask="###"
        label="Flight Level (Ex 160)"
        :hint="'Optimum Cruise Altitude' + optimum_cruise_altitude.toFixed(0)"
      >
      </q-input>
      <q-input
        filled
        debounce="500"
        class="text-h6 q-mr-md"
        v-model.number="fuelReserve"
        label="Fuel Reserve"
        :rules="[(val) => val >= 0]"
      ></q-input>
      <q-input
        filled
        debounce="500"
        class="text-h6 q-mr-md"
        v-model.number="missionRange"
        label="Mission Range"
      ></q-input>
      <q-input
        filled
        debounce="500"
        class="text-h6 q-mr-md"
        label="Cruise Head Wind"
        v-model.number="cruiseHeadwind"
        @update:model-value="flight.ChangeCruiseHeadwind"
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
    </div>

    <q-markup-table dense separator="cell">
      <thead>
        <tr>
          <th></th>
          <th class="text-center" colspan="2">Starting Phase with</th>
          <th colspan="7"></th>
        </tr>
        <tr>
          <th class="text-left">Phase</th>
          <th class="text-right">W (lbs)</th>
          <th class="text-right">FOB (lbs)</th>
          <th class="text-center">Comment</th>
          <th class="text-right">F. Used (lbs)</th>
          <th class="text-right">Dist (NM)</th>
          <th class="text-right">HWind</th>

          <th class="text-right">Time (min)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(phase, index) in flight.FlightPhases" :key="index">
          <td class="text-left text-h6">{{ phase.label }}</td>
          <td class="text-right">{{ phase.startWeight }}</td>
          <td
            class="text-right"
            :class="
              phase.FuelOnBoard >= flight.fuelReserve
                ? ''
                : 'text-red text-bold'
            "
          >
            {{ phase.FuelOnBoard }}
          </td>

          <!-- Comment  -->

          <td
            class="text-right"
            v-if="phase.type == PhaseType.CRUISE || phase.type == PhaseType.RTB"
          >
            <q-list dense>
              <q-item class="text-bold">Optimum params</q-item>
              <q-item>
                {{ phase.machSpeed.toFixed(2) }}

                Mach / TAS
                {{ phase.trueAirSpeed.toFixed(0) }}
                Kts / GS
                {{ phase.trueAirSpeed - phase.headwind }}
                Kts
              </q-item>
              <q-item>
                {{ phase.FuelFlow.toFixed(0) }}
                Lbs/hr
              </q-item>
            </q-list>
          </td>
          <td v-else-if="phase.type == PhaseType.ONZONE">
            <q-input
              filled
              debounce="500"
              class="q-mr-md"
              v-model.number="combatFuelFlow"
              label="Combat Fuel Flow"
              @update:model-value="changeCombatFuelFlow"
            >
            </q-input>
            <q-item>
              <q-item-label class="text-bold">
                Combat ceiling :

                {{
                  combatCeiling(
                    phase.startWeight,
                    airport.DeltaTemp,
                    aircraft.Drag
                  ).toFixed(0)
                }}</q-item-label
              >
            </q-item>
            <q-expansion-item
              expand-separator
              icon="cancel"
              :label="`Mission store released :
              ${releaseWeaponsWeight()} lbs`"
              caption="Check released /
              jettissoned weapons"
            >
              <q-card-section>
                <q-list dense>
                  <q-item
                    v-for="(pylon, index) in loadedPylons"
                    :key="index"
                    class="col-12"
                    color="secondary"
                  >
                    <q-checkbox
                      v-model="releasedStore[index]"
                      @update:model-value="Recalc"
                      >{{ 11 - index }} {{ pylon.short }}
                    </q-checkbox>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-expansion-item>
          </td>

          <td v-else class="text-right">
            <q-item>{{ phase.comment }}</q-item>
          </td>

          <!-- FUEL USED  -->

          <td
            class="text-right text-bold"
            v-if="phase.type == PhaseType.CRUISE || phase.type == PhaseType.RTB"
          >
            {{ phase.FuelUsed.toFixed(0) }}
          </td>
          <td v-else class="text-right">{{ phase.FuelUsed.toFixed(0) }}</td>

          <!-- Distance  -->

          <td v-if="phase.type == PhaseType.ONZONE" class="text-right"></td>
          <td v-else class="text-right">{{ phase.Distance }}</td>

          <td>{{ phase.headwind }}</td>

          <!-- TIME -->

          <td v-if="phase.type == PhaseType.ONZONE" style="width: 10em">
            <q-input
              filled
              debounce="500"
              class="q-mr-md"
              v-model.number="combatDuration"
              @update:model-value="changeCombatDuration"
              label="Combat Duration"
              :hint="`Extra time  ${maxTimeOnZone}`"
            ></q-input>
          </td>

          <td v-else class="text-right">{{ phase.Duration }}</td>
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

import {
  CruiseMachSpeed,
  TrueAirspeed,
} from 'src/service/calculators/CruiseMachSpeed';

import { PhaseType } from './models';

import { OptimumCruiseAltitude } from 'src/service/calculators/OptimumCruiseAltitude';

import { combatCeiling } from 'src/service/calculators/CombatCeiling';
import { getStdTemp } from 'src/service/conversionTool';
import { computed, onMounted, onUpdated, ref } from 'vue';

const aircraft = useA10CStore();
const airport = useAirportStore();
const flight = useFlightStore();

flight.Qnh = airport.Qnh;

const {
  missionRange,
  fuelReserve,

  FlightLevel,
  releasedStore,
  cruiseHeadwind,
} = storeToRefs(flight);

const maxTimeOnZone = ref(0);
const combatFuelFlow = ref(0);
const combatDuration = ref(0);

const loadedPylons = computed(() => {
  return aircraft.Pylons?.filter((p) => p.short != '');
});

onMounted(() => {
  // init Phases with Stores Value;

  flight.InitFlight();
  combatFuelFlow.value = flight.combatFuelFlow;
  combatDuration.value = flight.combatDuration;

  Recalc();
});

onUpdated(() => {
  console.log('Component updated');
  Recalc();
});

const optimum_cruise_altitude = computed(() => {
  {
    return OptimumCruiseAltitude(
      aircraft.Drag,
      aircraft.TakeOffWeight,
      missionRange.value
    );
  }
});

function Recalc() {
  const DescentPhase = flight.FlightPhases[5];
  const onZonePhase = flight.phases.find((p) => p.type == PhaseType.ONZONE);

  if (onZonePhase) {
    onZonePhase.releasedWeight = releaseWeaponsWeight();
    onZonePhase.FuelUsed = (onZonePhase.FuelUsed * onZonePhase.Duration) / 60;
  }
  const RTBPhase = flight.FlightPhases.find((p) => p.type == PhaseType.RTB);
  if (RTBPhase) {
    RTBPhase.Drag = aircraft.Drag - releaseWeaponsDrag();
  }

  flight.Recalc();

  if (onZonePhase) {
    maxTimeOnZone.value = Math.floor(
      (DescentPhase.FuelOnBoard - flight.fuelReserve) /
        (onZonePhase.FuelFlow / 60)
    );
  } else {
    maxTimeOnZone.value = 0;
  }
}

function changeCombatFuelFlow() {
  const onZonePhase = flight.phases.find((p) => p.type == PhaseType.ONZONE);
  if (onZonePhase) {
    onZonePhase.FuelUsed = combatFuelFlow.value;
  }
  Recalc();
}

function changeCombatDuration() {
  const onZonePhase = flight.phases.find((p) => p.type == PhaseType.ONZONE);
  if (onZonePhase) {
    onZonePhase.Duration = combatDuration.value;
  }
  Recalc();
}

function releaseWeaponsWeight(): number {
  let releasedWeight = 0;

  for (let i = 0; i < loadedPylons.value.length; i++) {
    releasedWeight += releasedStore.value[i] ? loadedPylons.value[i].weight : 0;
  }

  return releasedWeight;
}

function releaseWeaponsDrag(): number {
  let weaponsDrag = 0;

  for (let i = 0; i < loadedPylons.value.length; i++) {
    weaponsDrag += releasedStore.value[i] ? loadedPylons.value[i].drag : 0;
  }

  return weaponsDrag;
}
</script>
