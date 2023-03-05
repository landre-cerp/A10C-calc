<template>
  <q-item class="q-mr-sm">
    <q-icon name="fa-light fa-wind" />
  </q-item>
  <q-item class="q-mr-sm" :style="checValidHead">
    <q-icon class="q-mr-sm" v-if="headWind" name="fa-light fa-left"></q-icon>
    <q-icon class="q-mr-sm" v-if="tailWind" name="fa-light fa-right"></q-icon>
    {{ longiSpeed }} KTS
  </q-item>

  <q-item v-if="crossSpeed > 0" :style="checkValidCross">
    <q-icon
      class="q-mr-sm"
      v-if="crossWindLeft"
      name="fa-light fa-down"
    ></q-icon>
    <q-icon
      class="q-mr-sm"
      v-if="crossWindRight"
      name="fa-light fa-up"
    ></q-icon>
    {{ crossSpeed }} KTS
  </q-item>
</template>

<script setup lang="ts">
import { IWind, WindDirections } from 'src/service/Wind';
import { computed } from 'vue';

const okColor = 'color: white';
const koColor = 'color: red';

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

const checValidHead = computed(() => {
  if (headWind.value) {
    return longiSpeed.value > 40 ? koColor : okColor;
  }
  if (tailWind.value) {
    return longiSpeed.value > 20 ? koColor : okColor;
  }
  return okColor;
});
const checkValidCross = computed(() => {
  if (crossWindLeft.value || crossWindRight.value) {
    return crossSpeed.value > 35 ? koColor : okColor;
  }
  return okColor;
});
</script>
