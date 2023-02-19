<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section>
        <p class="text-h5">Airport information</p>
        <q-list>
          <q-item>
            <q-input
              class="q-mr-md"
              v-model.number="runwayLength"
              label="Runway length (feet)"
            />
            <q-input
              class="q-mr-md"
              v-model.number="Temp"
              label="Runway Temp. °C"
            />
          </q-item>
          <q-item>
            <q-input
              v-model.number:model-value="Qnh.value"
              label="QNH"
              :rules="[(val) => val >= 0]"
            >
              <template v-slot:append
                ><q-btn
                  color="primary"
                  no-caps
                  v-on:click="airport.switchQnhUnit()"
                  >{{ QNH_Unit[Qnh.unit] }}</q-btn
                ></template
              >
            </q-input>
          </q-item>
          <q-item>
            <q-input
              class="q-mr-md"
              v-model.number="AirportElevation"
              label="Airport Altitude (feet)"
              :rules="[(val) => val >= 0]"
            />
            <q-item-section>
              <q-item-label> Pressure Altitude </q-item-label>
              <q-item-label class="text-h6">
                {{ airport.AirportPressureAltitude.toFixed(0) }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-input v-model.number="HeadWind" label="Head wind (kts)" />
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section>
        <p class="text-h5">Fuel management</p>
        <FuelLoader></FuelLoader>
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-list>
        <AircraftWeight></AircraftWeight>
        <q-item>
          <q-item-section>
            <q-item-label
              >PTFS
              <q-icon class="q-ms-md" name="help">
                <q-tooltip>
                  Fan speed should be checked after approximately 1,000 feet on
                  takeoff roll.
                </q-tooltip></q-icon
              ></q-item-label
            >
            <p class="text-h6">
              {{ PTFS(Temp).toFixed(0) }}
            </p>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6"
              >FLAPS {{ aircraft.flaps }}</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Rotate at</q-item-label>
            <p class="text-h6">
              {{ (TakeoffSpeed(aircraft.TotalWeight - 500) - 10).toFixed(0) }}
              KTS
            </p>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-icon name="flight_takeoff"></q-icon>
              Takeoff speed
            </q-item-label>

            <p class="text-h6">
              {{ TakeoffSpeed(aircraft.TakeOffWeight).toFixed(0) }} KTS
            </p>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Takeoff Index (max thrust)</q-item-label>
            <p class="text-h6">
              {{
                TakeoffIndex(Temp, airport.AirportPressureAltitude).toFixed(1)
              }}
            </p>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label
              >Takeoff Weight<q-icon class="q-ms-md" name="help"
                ><q-tooltip>
                  Charts assume 500 lbs is used for taxi + takeoff
                </q-tooltip>
              </q-icon></q-item-label
            >

            <p class="text-h6">
              {{ aircraft.TakeOffWeight.toFixed(0) }}
            </p>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Ground run (feet)</q-item-label>
            <p class="text-h6">
              {{ ground.toFixed(0) }}
            </p>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="q-pa-md bg-grey-10 text-white">
            <q-item-label class="text-center"
              >{{ ground.toFixed(0) }} / {{ airport.runwayLength }} feet
            </q-item-label>
            <q-linear-progress
              dark
              stripe
              rounded
              size="20px"
              :value="percentRun"
              :color="colorPercent"
              class="q-mt-sm"
            >
            </q-linear-progress>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script setup lang="ts">
//Stores
import { useA10CStore } from 'src/stores/a10c';
import { useAirportStore } from 'src/stores/Airport';

// Compononent
import AircraftWeight from './AircraftWeight.vue';
import FuelLoader from './FuelLoader.vue';

import { storeToRefs } from 'pinia';
import { QNH_Unit } from './models';
import { computed } from 'vue';

/// Calculators
import { TakeoffIndexCalculator } from 'src/service/calculators/TakeOffIndex';
import { GroundRun } from 'src/service/calculators/GroundRun';
import { TakeoffSpeed } from 'src/service/calculators/takeOffSpeed';
import { PTFS } from 'src/service/calculators/PTFS';

const aircraft = useA10CStore();
const airport = useAirportStore();

const { Temp, AirportElevation, HeadWind, Qnh, runwayLength } =
  storeToRefs(airport);

const percentRun = computed(
  () =>
    GroundRun(
      TakeoffIndex(airport.Temp, airport.AirportPressureAltitude),
      aircraft.TakeOffWeight,
      airport.HeadWind
    ) / airport.runwayLength
);

const ground = computed(() => {
  let temp = GroundRun(
    TakeoffIndex(airport.Temp, airport.AirportPressureAltitude),
    aircraft.TakeOffWeight,
    airport.HeadWind
  );
  if (typeof temp == 'undefined') temp = 0;
  return temp;
});

const TOICalculator = new TakeoffIndexCalculator();
const TakeoffIndex = (temp: number, pressureAltitude: number) =>
  TOICalculator.Calc(pressureAltitude, temp);

const colorPercent = computed(() => (percentRun.value > 1 ? 'red' : 'green'));
</script>
