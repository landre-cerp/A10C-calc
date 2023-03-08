<template>
  <q-item-label v-if="phase.type == PhaseType.CRUISE">
    Mach {{ phase.machSpeed.toFixed(2) }} / {{ phase.trueAirSpeed }} TAS /
    {{ GroundSpeed }} GS
  </q-item-label>
  <q-item-label v-else-if="phase.type == PhaseType.CLIMB">
    Speeds(x1000ft : IAS) : [ SL: 200 - 5: 195 - 10: 190 - 15: 185 - 20: 180 ]
  </q-item-label>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IFlightPhase, PhaseType } from '../models';

const props = defineProps<{
  phase: IFlightPhase;
}>();

const GroundSpeed = computed(() => {
  return props.phase.trueAirSpeed - props.phase.RelativeHeadwind();
});
</script>
