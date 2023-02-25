<template>
  <q-item dense>
    <q-item-section
      ><q-item-label>Fuel</q-item-label>
      <p class="text-h6">
        {{ aircraft.FuelWeight.toFixed(0) }} Lbs
      </p></q-item-section
    >
    <q-item-section>
      <q-input
        class="text-h6"
        filled
        debounce="500"
        v-model.number="fuelQty"
        :rules="[(val) => val >= 0 && val <= 100]"
      >
        <template v-slot:append> % </template>
      </q-input>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useA10CStore } from 'src/stores/a10c';
const aircraft = useA10CStore();
const { fuelQty } = storeToRefs(aircraft);
</script>
