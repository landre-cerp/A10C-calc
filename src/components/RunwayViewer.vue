<template>
  <div v-if="toda > 0">
    <div class="progress">
      <div
        :style="{ width: Math.ceil(percentRun) + '%', color: 'white' }"
        class="progress-bar progress-bar-zfw q-py-md"
      >
        <span>Run</span>
      </div>
      <div
        :style="{
          width: percentCritical + '%',
          color: 'black',
          verticalAlign: 'middle',
        }"
        class="progress-bar progress-bar-weapons text-bold q-py-md"
      >
        <span>Critical</span>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="progress">
      <div
        style="width: 100%; color: white"
        class="progress-bar progress-bar-empty q-py-md"
      >
        <span>enter runway length</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  groundRun: { type: Number, required: true, default: 0 },
  critical: { type: Number, required: true, default: 0 },
  tora: { type: Number, required: true, default: 0 },
  toda: { type: Number, required: true, default: 0 },
  asda: { type: Number, required: true, default: 0 },
  lda: { type: Number, required: true, default: 0 },
  takeoff: { type: Boolean, required: true, default: false },
});

const percentRun = computed(() => (100 * props.groundRun) / props.toda);
const percentCritical = computed(
  () => (100 * (props.critical - props.groundRun)) / props.toda
);
</script>

<style scoped>
.progress {
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 50px;
  border-radius: 10px;
  background-color: grey;
}
.progress-bar {
  float: left;
  width: 0%;
  height: 100%;
  line-height: 20px;

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

.progress-bar-empty {
  background-color: grey;
}
</style>
