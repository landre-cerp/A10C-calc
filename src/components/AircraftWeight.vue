<template>
  <q-item>
    <q-item-section class="col q-mr-md">
      <q-item-section class="q-pa-md bg-grey-10 text-white">
        <q-item-label class="text-center">Aircraft Weight</q-item-label>
        <q-item-label class="text-center"
          >{{ totalWeight.toFixed(0) }} / {{ maxTakeOffWeight.toFixed(0) }} lbs
        </q-item-label>
        <q-item-label class="text-center text-h6"
          >{{ (percentLoad * 100).toFixed(2) }} %
        </q-item-label>
        <q-linear-progress
          dark
          stripe
          rounded
          size="20px"
          :value="percentLoad"
          :color="colorPercent"
          class="q-mt-sm"
        >
        </q-linear-progress>
      </q-item-section>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  totalWeight: { type: Number, required: true, default: 0 },
  maxTakeOffWeight: { type: Number, required: true, default: 0 },
});

const percentLoad = computed(() => props.totalWeight / props.maxTakeOffWeight);

const colorPercent = computed(() => (percentLoad.value > 1 ? 'red' : 'green'));
</script>
