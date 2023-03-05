<template>
  <td class="text-h6">{{ phase.label }}</td>

  <td>{{ phase.getStartingWeight().toFixed(0) }}</td>
  <td :style="check(phase.getFuelOnBoard(), reserve)">
    {{ phase.getFuelOnBoard().toFixed(0) }}
  </td>
  <td>
    <q-input
      filled
      dense
      debounce="500"
      class="q-mr-md"
      label="Qty refueled (lbs)"
      v-model.number="fuelOnBoard"
      @update:model-value="Refuel"
      :rules="[(val) => val > 0 || 'You must refuel']"
    ></q-input>
  </td>
  <td></td>
  <td>{{ phase.getStartingAltitude() }}</td>
  <td></td>
  <td></td>
  <td>{{ phase.distance }}</td>
  <td>{{ phase.duration }}</td>
  <td>{{ phase.drag.toFixed(2) }}</td>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IFlightPhase } from '../models';
import { RefuelPhase } from 'src/service/flight/RefuelPhase';

const fuelOnBoard = ref(0);

const props = defineProps<{
  phase: IFlightPhase;
  reserve: number;
  check: (a: number, b: number) => string;
}>();

onMounted(() => {
  fuelOnBoard.value = 0;
});

const Refuel = () => {
  if (props.phase instanceof RefuelPhase) {
    props.phase.Refuel(fuelOnBoard.value);
    props.phase.Recalc();
  }
};
</script>
