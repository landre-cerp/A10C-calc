<template>
  <q-item>
    <q-item-section class="col q-mr-md">
      <q-item-label>Total (Lbs)</q-item-label>
      <p v-if="!aircraft.OverWeight" class="text-h6">
        {{ aircraft.TotalWeight.toFixed(0) }}
      </p>
      <p v-else class="bg-secondary text-white text-h6">OVER</p>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section class="col q-mr-md">
      <q-item-label>MTOW (lbs)</q-item-label>
      <p class="text-h6">
        {{ aircraft.MaxTakeOffWeight.toFixed(0) }}
      </p>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useA10CStore } from 'src/stores/a10c';

const aircraft = useA10CStore();
</script>
