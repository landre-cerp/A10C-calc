<template>
  <q-list class="row">
    <ShowItem
      :label="$t('flight_phase.starting_weight')"
      :value="phase.getStartingWeight().toFixed(0)"
      unit="lbs"
    />

    <q-input
      v-if="editFOB"
      filled
      dense
      debounce="500"
      class="q-mr-md"
      :label="$t('flight_phase.quantity_refuelled')"
      v-model.number="fuelOnBoard"
      @update:model-value="Refuel"
      :rules="[(val) => val > 0 || 'You must refuel']"
    ></q-input>

    <ShowItem
      v-else
      :style="check(phase.getFuelOnBoard(), reserve)"
      :label="$t('flight_phase.efob')"
      :value="phase.getFuelOnBoard().toFixed(0)"
      unit="lbs"
    />
    <ShowItem
      :label="$t('flight_phase.fuel_used')"
      :value="phase.fuelUsed.toFixed(0)"
      unit="lbs"
    />
    <ShowItem
      :label="$t('flight_phase.starting_altitude')"
      :value="phase.getStartingAltitude()"
      unit=""
    />

    <q-input
      v-if="editFuelFlow"
      filled
      dense
      debounce="500"
      class="q-mr-md"
      :label="$t('flight_phase.fuel_flow')"
      v-model.number="fuelFlow"
      @update:model-value="ChangeFuelFlow"
    ></q-input>
    <ShowItem
      v-else
      :label="$t('flight_phase.fuel_flow')"
      :value="phase.fuelFlow.toFixed(0)"
      unit="lbs/h"
    />

    <q-input
      v-if="editAltitude"
      filled
      debounce="500"
      dense
      class="q-mr-md"
      style="width: 120px"
      :label="$t('flight_phase.altitude')"
      v-model.number="altitude"
      @update:model-value="ChangePhaseAltitude"
      :rules="[(val) => CheckAltitude(val)]"
    ></q-input>

    <ShowItem v-else label="Altitude" :value="phase.altitude" unit="" />

    <q-input
      v-if="editDistance"
      filled
      debounce="500"
      dense
      style="width: 120px"
      class="q-mr-md"
      :label="$t('flight_phase.distance')"
      v-model.number="distance"
      @update:model-value="ChangePhaseDistance"
      :rules="[
        (val) =>
          (val > 0 && phase.fuelUsed <= phase.getFuelOnBoard() - reserve) ||
          $t('flight_phase.greater_than_zero'),
      ]"
    >
    </q-input>
    <ShowItem v-else label="Distance" :value="phase.distance" unit="NM" />

    <q-input
      v-if="editDuration"
      filled
      debounce="500"
      dense
      style="width: 140px"
      class="q-mr-md"
      :label="$t('flight_phase.duration_minutes')"
      v-model.number="phaseDuration"
      @update:model-value="ChangePhaseDuration"
      :rules="[
        (val) =>
          (val > 0 && phase.fuelUsed <= phase.getFuelOnBoard() - reserve) ||
          $t('flight_phase.greater_than_zero'),
      ]"
    ></q-input>
    <ShowItem
      v-else
      :label="$t('flight_phase.duration')"
      :value="phase.duration.toFixed(1)"
      unit="min"
    />
    <ShowItem
      :label="$t('flight_phase.drag')"
      :value="phase.drag.toFixed(2)"
      unit=""
    />
  </q-list>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IFlightPhase, PhaseType } from '../models';
import ShowItem from './ShowItem.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const fuelFlow = ref(0);
const fuelOnBoard = ref(0);
const altitude = ref(0);
const distance = ref(0);
const phaseDuration = ref(0);

const props = defineProps<{
  phase: IFlightPhase;
  reserve: number;

  editFuelFlow?: boolean;
  editFOB?: boolean;
  editAltitude?: boolean;
  editDistance?: boolean;
  editDuration?: boolean;
}>();

onMounted(() => {
  fuelFlow.value = props.phase.fuelFlow;
  fuelOnBoard.value = 0;
  altitude.value = props.phase.altitude;
  distance.value = props.phase.distance;
});

const Refuel = () => {
  props.phase.Refuel(fuelOnBoard.value);
  props.phase.Recalc();
};

const CheckAltitude = (val: number) => {
  if (props.phase.type == PhaseType.DESCENT) {
    return (
      val < props.phase.getStartingAltitude() ||
      t('flight_phase.alt_must_be_lower')
    );
  } else {
    return (
      val > props.phase.getStartingAltitude() ||
      t('flight_phase.alt_must_be_higher')
    );
  }
};

const ChangeFuelFlow = () => {
  props.phase.ChangeFuelFlow(fuelFlow.value);
  props.phase.Recalc();
};
const ChangePhaseDuration = () => {
  props.phase.ChangePhaseDuration(phaseDuration.value);
  props.phase.Recalc();
};

const ChangePhaseAltitude = () => {
  props.phase.ChangeAltitude(altitude.value);
  props.phase.Recalc();
};

const ChangePhaseDistance = () => {
  props.phase.ChangeDistance(distance.value);
  props.phase.Recalc();
};

const check = (fob: number, reserve: number): string => {
  if (fob < reserve) {
    return 'color: negative';
  }
  return 'color: black';
};
</script>
