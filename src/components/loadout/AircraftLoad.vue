<template>
  <q-card>
    <q-card-section class="row q-pb-none">
      <q-item class="col-4-md">
        <q-item-section class="col q-mr-md">
          <q-item-label>Drag</q-item-label>
          <p class="">{{ aircraft.Drag.toFixed(2) }}</p>
        </q-item-section>
      </q-item>
      <q-item class="col-6-md">
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
      <q-item>
        <q-item-section>
          <FuelLoader></FuelLoader>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-item-section class="q-pa-none">
      <AircraftWeight
        :max-take-off-weight="aircraft.MaxTakeOffWeight"
        :empty-weight="aircraft.EmptyWeight"
        :weapons-weight="aircraft.WeaponWeight + aircraft.AmmoWeight"
        :fuel-weight="aircraft.FuelWeight"
      >
      </AircraftWeight>
    </q-item-section>
  </q-card>

  <q-card>
    <div class="row q-mx-lg q-pa-sm" style="justify-content: end">
      <q-checkbox
        class="q-mr-md"
        v-model:modelValue="symetrical"
        label="Sym. Load"
      />
      <q-input label="config Name" v-model="configName" filled dense />
      <q-btn-dropdown dense outline label="Config.">
        <q-list v-for="(config, index) in AvailableConfigurations" :key="index">
          <q-item clickable v-close-popup @click="loadAndLocks(config)">
            <q-item-section>
              <q-item-label>{{ config.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn
        dense
        class="q-ml-md"
        outline
        icon="fa-light fa-save"
        @click="saveConfig"
      ></q-btn>
      <q-btn
        dense
        class="q-ml-md"
        color="red"
        outline
        icon="fa-light fa-trash-can"
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
            :pylon="pylon"
            :available-stores="getAvailableStores(11 - index)"
            :empty="emptyLoad"
            @item-selected="itemSelected(index, $event)"
            @item-cleared="itemSelected(index, emptyLoad)"
            :locked="locks[index]"
          ></PylonLoader>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import PylonLoader from '../PylonLoader.vue';
import { useA10CStore } from 'src/stores/a10c';
import { IAircraftStore, StoresConfiguration } from '../models';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import AircraftWeight from '../AircraftWeight.vue';
import FuelLoader from '../FuelLoader.vue';
import { aircraftStores, emptyLoad } from 'src/data/A10C';

const aircraft = useA10CStore();

const symetrical = ref(false);
const { gunAmmoPercent, configuration, AvailableConfigurations } =
  storeToRefs(aircraft);
let locks = initLocks();

const configName = ref(aircraft.configuration.name);

function itemSelected(pylon: number, value: IAircraftStore) {
  aircraft.setPylon(pylon, { ...value });

  if (symetrical.value) {
    let symPylon = 0;
    if (pylon < 5) {
      symPylon = 5 + Math.abs(pylon - 5);
    } else {
      symPylon = 5 - Math.abs(pylon - 5);
    }
    if (!locks.value[symPylon]) {
      aircraft.setPylon(symPylon, { ...value });
    }
  }
}

function getAvailableStores(pylon: number) {
  const stores = aircraftStores.filter((store) => {
    return store.availableOn?.includes(pylon);
  });
  return stores;
}

function initLocks() {
  const locks = ref<boolean[]>([]);
  for (let index = 0; index < 11; index++) {
    locks.value.push(aircraft.configuration.pylonsLoad[index].short != '');
  }
  return locks;
}

function loadAndLocks(config: StoresConfiguration) {
  aircraft.loadConfiguration(config);
  configName.value = config.name;
  locks = initLocks();
}

function saveConfig() {
  aircraft.SaveConfiguration(configName.value);
}

function deleteConfig() {
  aircraft.DeleteConfiguration(configName.value);
}
</script>
