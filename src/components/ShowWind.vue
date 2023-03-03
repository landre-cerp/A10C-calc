<template>
  <q-item class="q-mr-sm">
    <q-icon class="q-mr-sm" v-if="headWind" name="south"></q-icon>
    <q-icon class="q-mr-sm" v-if="tailWind" name="north"></q-icon>
    {{ longiSpeed }} KTS
  </q-item>

  <q-item>
    <q-icon class="q-mr-sm" v-if="crossWindLeft" name="east"></q-icon>
    <q-icon class="q-mr-sm" v-if="crossWindRight" name="west"></q-icon>
    {{ crossSpeed }} KTS
  </q-item>
</template>

<script setup lang="ts">
import { IWind, WindDirections } from 'src/service/Wind';
import { computed } from 'vue';

const props = defineProps<{
  wind: IWind;
}>();

const headWind = computed(() => {
  return props.wind.longitudinalDirection == WindDirections.Head;
});
const tailWind = computed(() => {
  return props.wind.longitudinalDirection == WindDirections.Tail;
});
const crossWindLeft = computed(() => {
  return props.wind.lateralDirection == WindDirections.CrossLeft;
});
const crossWindRight = computed(() => {
  return props.wind.lateralDirection == WindDirections.CrossRight;
});

const longiSpeed = computed(() => {
  return props.wind.front;
});

const crossSpeed = computed(() => {
  return props.wind.cross;
});
</script>
