<template>
  <div v-if="takeoff">
    <q-item>
      <q-item-section class="q-pa-md bg-grey-10 text-white">
        <q-item-label class="text-center text-h6"
          >TODA {{ toda }} feet
        </q-item-label>
        <q-item-label class="text-left">{{ groundRun }} feet </q-item-label>

        <q-linear-progress
          dark
          stripe
          rounded
          size="20px"
          :value="percentRun"
          :color="colorPercent"
          class="q-mt-sm"
        >
        </q-linear-progress>
        <q-linear-progress
          dark
          stripe
          rounded
          size="10px"
          :value="percentCritical"
          :color="colorCritical"
          class="q-mt-sm"
          style="position: relative; top: -8px"
        >
        </q-linear-progress>
        <q-item-label>{{ critical.toFixed(0) }} feet </q-item-label>
      </q-item-section>
    </q-item>
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

const percentRun = computed(() => props.groundRun / props.toda);
const percentCritical = computed(() => props.critical / props.toda);
const colorPercent = computed(() => {
  return props.groundRun / props.toda > 1 ? 'red' : 'green';
});
const colorCritical = computed(() => {
  return percentCritical.value > 1 ? 'red' : 'orange';
});
</script>
