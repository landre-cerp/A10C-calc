<template>
  <q-item dense>
    <q-item-section>
      <q-input
        dense
        filled
        debounce="500"
        v-model.number="fuelQty"
        :rules="[(val) => val >= 0 && val <= 100]"
        label="Fuel Quantity %"
      >
        <template v-slot:append>
          {{ aircraft.FuelWeight.toFixed(0) }} Lbs
        </template>
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
