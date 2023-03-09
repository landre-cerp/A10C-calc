<template>
  <q-item-label v-if="phase.type == PhaseType.CRUISE">
    Mach {{ phase.machSpeed.toFixed(2) }} / {{ phase.trueAirSpeed }} TAS /
    {{ GroundSpeed }} GS
  </q-item-label>
  <q-item-label v-else-if="phase.type == PhaseType.CLIMB">
    Speeds(x1000ft : IAS) : [ SL: 200 - 5: 195 - 10: 190 - 15: 185 - 20: 180 ]
  </q-item-label>
  <q-item-label v-if="phase.type == PhaseType.COMBAT">
    Combat FF at 250 KIAS, {{ phase.altitude }} and {{ airport.DeltaTemp }} °C
    STD Day dev is
    {{ combatFuelFlow(250, phase.altitude, airport.DeltaTemp).toFixed(0) }}
  </q-item-label>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IFlightPhase, PhaseType } from '../models';
import { combatFuelFlow } from '../../service/calculators/combat/CombatFuelFlow';
import { useTakeOffStore } from 'src/stores/Airport';

const airport = useTakeOffStore();

const props = defineProps<{
  phase: IFlightPhase;
}>();

const GroundSpeed = computed(() => {
  return props.phase.trueAirSpeed - props.phase.RelativeHeadwind();
});
</script>
