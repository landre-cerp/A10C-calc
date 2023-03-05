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
      debounce="500"
      dense
      class="q-mr-md"
      style="width: 80px"
      label="Altitude"
      v-model.number="altitude"
      @update:model-value="ChangePhaseAltitude"
      :rules="[
        (val) =>
          val > phase.getStartingAltitude() ||
          'Altitude must be greater than original to climb',
      ]"
    ></q-input>
  </td>

  <td>{{ phase.RelativeHeadwind() }}</td>
  <td>{{ phase.distance }}</td>
  <td>{{ phase.duration }}</td>
  <td>{{ phase.drag.toFixed(2) }}</td>
</template>

<script setup lang="ts">
import { ClimbPhase } from 'src/service/flight/ClimbPhase';

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
  if (props.phase instanceof ClimbPhase) {
    props.phase.ChangeAltitude(altitude.value);
    props.phase.Recalc();
  }
};
</script>
