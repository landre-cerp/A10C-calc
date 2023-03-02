<template>
  <q-card>
    <q-card-section class="row">
      <q-item class="col-4-md">
        <q-item-section class="col q-mr-md">
          <q-item-label>Drag</q-item-label>
          <p class="">{{ aircraft.Drag.toFixed(2) }}</p>
        </q-item-section> </q-item
      ><q-item class="col-6-md">
        <q-item-section class="col q-mr-md">
          <q-item-label>Weapons (lbs)</q-item-label>
          <p class="">{{ aircraft.WeaponWeight.toFixed(0) }}</p>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-input
            filled
            dense
            label="Gun Ammo %"
            debounce="500"
            v-model.number="gunAmmoPercent"
            :rules="[(val) => val >= 0 && val <= 100]"
          >
            <template v-slot:append>
              {{ aircraft.AmmoWeight.toFixed(0) }} lbs
            </template>
          </q-input>
        </q-item-section>
      </q-item>

      <FuelLoader></FuelLoader>
    </q-card-section>
    <q-card-section class="row">
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
    </q-card-section>
  </q-card>

  <q-card>
    <div class="row q-mx-lg q-pa-sm" style="justify-content: end">
      <q-checkbox
        class="q-mr-md"
        v-model:modelValue="symetrical"
        label="Sym. Load"
      />
      <q-input label="config Name" v-model="configName" filled dense />
      <q-btn-dropdown color="primary" label="Load Config.">
        <q-list v-for="(config, index) in AvailableConfigurations" :key="index">
          <q-item clickable v-close-popup @click="loadAndLocks(config)">
            <q-item-section>
              <q-item-label>{{ config.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn
        class="q-ml-md"
        color="primary"
        icon="save"
        @click="saveConfig"
      ></q-btn>
      <q-btn
        class="q-ml-md"
        color="red"
        icon="delete"
        @click="deleteConfig"
      ></q-btn>
    </div>

    <q-card-section>
      <q-list dense>
        <q-item
          v-for="(pylon, index) in configuration.pylonsLoad"
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
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import PylonLoader from './PylonLoader.vue';
import { useA10CStore } from 'src/stores/a10c';
import { IAircraftStore, StoresConfiguration } from './models';
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
const { gunAmmoPercent, configuration, AvailableConfigurations } =
  storeToRefs(aircraft);
let locks = ref([...defaultLocks]);
const configName = ref('');

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

function loadAndLocks(config: StoresConfiguration) {
  aircraft.loadConfiguration(config);
  configName.value = config.name;
  for (let index = 0; index < locks.value.length; index++) {
    locks.value[index] = config.pylonsLoad[index].short != '';
  }
}

function saveConfig() {
  aircraft.SaveConfiguration(configName.value);
}

function deleteConfig() {
  aircraft.DeleteConfiguration(configName.value);
}
</script>
