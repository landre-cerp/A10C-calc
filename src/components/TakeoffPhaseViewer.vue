<template>
  <td class="text-h6">{{ phase.label }}</td>
  <td>{{ phase.getStartingWeight().toFixed(0) }}</td>
  <td>{{ phase.getFuelOnBoard().toFixed(0) }}</td>
  <td>{{ phase.fuelUsed.toFixed(0) }}</td>
  <td></td>

  <td>{{ phase.getStartingAltitude() }}</td>
  <td>{{ phase.altitude }}</td>
  <td>{{ phase.distance }}</td>
  <td>{{ phase.duration }}</td>
  <td>{{ phase.drag.toFixed(2) }}</td>
</template>

<script setup lang="ts">
import { IFlightPhase } from './models';

const props = defineProps<{
  phase: IFlightPhase;
}>();
</script>
