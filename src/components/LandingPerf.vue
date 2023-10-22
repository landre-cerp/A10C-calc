<template>
  <AirportParams
    :airport="airport"
    @updated-qnh="landingConfig.altitude = airport.AirportPressureAltitude"
    @updated-elevation="
      landingConfig.altitude = airport.AirportPressureAltitude
    "
    @updated-temp="landingConfig.temperature = airport.Temp"
    @updated-wind="updateWind"
    @updated-qfu="landingConfig.runwayCourse = airport.runwayQFU"
  >
    <q-item>
      <q-btn color="primary" @click="copyTakeOffParams">{{
        $t('landing_info.copy_takeoff_params')
      }}</q-btn>
    </q-item>
  </AirportParams>

  <q-card>
    <q-card-section class="row">
      <q-item>
        <q-input
          style="width: 200px"
          v-model="airport.grossWeight"
          filled
          dense
          debounce="500"
          :label="$t('landing_info.gross_weight')"
          :rules="[
            (val) =>
              (val > a10C.EmptyWeight && val <= a10C.MaxLandingWeight) ||
              $t('landing_info.gross_weight_validator'),
          ]"
        >
        </q-input>
      </q-item>
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>{{ $t('landing_info.single_engine') }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="blue" v-model="landingConfig.singleEngine" />
        </q-item-section>
      </q-item>
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>{{ $t('landing_info.speed_brakes') }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="blue" v-model="landingConfig.speedbrakes" />
        </q-item-section>
      </q-item>
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label
            >{{ $t('landing_info.minimum_run')
            }}<q-icon class="q-ms-md" name="help">
              <q-tooltip>
                {{ $t('landing_info.minimum_run_help') }}
              </q-tooltip></q-icon
            >
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="blue" v-model="landingConfig.minspeed" />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>{{
            $t('landing_info.final_approach_speed')
          }}</q-item-label>

          {{ Math.ceil(ApproachSpeed(landingConfig as ILandingConfiguration)) }}
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t('landing_info.touch_down_speed') }}</q-item-label>

          {{
            Math.ceil(TouchdownSpeed(landingConfig as ILandingConfiguration))
          }}
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t('landing_info.ground_roll') }}</q-item-label>

          {{
            Math.ceil(LandingGroundRoll(landingConfig as ILandingConfiguration))
          }}
        </q-item-section>
      </q-item>
      <q-item class="col-6 col-sm-4 col-md-3">
        <q-item-section>
          <RCRSelector :rcr="landingConfig.rcr" :update-rcr="updateRcr" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label
            >{{ $t('landing_info.landing_index') }}
            <q-icon class="q-ms-md" name="help">
              <q-tooltip>
                {{ $t('landing_info.landing_index_help') }}
              </q-tooltip></q-icon
            ></q-item-label
          >

          {{ LandingIndex(landingConfig as ILandingConfiguration).toFixed(1) }}
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-card-section>
      <p class="text-h5">{{ $t('runway') }}</p>
      <RunwayViewer
        :groundRun="LandingGroundRoll(landingConfig as ILandingConfiguration)"
        :lda="airport.runwayLength"
        :takeoff="false"
        :wind="landingConfig.wind.Winds(landingConfig.runwayCourse)"
      ></RunwayViewer>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';

import {
  LandingGroundRoll,
  TouchdownSpeed,
  ILandingConfiguration,
  ApproachSpeed,
  LandingIndex,
} from '../modules/a10c/landing/Landing';
import { Wind } from 'src/service/Wind';

import RunwayViewer from './RunwayViewer.vue';
import RCRSelector from './RCRSelector.vue';

import { useLandingStore, useTakeOffStore } from 'src/stores/Airport';
import { useFlightStore } from 'src/stores/flight';
import { PhaseType } from './models';
import AirportParams from './AirportParams.vue';
import { useA10CStore } from 'src/stores/a10c';
import { RCR } from 'src/modules/a10c/Rcr';

const airport = useLandingStore();
const takeOffAirport = useTakeOffStore();
const flight = useFlightStore();
const a10C = useA10CStore();

const landingConfig = ref({
  weight: 0,
  flaps: 20,
  minspeed: false,
  singleEngine: false,
  speedbrakes: true,

  altitude: airport.AirportPressureAltitude,
  temperature: airport.Temp,
  wind: new Wind(airport.WindDirection, airport.WindSpeed),

  runwayCourse: airport.runwayQFU,
  rcr: airport.rcr | RCR.DRY,
} as ILandingConfiguration);

watchEffect(() => {
  landingConfig.value.weight = airport.grossWeight;
});

onMounted(() => {
  // Init landing weight from Landing phase if plan exists
  const landing = flight.phases.find((p) => p.type === PhaseType.LANDING);
  if (landing) {
    airport.grossWeight = landing.getStartingWeight();
  }
});

const updateRcr = (rcr: RCR) => {
  landingConfig.value.rcr = rcr;
};

const updateWind = () => {
  landingConfig.value.wind = new Wind(airport.WindDirection, airport.WindSpeed);
};

const copyTakeOffParams = () => {
  airport.AirportElevation = takeOffAirport.AirportElevation;
  airport.Temp = takeOffAirport.Temp;
  airport.Qnh = takeOffAirport.Qnh;
  airport.WindDirection = takeOffAirport.WindDirection;
  airport.WindSpeed = takeOffAirport.WindSpeed;
  airport.runwayQFU = takeOffAirport.runwayQFU;
  airport.rcr = takeOffAirport.rcr;
  airport.runwayLength = takeOffAirport.runwayLength;
};
</script>
