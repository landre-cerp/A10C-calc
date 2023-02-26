<template>
  <q-list class="row">
    <q-item class="text-h6">{{ phase.label }}</q-item>

    <q-item>Weight : {{ phase.startWeight.toFixed(0) }}</q-item>
    <q-item>FOB : {{ phase.fuelOnBoard.toFixed(0) }}</q-item>
    <q-item>Fuel used: {{ phase.fuelUsed.toFixed(0) }}</q-item>
    <q-item>FF : {{ phase.fuelFlow }}</q-item>
    <q-item>Distance: {{ phase.distance }} NM</q-item>
    <q-item>
      <q-input
        filled
        debounce="500"
        class="text-h6 q-mr-md"
        label="Altitude"
        v-model.number="altitude"
        @update:model-value="ChangePhaseAltitude"
      ></q-input>
      Altitude: {{ phase.altitude }} ft</q-item
    >
    <q-item>Duration : {{ phase.duration }} min</q-item>
    <q-item>Drag: {{ phase.drag.toFixed(2) }}</q-item>
  </q-list>
</template>

<script setup lang="ts">
import { ClimbPhase } from 'src/service/ClimbPhase';

import { onMounted, ref } from 'vue';
import { IFlightPhase } from './models';

const altitude = ref(0);

const props = defineProps<{
  phase: IFlightPhase;
}>();

onMounted(() => {
  altitude.value = props.phase.altitude;
});

const ChangePhaseAltitude = () => {
  if (props.phase instanceof ClimbPhase) {
    props.phase.ChangeAltidude(altitude.value);
    props.phase.Recalc();
  }
};
</script>
