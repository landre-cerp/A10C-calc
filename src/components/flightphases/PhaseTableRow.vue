<template>
  <tr>
    <td class="text-no-wrap">
      <q-btn
        v-if="hasAdvice"
        flat
        dense
        round
        size="xs"
        icon="info"
        color="primary"
        class="q-mr-xs"
        @click="expanded = !expanded"
      />
      <strong>{{ $t('flight_phase.' + PhaseType[phase.type]) }}</strong>
      <q-btn
        v-if="phase.isLastPhase()"
        dense flat round
        color="negative"
        icon="delete"
        size="xs"
        class="q-ml-xs"
        @click="emit('remove')"
      />
    </td>

    <td class="text-right">{{ phase.getStartingWeight().toFixed(0) }}</td>

    <!-- EFOB — refuel input for REFUEL phase -->
    <td
      class="text-right"
      :class="phase.getFuelOnBoard() < reserve ? 'text-negative' : ''"
    >
      <q-input
        v-if="phase.type === PhaseType.REFUEL"
        dense
        filled
        debounce="500"
        style="width: 90px"
        :label="$t('flight_phase.quantity_refuelled')"
        v-model.number="fuelOnBoard"
        :rules="[(val) => val > 0 || 'You must refuel']"
        @update:model-value="onRefuel"
      />
      <span v-else>{{ phase.getFuelOnBoard().toFixed(0) }}</span>
    </td>

    <td class="text-right">{{ phase.fuelUsed.toFixed(0) }}</td>
    <td class="text-right">{{ phase.getStartingAltitude() }}</td>

    <!-- Fuel Flow — editable for HI_COMBAT -->
    <td class="text-right">
      <q-input
        v-if="phase.type === PhaseType.HI_COMBAT"
        dense
        filled
        debounce="500"
        style="width: 90px"
        :label="$t('flight_phase.fuel_flow')"
        v-model.number="fuelFlow"
        @update:model-value="onFuelFlow"
      />
      <span v-else>{{ phase.fuelFlow.toFixed(0) }}</span>
    </td>

    <!-- Altitude — editable for CLIMB / DESCENT -->
    <td class="text-right">
      <q-input
        v-if="
          phase.type === PhaseType.CLIMB || phase.type === PhaseType.DESCENT
        "
        dense
        filled
        debounce="500"
        style="width: 80px"
        :label="$t('flight_phase.altitude')"
        v-model.number="altitude"
        :rules="[checkAltitude]"
        @update:model-value="onAltitude"
      />
      <span v-else>{{ phase.altitude }}</span>
    </td>

    <!-- Distance — editable for CRUISE -->
    <td class="text-right">
      <q-input
        v-if="phase.type === PhaseType.CRUISE"
        dense
        filled
        debounce="500"
        style="width: 80px"
        :label="$t('flight_phase.distance')"
        v-model.number="distance"
        :rules="[(val) => val > 0 || $t('flight_phase.greater_than_zero')]"
        @update:model-value="onDistance"
      />
      <span v-else>{{ phase.distance }}</span>
    </td>

    <!-- Duration — editable for HI_COMBAT -->
    <td class="text-right">
      <q-input
        v-if="phase.type === PhaseType.HI_COMBAT"
        dense
        filled
        debounce="500"
        style="width: 80px"
        :label="$t('flight_phase.duration_minutes')"
        v-model.number="phaseDuration"
        :rules="[(val) => val > 0 || $t('flight_phase.greater_than_zero')]"
        @update:model-value="onDuration"
      />
      <span v-else>{{ phase.duration.toFixed(1) }}</span>
    </td>

    <td class="text-right gt-xs">{{ phase.drag.toFixed(2) }}</td>

    <!-- Actions: wind dropdown only -->
    <td class="text-center">
      <q-btn-dropdown
        v-if="phase.type !== PhaseType.TAKEOFF"
        dense flat round
        icon="fas fa-wind"
        size="xs"
        color="grey-7"
      >
        <div class="q-pa-md">
          <CourseAndWind :phase="phase" />
        </div>
      </q-btn-dropdown>
    </td>
  </tr>

  <!-- Collapsible advice row -->
  <tr v-if="expanded">
    <td colspan="11" class="bg-blue-grey-1 q-pa-sm">
      <OptimumPhaseParams :phase="phase" />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { IFlightPhase, PhaseType } from '../models';
import { useI18n } from 'vue-i18n';
import CourseAndWind from './CourseAndWind.vue';
import OptimumPhaseParams from './OptimumPhaseParams.vue';

const { t } = useI18n();

const props = defineProps<{
  phase: IFlightPhase;
  reserve: number;
}>();

const emit = defineEmits<{ remove: [] }>();

const expanded = ref(false);
const altitude = ref(0);
const distance = ref(0);
const phaseDuration = ref(0);
const fuelFlow = ref(0);
const fuelOnBoard = ref(0);

onMounted(() => {
  altitude.value = props.phase.altitude;
  distance.value = props.phase.distance;
  phaseDuration.value = props.phase.duration;
  fuelFlow.value = props.phase.fuelFlow;
});

const hasAdvice = computed(() =>
  [
    PhaseType.CLIMB,
    PhaseType.CRUISE,
    PhaseType.HI_COMBAT,
    PhaseType.DESCENT,
  ].includes(props.phase.type),
);

const checkAltitude = (val: number) => {
  if (props.phase.type === PhaseType.DESCENT)
    return (
      val < props.phase.getStartingAltitude() ||
      t('flight_phase.alt_must_be_lower')
    );
  return (
    val > props.phase.getStartingAltitude() ||
    t('flight_phase.alt_must_be_higher')
  );
};

const onAltitude = () => {
  props.phase.ChangeAltitude(altitude.value);
  props.phase.Recalc();
};
const onDistance = () => {
  props.phase.ChangeDistance(distance.value);
  props.phase.Recalc();
};
const onDuration = () => {
  props.phase.ChangePhaseDuration(phaseDuration.value);
  props.phase.Recalc();
};
const onFuelFlow = () => {
  props.phase.ChangeFuelFlow(fuelFlow.value);
  props.phase.Recalc();
};
const onRefuel = () => {
  props.phase.Refuel(fuelOnBoard.value);
  props.phase.Recalc();
};
</script>
