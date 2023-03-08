<template>
  <div v-if="toda || lda">
    <div class="progress">
      <div
        :style="{ width: Math.ceil(percentRun) + '%', color: 'white' }"
        class="progress-bar q-py-md"
        :class="percentRun <= 100 ? 'groundrun-ok' : 'ko'"
      >
        <span>{{ groundRun.toFixed(0) }}</span>
      </div>
      <div
        v-if="critical"
        :style="{
          width: percentCritical + '%',
          verticalAlign: 'middle',
        }"
        class="progress-bar text-bold q-py-md"
        :class="percentCritical + percentRun <= 100 ? 'critical-ok' : 'ko'"
      >
        <span>Critical</span>
      </div>
      <div class="wind">
        <ShowWind :wind="wind" check-winds />
      </div>
    </div>
  </div>
  <div v-else>
    <div class="progress">
      <div style="width: 100%; color: white" class="progress-bar empty q-py-md">
        <span>Enter runway length</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import ShowWind from './ShowWind.vue';
import { IWind } from 'src/service/Wind';

const props = defineProps({
  groundRun: { type: Number, required: true, default: 0 },
  critical: { type: Number, default: 0 },
  tora: { type: Number, default: 0 },
  toda: { type: Number, default: 0 },
  asda: { type: Number, default: 0 },
  lda: { type: Number, default: 0 },
  takeoff: { type: Boolean, required: true, default: false },
  wind: { type: Object as PropType<IWind>, required: true },
});

const percentRun = computed(
  () => (100 * props.groundRun) / (props.takeoff ? props.toda : props.lda)
);
const percentCritical = computed(() =>
  props.toda ? (100 * (props.critical - props.groundRun)) / props.toda : 0
);
</script>

<style scoped>
.wind {
  display: flex;
  justify-content: center;
  position: relative;

  color: white;
  background-color: black;
}
.progress {
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 60px;
  border-radius: 00px;
  background-color: black;
}
.progress-bar {
  float: left;
  width: 0%;
  height: 70%;
  line-height: 12px;
  font-size: 1.2em;

  color: black;
  text-align: center;
  background-color: yellow;
  border-right: 1px solid black;
}

.groundrun-ok {
  color: white;
  background-color: rgb(15, 147, 0);
}

.critical-ok {
  background-color: rgba(255, 196, 0, 0.986);
}
.ko {
  color: white;
  background-color: rgba(255, 0, 0, 0.986);
}

.empty {
  background-color: grey;
}
</style>
