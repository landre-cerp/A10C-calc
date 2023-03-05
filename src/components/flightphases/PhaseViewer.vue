<template>
  <td class="text-h6">{{ phase.label }}</td>

  <td>{{ phase.getStartingWeight().toFixed(0) }}</td>
  <td>{{ phase.getFuelOnBoard().toFixed(0) }}</td>
  <td>{{ phase.fuelUsed.toFixed(0) }}</td>
  <td>
    <q-input
      filled
      debounce="500"
      class="text-h6 q-mr-md"
      label="Fuel Flow"
      v-model.number="fuelFlow"
      @update:model-value="ChangeFuelFlow"
      :rules="[
        (val) =>
          val > phase.getStartingAltitude() ||
          'Altitude must be greater than original to climb',
      ]"
    ></q-input>
  </td>
  <td>{{ phase.getStartingAltitude() }}</td>
  <td>{{ phase.distance }} NM</td>

  <td>{{ phase.duration }}</td>
  <td>{{ phase.duration }} min</td>
  <td>{{ phase.drag.toFixed(2) }}</td>
</template>

<script setup lang="ts">
import { CombatPhase } from 'src/service/flight/CombatPhase';

import { onMounted, ref } from 'vue';
import { IFlightPhase } from '../models';

const fuelFlow = ref(0);

const props = defineProps<{
  phase: IFlightPhase;
}>();

onMounted(() => {
  fuelFlow.value = props.phase.fuelFlow;
});

const ChangeFuelFlow = () => {
  if (props.phase instanceof CombatPhase) {
    props.phase.ChangeFuelFlow(fuelFlow.value);
    props.phase.Recalc();
  }
};
</script>
