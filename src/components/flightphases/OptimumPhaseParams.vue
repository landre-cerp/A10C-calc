<template>
  <q-item-label v-if="phase.type == PhaseType.CRUISE">
    Mach {{ phase.machSpeed.toFixed(2) }} / {{ phase.trueAirSpeed }} TAS /
    {{ GroundSpeed }} GS
  </q-item-label>
  <q-item-label v-else-if="phase.type == PhaseType.CLIMB">
    {{ $t('flight_phase.optimum.climb_speed') }}
  </q-item-label>
  <q-item-label v-if="phase.type == PhaseType.HI_COMBAT">
    {{ $t('flight_phase.optimum.combat_ff') }}, {{ phase.altitude }}
    {{ $t('and') }} {{ airport.DeltaTemp }}
    {{ $t('flight_phase.std_day_temp_dev') }}
    {{ combatFuelFlow(250, phase.altitude, airport.DeltaTemp).toFixed(0) }}
  </q-item-label>
  <q-item-label v-if="phase.type == PhaseType.DESCENT">
    {{
      $t('flight_phase.optimum.speed_max_range', {
        speed: SpeedForMaxRangeDescent(
          phase.getStartingWeight(),
          phase.drag,
        ).toFixed(0),
      })
    }}
    <br />

    {{ $t('flight_phase.optimum.speed_max_range_help') }}
  </q-item-label>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IFlightPhase, PhaseType } from '../models';
import { combatFuelFlow } from 'a10c-perf-calculator';
import { SpeedForMaxRangeDescent } from 'a10c-perf-calculator';
import { useTakeOffStore } from 'src/stores/Airport';

const airport = useTakeOffStore();

const props = defineProps<{
  phase: IFlightPhase;
}>();

const GroundSpeed = computed(() => {
  return props.phase.trueAirSpeed - props.phase.RelativeHeadwind();
});
</script>
