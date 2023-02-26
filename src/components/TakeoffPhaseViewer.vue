<template>
  <q-card-section horizontal>
    <q-item class="text-h6">{{ phase.label }}</q-item>

    <q-item>Weight : {{ phase.startWeight.toFixed(0) }}</q-item>
    <q-item>FOB : {{ phase.fuelOnBoard.toFixed(0) }}</q-item>
    <q-item>Fuel use: {{ phase.fuelUsed.toFixed(0) }}</q-item>
    <q-item>FF : {{ phase.fuelFlow }}</q-item>
    <q-item>Distance: {{ phase.distance }} NM</q-item>
    <q-item>Altitude: {{ phase.altitude }} ft</q-item>
    <q-item>Duration : {{ phase.duration }} min</q-item>
    <q-item>Drag: {{ phase.drag.toFixed(2) }}</q-item>
  </q-card-section>
</template>

<script setup lang="ts">
import { IFlightPhase } from './models';

const props = defineProps<{
  phase: IFlightPhase;
}>();
</script>
