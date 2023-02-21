<template>
  <div class="q-pa-md col items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section>
        <p class="text-h5">Airport information</p>
        <q-list>
          <q-item>
            <q-input
              filled
              debounce="500"
              class="q-mr-md"
              v-model.number="runwayLength"
              label="Runway length (feet)"
            />
            <q-input
              filled
              debounce="500"
              class="q-mr-md"
              v-model.number="Temp"
              label="Runway Temp. °C"
            />
          </q-item>
          <q-item>
            <q-input
              filled
              debounce="500"
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
              filled
              debounce="500"
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
            <q-input
              filled
              debounce="500"
              v-model.number="HeadWind"
              label="Head wind (kts)"
            />
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section>
        <p class="text-h5">Fuel management</p>
        <FuelLoader></FuelLoader>
        <AircraftWeight
          :total-weight="aircraft.TotalWeight"
          :max-take-off-weight="aircraft.MaxTakeOffWeight"
        >
        </AircraftWeight>
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-card-section>
        <p class="text-h5">Take Off information</p>

        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label
                >PTFS
                <q-icon class="q-ms-md" name="help">
                  <q-tooltip>
                    Fan speed should be checked after approximately 1,000 feet
                    on takeoff roll.
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
                {{ (TakeoffSpeed(aircraft.TakeOffWeight) - 10).toFixed(0) }}
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
              <q-item-label>Takeoff Weight</q-item-label>

              <p class="text-h6">
                {{ aircraft.TakeOffWeight.toFixed(0) }}
              </p>
            </q-item-section>
            <q-item-section>
              <q-item-label
                >Takeoff Fuel
                <q-icon class="q-ms-md" name="help">
                  <q-tooltip>
                    Fan speed should be checked after approximately 1,000 feet
                    on takeoff roll.
                  </q-tooltip></q-icon
                ></q-item-label
              >

              <q-option-group
                v-model="aircraft.fuelForTakeoff"
                :options="[
                  {
                    label: '300 lbs',
                    value: 300,
                  },
                  { label: '500 lbs', value: 500 },
                ]"
                inline
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Runway Condition </q-item-label>

              <q-option-group
                v-model="airport.rcr"
                :options="[
                  {
                    label: 'Dry',
                    value: RCR.DRY,
                  },
                  { label: 'WET', value: RCR.WET },
                  { label: 'ICY', value: RCR.ICY },
                ]"
                inline
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Ground run (feet)</q-item-label>
              <p class="text-h6">
                {{ ground.toFixed(0) }}
              </p>
            </q-item-section>
            <q-item-section>
              <q-item-label
                >50 feet obstacle clearance distance (feet)</q-item-label
              >
              <p class="text-h6">
                {{ obstacleDistanceClearance(ground, airport.Temp).toFixed(0) }}
              </p>
            </q-item-section>
            <q-item-section>
              <q-item-label>Critical field Length (feet)</q-item-label>
              <p class="text-h6">
                {{
                  CriticalFieldLength(
                    TakeoffIndex(Temp, airport.AirportPressureAltitude),
                    aircraft.TakeOffWeight,
                    airport.rcr,
                    airport.HeadWind
                  ).toFixed(0)
                }}
              </p>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <p class="text-h5">Runway</p>
      </q-card-section>
      <RunwayViewer
        :groundRun="ground"
        :critical="CriticalField"
        :toda="airport.runwayLength"
        :tora="airport.runwayLength + 1000"
        :asda="airport.runwayLength"
        :lda="airport.runwayLength"
        takeoff
      ></RunwayViewer>
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
import RunwayViewer from './RunwayViewer.vue';
import { obstacleDistanceClearance } from 'src/service/calculators/ObstacleClearance';
import { RCR } from 'src/service/calculators/Rcr';
import { CriticalFieldLength } from 'src/service/calculators/CriticalFieldLength';

const aircraft = useA10CStore();
const airport = useAirportStore();

const { Temp, AirportElevation, HeadWind, Qnh, runwayLength } =
  storeToRefs(airport);

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

const CriticalField = computed(() =>
  CriticalFieldLength(
    TakeoffIndex(Temp.value, airport.AirportPressureAltitude),
    aircraft.TakeOffWeight,
    airport.rcr,
    airport.HeadWind
  )
);
</script>
