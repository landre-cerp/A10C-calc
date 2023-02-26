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

    <div v-if="flight.FlightPhases.length == 0">
      <q-btn @click="flight.AddPhase(PhaseType.TAKEOFF)">{{
        PhaseType[PhaseType.TAKEOFF]
      }}</q-btn>
    </div>
    <div v-else>
      <q-card v-for="(phase, index) in flight.FlightPhases" :key="index">
        <q-card-section horizontal>
          <q-card-section>
            <TakeoffPhaseViewer
              v-if="phase.type == PhaseType.TAKEOFF"
              :phase="phase"
            />
            <PhaseViewer v-else :phase="phase" />
          </q-card-section>
          <q-card-section>
            <q-btn
              color="black"
              v-if="index == flight.FlightPhases.length - 1"
              icon="delete"
              @click="flight.RemovePhase()"
            ></q-btn>
          </q-card-section>
        </q-card-section>
      </q-card>

      <q-btn
        color="primary"
        v-for="(possible, idxPhase) in flight.NextPhases"
        :key="idxPhase"
        @click="flight.AddPhase(possible)"
        >{{ PhaseType[possible] }}
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useA10CStore } from 'src/stores/a10c';
import { useAirportStore } from 'src/stores/Airport';
import { useFlightStore } from 'src/stores/flight';
import { storeToRefs } from 'pinia';

import { PhaseType } from './models';

import { OptimumCruiseAltitude } from 'src/service/calculators/OptimumCruiseAltitude';

import { computed, onMounted, ref } from 'vue';
import PhaseViewer from './PhaseViewer.vue';
import TakeoffPhaseViewer from './TakeoffPhaseViewer.vue';

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
  const onZonePhase = flight.phases.find((p) => p.type == PhaseType.COMBAT);

  if (onZonePhase) {
    onZonePhase.fuelUsed = (onZonePhase.fuelUsed * onZonePhase.duration) / 60;
  }
  const RTBPhase = flight.FlightPhases.find((p) => p.type == PhaseType.RTB);
  if (RTBPhase) {
    RTBPhase.Drag = aircraft.Drag - releaseWeaponsDrag();
  }

  flight.Recalc();

  if (onZonePhase) {
    maxTimeOnZone.value = Math.floor(
      (DescentPhase.fuelOnBoard - flight.fuelReserve) /
        (onZonePhase.fuelFlow / 60)
    );
  } else {
    maxTimeOnZone.value = 0;
  }
}

// function changeCombatFuelFlow() {
//   const onZonePhase = flight.phases.find((p) => p.type == PhaseType.COMBAT);
//   if (onZonePhase) {
//     onZonePhase.fuelUsed = combatFuelFlow.value;
//   }
//   Recalc();
// }

// function changeCombatDuration() {
//   const onZonePhase = flight.phases.find((p) => p.type == PhaseType.COMBAT);
//   if (onZonePhase) {
//     onZonePhase.duration = combatDuration.value;
//   }
//   Recalc();
// }

// function releaseWeaponsWeight(): number {
//   let releasedWeight = 0;

//   for (let i = 0; i < loadedPylons.value.length; i++) {
//     releasedWeight += releasedStore.value[i] ? loadedPylons.value[i].weight : 0;
//   }

//   return releasedWeight;
// }

function releaseWeaponsDrag(): number {
  let weaponsDrag = 0;

  for (let i = 0; i < loadedPylons.value.length; i++) {
    weaponsDrag += releasedStore.value[i] ? loadedPylons.value[i].drag : 0;
  }

  return weaponsDrag;
}
</script>
