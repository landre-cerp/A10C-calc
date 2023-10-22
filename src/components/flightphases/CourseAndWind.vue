<template>
  <q-input
    :label="$t('flight_phase.wind_direction')"
    v-model="windDirection"
    @update:model-value="ChangeWind"
    :rules="[(val) => (val >= 0 && val <= 360) || $t('wind_direction_0_360')]"
  ></q-input>
  <q-input
    :label="$t('flight_phase.wind_speed')"
    v-model="windSpeed"
    @update:model-value="ChangeWind"
  ></q-input>
  <q-input
    :label="$t('flight_phase.leg_course')"
    v-model="course"
    @update:model-value="ChangeCourse"
    :rules="[
      (val) => (val >= 0 && val <= 360) || $t('flight_phase.course_valid'),
    ]"
  ></q-input>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IFlightPhase } from '../models';

const props = defineProps<{
  phase: IFlightPhase;
}>();

const windDirection = ref(props.phase.wind.direction);
const windSpeed = ref(props.phase.wind.speed);
const course = ref(props.phase.course);

const ChangeCourse = () => {
  props.phase.ChangeCourse(course.value);
  props.phase.Recalc();
};

const ChangeWind = () => {
  props.phase.ChangeWind(windDirection.value, windSpeed.value);
  props.phase.Recalc();
};
</script>
