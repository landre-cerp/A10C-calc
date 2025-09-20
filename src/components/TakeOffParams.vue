<template>
  <AirportParams :airport="airport" />

  <q-card class="my-card">
    <q-card-section>
      <p class="text-h5">
        {{ $t('takeoff_info.info') }}
        <q-badge>{{ $t('takeoff_info.flaps') }} {{ aircraft.flaps }} </q-badge>
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
                  {{ $t('takeoff_info.ptfs_help') }}
                </q-tooltip></q-icon
              ></q-item-label
            >

            {{ PTFS(Temp).toFixed(0) }}
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label>{{ $t('takeoff_info.rotate_speed') }}</q-item-label>

            {{ (TakeoffSpeed(aircraft.TakeOffWeight) - 10).toFixed(0) }}
            KTS
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label>
              <q-icon name="fas fa-plane-departure"></q-icon>
              {{ $t('takeoff_info.takeoff_speed') }}
            </q-item-label>

            {{ TakeoffSpeed(aircraft.TakeOffWeight).toFixed(0) }} KTS
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label
              >{{ $t('takeoff_info.takeoff_index') }}
              <q-icon class="q-ms-md" name="help">
                <q-tooltip>
                  {{ $t('takeoff_info.takeoff_index_help') }}
                </q-tooltip></q-icon
              >
            </q-item-label>

            {{ TakeoffIndex(Temp, airport.AirportPressureAltitude).toFixed(1) }}
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label>
              {{ $t('takeoff_info.takeoff_weight') }}</q-item-label
            >

            {{ aircraft.TakeOffWeight.toFixed(0) }} Lbs
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label
              >{{ $t('takeoff_info.taxi_fuel') }}
              <q-icon class="q-ms-md" name="help">
                <q-tooltip>
                  {{ $t('takeoff_info.taxi_fuel_help') }}
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
            <RCRSelector :rcr="airport.rcr" :update-rcr="updateRcr" />
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label>{{ $t('takeoff_info.ground_run') }}</q-item-label>
            {{ ground.toFixed(0) }} ft
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label>{{
              $t('takeoff_info.fifty_feet_clearance')
            }}</q-item-label>

            {{ obstacleDistanceClearance(ground, airport.Temp).toFixed(0) }}
            ft
          </q-item-section>
        </q-item>
        <q-item class="col-6 col-sm-4 col-md-3">
          <q-item-section>
            <q-item-label>{{
              $t('takeoff_info.critical_field_length')
            }}</q-item-label>
            {{ CriticalField.toFixed(0) }} ft
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
  <q-card>
    <q-card-section>
      <p class="text-h5">{{ $t('runway') }}</p>
      <RunwayViewer
        :ground-run="ground"
        :critical="CriticalField"
        :toda="airport.runwayLength"
        :tora="airport.runwayLength"
        :asda="airport.runwayLength"
        :takeoff="true"
        :wind="airportWinds"
      ></RunwayViewer>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
//Stores
import { useA10CStore } from 'src/stores/a10c';
import { useTakeOffStore } from 'src/stores/Airport';

import { storeToRefs } from 'pinia';

import { computed } from 'vue';

/// Calculators
import { TakeoffIndexCalculator } from '../modules/a10c/takeoff/TakeOffIndex';
import { GroundRun } from '../modules/a10c/takeoff/groundRun.js';
import { TakeoffSpeed } from '../modules/a10c/takeoff/takeOffSpeed';
import { PTFS } from '../modules/a10c/takeoff/PTFS';
import RunwayViewer from './RunwayViewer.vue';
import { obstacleDistanceClearance } from 'src/modules/a10c/takeoff/ObstacleClearance';

import { CriticalFieldLength } from '../modules/a10c/takeoff/CriticalFieldLength';

import RCRSelector from './RCRSelector.vue';
import AirportParams from './AirportParams.vue';
import { Wind } from 'src/service/Wind';
import { RCR } from 'src/modules/a10c/Rcr';

const aircraft = useA10CStore();
const airport = useTakeOffStore();

const { Temp } = storeToRefs(airport);

const ground = computed(() => {
  let temp = GroundRun(
    TakeoffIndex(airport.Temp, airport.AirportPressureAltitude),
    aircraft.TakeOffWeight,
    airport.RelativeHeadwind,
  );
  if (typeof temp == 'undefined') temp = 0;
  return temp;
});

const airportWinds = computed(() => {
  return new Wind(airport.WindDirection, airport.WindSpeed).Winds(
    airport.runwayQFU,
  );
});

const TOICalculator = new TakeoffIndexCalculator();
const TakeoffIndex = (temp: number, pressureAltitude: number) =>
  TOICalculator.Calc(pressureAltitude, temp);

const CriticalField = computed(() =>
  CriticalFieldLength(
    TakeoffIndex(Temp.value, airport.AirportPressureAltitude),
    aircraft.TakeOffWeight,
    airport.rcr,
    airport.RelativeHeadwind,
  ),
);

const updateRcr = (rcr: RCR) => {
  airport.rcr = rcr;
};
</script>
