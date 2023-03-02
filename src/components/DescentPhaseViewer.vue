<template>
  <td class="text-h6">{{ phase.label }}</td>

  <td>{{ phase.getStartingWeight().toFixed(0) }}</td>
  <td>{{ phase.getFuelOnBoard().toFixed(0) }}</td>
  <td>{{ phase.fuelUsed.toFixed(0) }}</td>
  <td></td>

  <td>{{ phase.getStartingAltitude() }}</td>
  <td>
    <q-input
      filled
      debounce="500"
      class="text-h6 q-mr-md"
      label="Altitude"
      v-model.number="altitude"
      @update:model-value="ChangePhaseAltitude"
      :rules="[
        (val) =>
          val < phase.getStartingAltitude() ||
          'Altitude must be lower than original to descent',
      ]"
    ></q-input>
  </td>
  <td>{{ phase.distance }}</td>
  <td>{{ phase.duration }}</td>
  <td>{{ phase.drag.toFixed(2) }}</td>
</template>

<script setup lang="ts">
import { DescentPhase } from 'src/service/DescentPhase';

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
  if (props.phase instanceof DescentPhase) {
    props.phase.ChangeAltidude(altitude.value);
    props.phase.Recalc();
  }
};
</script>
