<template>
  <q-item>
    <q-item-section class="col q-mr-md">
      <q-item-section class="q-pa-md bg-grey-10 text-white">
        <q-item-label class="text-center"
          >{{ aircraft.TotalWeight.toFixed(0) }} /
          {{ aircraft.MaxTakeOffWeight.toFixed(0) }} lbs
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
import { useA10CStore } from 'src/stores/a10c';
import { computed } from 'vue';

const aircraft = useA10CStore();

const percentLoad = computed(
  () => aircraft.TotalWeight / aircraft.MaxTakeOffWeight
);

const colorPercent = computed(() => (percentLoad.value > 1 ? 'red' : 'green'));
</script>
