<template>
  <td class="text-h6">{{ phase.label }}</td>
  <td>{{ phase.getStartingWeight().toFixed(0) }}</td>
  <td>{{ phase.getFuelOnBoard().toFixed(0) }}</td>
  <td>{{ phase.fuelUsed.toFixed(0) }}</td>
  <td>{{ phase.fuelFlow.toFixed(0) }}</td>

  <td>{{ phase.getStartingAltitude() }}</td>
  <td>{{ phase.altitude }}</td>
  <td>
    <q-input
      filled
      debounce="500"
      class="text-h6 q-mr-md"
      label="distance"
      v-model.number="distance"
      @update:model-value="ChangePhaseDistance"
    >
    </q-input>
  </td>
  <td>{{ phase.duration.toFixed(0) }}</td>
  <td>{{ phase.drag.toFixed(2) }}</td>
</template>

<script setup lang="ts">
import { CruisePhase } from 'src/service/CruisePhase';

import { onMounted, ref } from 'vue';
import { IFlightPhase } from './models';

const distance = ref(0);

const props = defineProps<{
  phase: IFlightPhase;
}>();

onMounted(() => {
  distance.value = props.phase.distance;
});

const ChangePhaseDistance = () => {
  if (props.phase instanceof CruisePhase) {
    props.phase.ChangeDistance(distance.value);
    props.phase.Recalc();
  }
};
</script>
