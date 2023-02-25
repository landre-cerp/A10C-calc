<template>
  <div class="col items-start q-gutter-sm">
    <q-card>
      <q-item>
        <q-item-section class="col q-mr-md">
          <q-item-label>Drag</q-item-label>
          <p class="text-h6">{{ aircraft.Drag.toFixed(2) }}</p>
        </q-item-section>
        <q-item-section class="col q-mr-md">
          <q-item-label>Weapons (lbs)</q-item-label>
          <p class="text-h6">{{ aircraft.WeaponWeight.toFixed(0) }}</p>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section
          ><q-item-label>Gun (lbs)</q-item-label>
          <p class="text-h6">
            {{ aircraft.AmmoWeight.toFixed(0) }}
          </p></q-item-section
        >
        <q-item-section>
          <q-input
            filled
            debounce="500"
            v-model.number="gunAmmoPercent"
            :rules="[(val) => val >= 0 && val <= 100]"
          >
            <template v-slot:append> % </template>
          </q-input>
        </q-item-section>
      </q-item>

      <FuelLoader></FuelLoader>

      <q-item-section class="q-pa-md">
        <AircraftWeight
          :total-weight="aircraft.TotalWeight"
          :max-take-off-weight="aircraft.MaxTakeOffWeight"
          :zero-fuel-weight="aircraft.ZeroFuelWeight"
          :weapons-weight="aircraft.WeaponWeight + aircraft.AmmoWeight"
          :fuel-weight="aircraft.FuelWeight"
        >
        </AircraftWeight>
      </q-item-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-center">
          <q-img
            src="~assets/a10C-emports.jpg"
            style="max-height: 170px; max-width: 605px"
          ></q-img>
        </div>
      </q-card-section>

      <q-btn-group spread>
        <q-btn color="primary"
          ><q-checkbox dark v-model:modelValue="symetrical" label="Sym. Load"
        /></q-btn>
        <q-btn color="primary" v-on:click="empty()">Empty</q-btn>
        <q-btn color="primary" v-on:click="loadHog()">Hog Std</q-btn>
      </q-btn-group>
      <q-list dense>
        <q-item
          v-for="(pylon, index) in pylonsLoad"
          :key="index"
          class="col-12"
          color="secondary"
        >
          <q-checkbox v-model="locks[index]">{{ 11 - index }} </q-checkbox>

          <PylonLoader
            style="width: 100%"
            :pylonNum="index"
            :pylon="pylon"
            :itemSelected="itemSelected"
            :locked="locks[index]"
          ></PylonLoader>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import PylonLoader from './PylonLoader.vue';
import { useA10CStore } from 'src/stores/a10c';
import { IAircraftStore } from './models';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import AircraftWeight from './AircraftWeight.vue';
import FuelLoader from './FuelLoader.vue';

const aircraft = useA10CStore();

const defaultLocks = [
  true,
  true,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  true,
];

const symetrical = ref(false);
const { gunAmmoPercent, pylonsLoad } = storeToRefs(aircraft);
let locks = ref([...defaultLocks]);

function itemSelected(pylon: number, value: IAircraftStore) {
  aircraft.setPylon(pylon, { ...value });
  if (symetrical.value) {
    let symPylon = 0;
    if (pylon < 5) {
      symPylon = 5 + Math.abs(pylon - 5);
      aircraft.setPylon(symPylon, { ...value });
    } else {
      symPylon = 5 - Math.abs(pylon - 5);
    }
    if (!locks.value[symPylon]) {
      aircraft.setPylon(symPylon, { ...value });
    }
  }
}

function empty() {
  aircraft.EmptyAllPylons();
  for (let index = 0; index < locks.value.length; index++) {
    locks.value[index] = false;
  }
}

function loadHog() {
  aircraft.loadHogDefault();
  for (let index = 0; index < locks.value.length; index++) {
    locks.value[index] = defaultLocks[index];
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
