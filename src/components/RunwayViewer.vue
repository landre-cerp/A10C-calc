<template>
  <q-item>
    <q-item-section class="q-pa-md bg-grey-10 text-white">
      <q-item-label class="text-center"
        >{{ groundRun.toFixed(0) }} / {{ tora.toFixed(0) }} feet
      </q-item-label>

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
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  groundRun: { type: Number, required: true, default: 0 },
  tora: { type: Number, required: true, default: 0 },
  toda: { type: Number, required: true, default: 0 },
  asda: { type: Number, required: true, default: 0 },
  lda: { type: Number, required: true, default: 0 },
});

const percentRun = computed(() => props.groundRun / props.toda);
const colorPercent = computed(() => {
  return percentRun.value > 1 ? 'red' : 'green';
});
</script>
