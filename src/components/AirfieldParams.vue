<template>
  <q-card class="my-card">
    <q-card-section>
      <q-item-label class="text-h5">Airport information</q-item-label>
    </q-card-section>

    <q-card-section class="row">
      <q-item class="col-12 col-sm-6 col-md-4">
        <q-input
          style="width: 100%"
          filled
          dense
          debounce="500"
          class="q-mr-md"
          v-model.number="runwayLength"
          label="Runway length (feet)"
        />
      </q-item>
      <q-item class="col-12 col-sm-6 col-md-4">
        <q-input
          style="width: 100%"
          filled
          dense
          debounce="500"
          class="q-mr-md"
          v-model.number="Temp"
          label="Runway Temp. °C"
        />

        <q-input
          style="width: 100%"
          filled
          dense
          debounce="500"
          class="q-mr-md"
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

      <q-item class="col-12 col-sm-6 col-md-4">
        <q-input
          style="width: 100%"
          filled
          dense
          debounce="500"
          class="q-mr-md"
          v-model.number="AirportElevation"
          label="Airport Elevation (feet)"
          :rules="[(val) => val >= 0]"
        >
          <template v-slot:append>
            {{ airport.AirportPressureAltitude }}
            <q-icon name="help">
              <q-tooltip>Pressure Altitude</q-tooltip>
            </q-icon>
          </template>
        </q-input>
      </q-item>
      <q-item class="col-12 col-sm-6 col-md-4">
        <q-input
          style="width: 100%"
          filled
          dense
          debounce="500"
          class="q-mr-md"
          v-model.number="runwayQFU"
          :rules="[
            (val) => (val >= 0 && val <= 360) || 'Must be between 0 and 360',
          ]"
          label="Runway QFU (°)"
        />
      </q-item>

      <q-item class="col-12 col-sm-6 col-md-4">
        <q-input
          style="width: 100%"
          filled
          dense
          debounce="500"
          class="q-mr-md"
          v-model.number="WindDirection"
          :rules="[
            (val) => (val >= 0 && val <= 360) || 'Must be between 0 and 360',
          ]"
          label="Wind direction"
          hint="Enter wind direction in degrees"
        />
        <q-input
          style="width: 100%"
          filled
          dense
          debounce="500"
          class="q-mr-md"
          v-model.number="WindSpeed"
          label="Wind speed"
          hint="Enter wind speed in knots"
        />
      </q-item>

      <ShowWind :wind="airport.Winds"></ShowWind>
    </q-card-section>

    <q-card-section>
      <p class="text-h5">Fuel management</p>
      <FuelLoader></FuelLoader>
      <AircraftWeight
        :total-weight="aircraft.TotalWeight"
        :max-take-off-weight="aircraft.MaxTakeOffWeight"
        :zero-fuel-weight="aircraft.ZeroFuelWeight"
        :weapons-weight="aircraft.WeaponWeight + aircraft.AmmoWeight"
        :fuel-weight="aircraft.FuelWeight"
      >
      </AircraftWeight>
    </q-card-section>
  </q-card>

  <q-card class="my-card">
    <q-card-section>
      <p class="text-h5">
        Take Off information <q-badge>FLAPS {{ aircraft.flaps }} </q-badge>
      </p>
    </q-card-section>
    <q-card-section>
      <q-list class="row">
        <q-item class="col-6 col-sm-4 col-md-3">
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
            <p>
              {{ PTFS(Temp).toFixed(0) }}
            </p>
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label>Rotate at</q-item-label>
            <p>
              {{ (TakeoffSpeed(aircraft.TakeOffWeight) - 10).toFixed(0) }}
              KTS
            </p>
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label>
              <q-icon name="flight_takeoff"></q-icon>
              Takeoff speed
            </q-item-label>

            <p>{{ TakeoffSpeed(aircraft.TakeOffWeight).toFixed(0) }} KTS</p>
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label
              >Takeoff Index (max thrust)
              <q-icon class="q-ms-md" name="help">
                <q-tooltip>
                  TakeOff Index is displayed in case you want to read charts.
                </q-tooltip></q-icon
              >
            </q-item-label>

            <p>
              {{
                TakeoffIndex(Temp, airport.AirportPressureAltitude).toFixed(1)
              }}
            </p>
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label>Takeoff Weight</q-item-label>

            <p>
              {{ aircraft.TakeOffWeight.toFixed(0) }}
            </p>
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label
              >Taxi Fuel (100 lbs/10 min)
              <q-icon class="q-ms-md" name="help">
                <q-tooltip>
                  (300 pounds/30 minutes) and a worst case fuel consumption of
                  200 pounds for takeoff and acceleration to climb speed.
                </q-tooltip></q-icon
              ></q-item-label
            >

            <q-option-group
              v-model="aircraft.taxiFuel"
              :options="[
                {
                  label: '100',
                  value: 100,
                },
                {
                  label: '200',
                  value: 200,
                },
                {
                  label: '300',
                  value: 300,
                },
              ]"
              inline
            />
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
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
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label>Ground run (feet)</q-item-label>
            <p>
              {{ ground.toFixed(0) }}
            </p>
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label
              >50 feet obstacle clearance distance (feet)</q-item-label
            >
            <p>
              {{ obstacleDistanceClearance(ground, airport.Temp).toFixed(0) }}
            </p>
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label>Critical field Length (feet)</q-item-label>
            <p>
              {{ CriticalField.toFixed(0) }}
            </p>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
  <q-card>
    <q-card-section>
      <p class="text-h5">Runway</p>

      <RunwayViewer
        :groundRun="ground"
        :critical="CriticalField"
        :toda="airport.runwayLength"
        :tora="airport.runwayLength + 1000"
        :asda="airport.runwayLength"
        :lda="airport.runwayLength"
        takeoff
      ></RunwayViewer>
    </q-card-section>
  </q-card>
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

import ShowWind from './ShowWind.vue';

const aircraft = useA10CStore();
const airport = useAirportStore();

const {
  Temp,
  AirportElevation,
  WindDirection,
  WindSpeed,
  Qnh,
  runwayLength,
  runwayQFU,
} = storeToRefs(airport);

const ground = computed(() => {
  let temp = GroundRun(
    TakeoffIndex(airport.Temp, airport.AirportPressureAltitude),
    aircraft.TakeOffWeight,
    airport.RelativeHeadwind
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
    airport.RelativeHeadwind
  )
);
</script>
