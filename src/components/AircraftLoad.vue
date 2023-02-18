<template>
  <div class="q-pa-md row items-start q-gutter-sm">
    <q-list class="row">
      <q-item>
        <q-item-section class="col q-mr-md">
          <q-item-label>Zero Fuel Weight (lbs)</q-item-label>
          <p class="text-h6">{{ aircraft.ZeroFuelWeight.toFixed(0) }}</p>
        </q-item-section>
      </q-item>

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
            v-model="gunAmmoPercent"
            :rules="[(val) => val >= 0 && val <= 100]"
          >
            <template v-slot:append> % </template>
          </q-input>
        </q-item-section>
      </q-item>
    </q-list>
    <q-list class="row">
      <FuelLoader></FuelLoader>
      <AircraftWeight></AircraftWeight>
    </q-list>

    <q-img
      src="src/assets/a10C-emports.jpg"
      style="max-height: 170px; max-width: 605px"
    ></q-img>

    <q-markup-table bordered dense>
      <thead>
        <tr filled color="red">
          <td colspan="4">
            <q-checkbox
              v-model:modelValue="symetrical"
              label="Symetrical Load"
            />
          </td>
          <td colspan="2">
            <q-btn-group>
              <q-btn color="primary" v-on:click="empty()">Empty</q-btn>
              <q-btn color="primary" v-on:click="loadHog()">Hog Std</q-btn>

              <q-btn
                color="primary"
                v-on:click="aircraft.ResetAllPylons()"
                icon="restart_alt"
              ></q-btn>
            </q-btn-group>
          </td>
        </tr>
        <tr align="center">
          <td>#</td>
          <td><q-icon name="lock"></q-icon></td>
          <td>Store</td>
          <td></td>
          <td>Lbs</td>
          <td>Drag</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pylon, index) in pylonsLoad" :key="index">
          <td class="col-2">{{ 11 - index }}</td>
          <td class="col-2">
            <q-checkbox v-model="locks[index]"></q-checkbox>
          </td>
          <td style="col-8">
            <PylonLoader
              :val="pylon.label"
              :pylonNum="index"
              :pylon="pylon"
              :itemSelected="itemSelected"
              :locked="locks[index]"
            ></PylonLoader>
          </td>
          <td>
            <q-btn
              v-on:click="aircraft.ResetPylon(index)"
              icon="restart_alt"
              :disable="locks[index]"
            ></q-btn>
          </td>
          <td>{{ pylon.weight }}</td>
          <td>{{ pylon.drag }}</td>
        </tr>
      </tbody>
    </q-markup-table>
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
