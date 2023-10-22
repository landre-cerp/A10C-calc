<template>
  <p class="text-center">
    {{ totalWeight.toFixed(0) }} / {{ maxTakeOffWeight }} Lbs
  </p>
  <div class="progress">
    <div
      id="emptyWeight"
      :style="{ width: Math.ceil(percentZeroFW) + '%', color: 'white' }"
      class="progress-bar progress-bar-zfw q-py-md"
    >
      <span>{{ $t('empty_weight') }} {{ emptyWeight }} lbs</span>
    </div>
    <div
      id="weaponsWeight"
      v-if="weaponsWeight > 0"
      :style="{
        width: percentWeapons + '%',
        color: 'black',
        verticalAlign: 'middle',
      }"
      class="progress-bar progress-bar-weapons text-bold q-py-md"
    >
      <span>{{ weaponsWeight }} WP<br /> </span>
    </div>
    <div
      id="fuelWeight"
      v-if="fuelWeight > 0"
      :style="{
        width: Math.ceil(percentFuel) + '%',
        color: 'white',
      }"
      class="progress-bar progress-bar-fuel q-py-md"
    >
      <span>{{ fuelWeight.toFixed(0) }} lbs</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  maxTakeOffWeight: { type: Number, required: true, default: 0 },
  emptyWeight: { type: Number, required: true, default: 0 },
  weaponsWeight: { type: Number, required: true, default: 0 },
  fuelWeight: { type: Number, required: true, default: 0 },
});

const totalWeight = computed(
  () => props.emptyWeight + props.weaponsWeight + props.fuelWeight
);

const percentZeroFW = computed(
  () => (100 * props.emptyWeight) / props.maxTakeOffWeight
);
const percentWeapons = computed(
  () => (100 * props.weaponsWeight) / props.maxTakeOffWeight
);
const percentFuel = computed(
  () => (100 * props.fuelWeight) / props.maxTakeOffWeight
);
</script>

<style scoped>
.progress {
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 50px;
  border-radius: 00px;
  background-color: grey;
}
.progress-bar {
  float: left;
  width: 0%;
  height: 100%;
  line-height: 14px;

  color: black;
  text-align: center;
  background-color: yellow;
}

.progress-bar-zfw {
  background-color: rgb(48, 87, 144);
}
.progress-bar-weapons {
  background-color: rgba(255, 196, 0, 0.986);
}
.progress-bar-fuel {
  background-color: rgb(127, 0, 218);
}
</style>
