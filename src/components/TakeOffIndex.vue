<template>
  <div class="q-pa-md">
    <div class="text-h6 row">
      <div class="col-4">Drag {{ aircraft.Drag.toFixed(2) }}</div>
      <div class="col-8 text-right">{{ aircraft.Weight.toFixed(2) }} LBS</div>
    </div>
  </div>

  <div class="row">
    <q-checkbox
      class="col-6"
      v-model:modelValue="symetrical"
      label="Chargement Symétrique"
    />
    <q-btn class="col-6 text-right" color="primary" @click="Reset">Reset</q-btn>
  </div>

  <q-markup-table flat bordered>
    <tbody>
      <tr v-for="(pylon, index) in pylonsLoad" :key="index">
        <td class="col-2">{{ 11 - index }}</td>
        <td style="col-10">
          <PylonLoader
            :val="pylon.label"
            :pylonNum="index"
            :pylon="pylon"
            :itemSelected="itemSelected"
          ></PylonLoader>
        </td>
        <td>{{ pylon.weight }}</td>
        <td>{{ pylon.drag }}</td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script setup lang="ts">
import PylonLoader from './PylonLoader.vue';
import { useA10CStore } from 'src/stores/a10c';
import { IAircraftStore } from './models';
import { QCheckbox, QMarkupTable } from 'quasar';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const aircraft = useA10CStore();

const symetrical = ref(false);
const { pylonsLoad } = storeToRefs(aircraft);

function itemSelected(pylon: number, value: IAircraftStore) {
  aircraft.setPylon(pylon, { ...value });
  if (symetrical.value)
    if (pylon < 5) {
      aircraft.setPylon(5 + Math.abs(pylon - 5), { ...value });
    } else {
      aircraft.setPylon(5 - Math.abs(pylon - 5), { ...value });
    }
}

function Reset() {
  aircraft.ResetPylons();
}
</script>
