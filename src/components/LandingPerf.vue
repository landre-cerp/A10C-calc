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
          v-model.number="landingConfig.temperature"
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
            ><q-btn color="primary" no-caps v-on:click="switchQnhUnit()">{{
              QNH_Unit[Qnh.unit]
            }}</q-btn></template
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
          v-model.number="landingConfig.altitude"
          label="Airport Elevation (feet)"
          :rules="[(val) => val >= 0]"
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
          v-model.number="landingConfig.runwayCourse"
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
          v-model.number="landingConfig.wind.direction"
          :rules="[
            (val) => (val >= 0 && val <= 360) || 'Must be between 0 and 360',
          ]"
          label="Wind direction"
          hint="Enter wind direction in degrees"
        />
        <q-item>
          <q-input
            style="width: 100%"
            filled
            dense
            debounce="500"
            class="q-mr-md"
            v-model.number="landingConfig.wind.speed"
            label="Wind speed"
            hint="Enter wind speed in knots"
          />
        </q-item>
      </q-item>

      <ShowWind
        :wind="landingConfig.wind.Winds(landingConfig.runwayCourse)"
      ></ShowWind>
    </q-card-section>
  </q-card>
  <q-card>
    <q-card-section class="row">
      <q-item>
        <q-input
          style="width: 200px"
          v-model="landingWeight"
          filled
          dense
          debounce="500"
          label="Gross weight"
          @update:model-value="updateLandingWeight"
        >
        </q-input>
      </q-item>
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Single Engine</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="blue" v-model="landingConfig.singleEngine" />
        </q-item-section>
      </q-item>
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Speed brakes</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="blue" v-model="landingConfig.speedbrakes" />
        </q-item-section>
      </q-item>
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Minimum run</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="blue" v-model="landingConfig.minspeed" />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Recommended Approach Speed</q-item-label>
          <p>{{ ApproachSpeed(landingConfig) }}</p>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Landing Index</q-item-label>
          <p>{{ LandingIndex(landingConfig).toFixed(1) }}</p>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Touch down</q-item-label>
          <p>{{ TouchdownSpeed(landingConfig) }}</p>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Ground roll</q-item-label>
          <p>{{ LandingGroundRoll(landingConfig).toFixed(0) }}</p>
        </q-item-section>
      </q-item>
      <q-item class="col-6 col-sm-4 col-md-3">
        <q-item-section>
          <RCRSelector :rcr="landingConfig.rcr" :update-rcr="updateRcr" />
        </q-item-section>
      </q-item>
    </q-card-section>
    <RunwayViewer
      :groundRun="LandingGroundRoll(landingConfig)"
      :critical="0"
      :toda="runwayLength"
      :tora="runwayLength"
      :asda="runwayLength"
      :lda="runwayLength"
      takeoff
    ></RunwayViewer>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QNH_Unit } from './models';
import { convertAltitudeUnits } from 'src/service/conversionTool';
import {
  LandingGroundRoll,
  TouchdownSpeed,
  ILandingConfiguration,
  ApproachSpeed,
  LandingIndex,
} from 'src/service/calculators/Landing';
import { Wind } from 'src/service/Wind';
import ShowWind from './ShowWind.vue';
import RunwayViewer from './RunwayViewer.vue';
import RCRSelector from './RCRSelector.vue';
import { RCR } from 'src/service/calculators/Rcr';

const Qnh = ref({ value: 1013, unit: 0 });
const runwayLength = ref(8000);
const landingWeight = ref(32000);

const landingConfig = ref({
  weight: 0,
  flaps: 20,
  minspeed: false,
  singleEngine: false,
  speedbrakes: true,

  altitude: 0,
  temperature: 15,
  wind: new Wind(0, 0),

  runwayCourse: 0,
  rcr: RCR.DRY,
} as ILandingConfiguration);

function switchQnhUnit() {
  Qnh.value.unit = (Qnh.value.unit + 1) % 2;
  Qnh.value.value = convertAltitudeUnits(Qnh.value);
}
function updateLandingWeight() {
  landingConfig.value.weight = landingWeight.value;
}

const updateRcr = (rcr: RCR) => {
  landingConfig.value.rcr = rcr;
};
</script>
