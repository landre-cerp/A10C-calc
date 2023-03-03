<template>
  <q-input
    label="wind direction"
    v-model="windDirection"
    @update:model-value="ChangeWind"
  ></q-input>
  <q-input
    label="wind speed"
    v-model="windSpeed"
    @update:model-value="ChangeWind"
  ></q-input>
  <q-input
    label="Leg course"
    v-model="course"
    @update:model-value="ChangeCourse"
  ></q-input>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IFlightPhase } from './models';

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
