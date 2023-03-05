<template>
  <td class="text-h6">{{ phase.label }}</td>

  <td>{{ phase.getStartingWeight().toFixed(0) }}</td>
  <td :style="check(phase.getFuelOnBoard(), reserve)">
    {{ phase.getFuelOnBoard().toFixed(0) }}
  </td>
  <td>{{ phase.fuelUsed.toFixed(0) }}</td>
  <td></td>

  <td>{{ phase.getStartingAltitude() }}</td>
  <td>
    <q-input
      filled
      dense
      debounce="500"
      class="q-mr-md"
      label="Altitude"
      style="width: 100px"
      v-model.number="altitude"
      @update:model-value="ChangePhaseAltitude"
      :rules="[
        (val) =>
          val < phase.getStartingAltitude() ||
          'Altitude must be lower than original to descent',
      ]"
    ></q-input>
  </td>
  <td>{{ phase.RelativeHeadwind() }}</td>
  <td>{{ phase.distance }}</td>
  <td>{{ phase.duration }}</td>
  <td>{{ phase.drag.toFixed(2) }}</td>
</template>

<script setup lang="ts">
import { DescentPhase } from 'src/service/flight/DescentPhase';

import { onMounted, ref } from 'vue';
import { IFlightPhase } from '../models';

const altitude = ref(0);

const props = defineProps<{
  phase: IFlightPhase;
  reserve: number;
  check: (a: number, b: number) => string;
}>();

onMounted(() => {
  altitude.value = props.phase.altitude;
});

const ChangePhaseAltitude = () => {
  if (props.phase instanceof DescentPhase) {
    props.phase.ChangeAltitude(altitude.value);
    props.phase.Recalc();
  }
};
</script>
