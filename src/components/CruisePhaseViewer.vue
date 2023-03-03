<template>
  <td class="text-h6">{{ phase.label }}</td>
  <td>{{ phase.getStartingWeight().toFixed(0) }}</td>
  <td :style="check(phase.getFuelOnBoard(), reserve)">
    {{ phase.getFuelOnBoard().toFixed(0) }}
  </td>
  <td>{{ phase.fuelUsed.toFixed(0) }}</td>
  <td>{{ phase.fuelFlow.toFixed(0) }}</td>

  <td>{{ phase.getStartingAltitude() }}</td>
  <td>{{ phase.altitude }}</td>
  <td>{{ phase.RelativeHeadwind() }}</td>
  <td>
    <q-input
      filled
      debounce="500"
      dense
      style="width: 80px"
      class="q-mr-md"
      label="distance"
      v-model.number="distance"
      @update:model-value="ChangePhaseDistance"
      :rules="[
        (val) =>
          (val > 0 && phase.fuelUsed <= phase.getFuelOnBoard() - reserve) ||
          'must be greater than 0 && have check fuel',
      ]"
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
  reserve: number;
  check: (a: number, b: number) => string;
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
