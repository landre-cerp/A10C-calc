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
      :rules="[(val) => val > 0 || 'must be greater than 0']"
    ></q-input>
  </td>
  <td>{{ phase.getStartingAltitude() }}</td>
  <td>{{ phase.altitude }}</td>
  <td></td>

  <td>
    <q-input
      filled
      debounce="500"
      class="text-h6 q-mr-md"
      label="Duration in minutes"
      v-model.number="phaseDuration"
      @update:model-value="ChangePhaseDuration"
      :rules="[(val) => val > 0 || 'must be greater than 0']"
    ></q-input>
  </td>
  <td>{{ phase.drag.toFixed(2) }}</td>
</template>

<script setup lang="ts">
import { CombatPhase } from 'src/service/CombatPhase';

import { onMounted, ref } from 'vue';
import { IFlightPhase } from './models';

const fuelFlow = ref(0);
const phaseDuration = ref(0);

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
const ChangePhaseDuration = () => {
  if (props.phase instanceof CombatPhase) {
    props.phase.ChangeDuration(phaseDuration.value);
    props.phase.Recalc();
  }
};
</script>
