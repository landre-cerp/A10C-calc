<template>
  <q-btn class="q-mt-md" color="primary" @click="exportToPng">{{
    $t('export_kneeboard')
  }}</q-btn>
  <q-page id="kneeboard" class="q-pa-sm" style="max-width: 900px">
    <div
      style="display: flex; flex-direction: row; justify-content: space-between"
    >
      <div
        class="q-mb-sm"
        style="
          border: 1px dashed black;
          max-width: 68px;
          min-width: 68px;
          font-size: 0.7rem;

          vertical-align: top;
          text-align: center;
          margin: 5px;

          height: 120px;
        "
        v-for="(store, index) in aircraft.configuration.pylonsLoad"
        :key="index"
      >
        {{ 11 - index }} <br />
        {{ store.short }}<br />
        <br />

        <div v-if="store.weight > 0" style="font-size: smaller; color: gray">
          {{ store.weight }} lbs <br />
          {{ store.drag }} lbs
        </div>
      </div>
    </div>

    <div class="txt-block">
      <p>
        {{ $t('brief_page.fuel') }}: {{ aircraft.fuelQty }}% /
        {{ aircraft.FuelWeight }} Lbs
      </p>
      <p>
        {{ $t('brief_page.ammo') }}: {{ aircraft.gunAmmoPercent }}% /
        {{ aircraft.AmmoWeight }} Lbs
      </p>
      <p>
        {{ $t('takeoff_info.takeoff_weight') }}:
        {{ aircraft.TakeOffWeight.toFixed(0) }} /
        {{ aircraft.MaxTakeOffWeight }} Lbs
      </p>
    </div>
    <div style="display: flex; flex-direction: row">
      <div style="display: flex; flex-direction: column">
        <p class="text-h6">{{ $t('takeoff') }}</p>

        <div style="display: flex; flex-direction: row">
          <div class="txt-block text-right">
            <p>
              QNH : {{ takeOff.Qnh.value }} {{ QNH_Unit[takeOff.Qnh.unit] }}
            </p>
            <p>
              {{ $t('wind.label') }}: {{ takeOff.Winds.front }} KTS
              {{
                $t(
                  'wind.' + WindDirections[takeOff.Winds.longitudinalDirection],
                )
              }}
            </p>
            <p>
              {{ takeOff.Winds.cross }} KTS
              {{ $t('wind.' + WindDirections[takeOff.Winds.lateralDirection]) }}
            </p>
          </div>
          <div class="txt-block text-right">
            <p>
              {{ $t('takeoff_info.info') }}
              <q-badge
                >{{ $t('takeoff_info.flaps') }} {{ aircraft.flaps }}
              </q-badge>
            </p>

            <p>
              {{ $t('takeoff_info.rotate_speed') }} :
              {{ (TakeoffSpeed(aircraft.TakeOffWeight) - 10).toFixed(0) }} KTS
            </p>
            <p>
              {{ $t('takeoff_info.takeoff_speed') }} :
              {{ TakeoffSpeed(aircraft.TakeOffWeight).toFixed(0) }} KTS
            </p>
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column">
        <p class="text-h6">{{ $t('landing') }}</p>
        <div class="txt-block text-right">
          <p>
            {{ $t('landing_info.final_approach_speed') }} (kias) :

            {{
              Math.ceil(ApproachSpeed(landingConfig as ILandingConfiguration))
            }}
          </p>
          <p>
            {{ $t('landing_info.touch_down_speed') }} :

            {{
              Math.ceil(TouchdownSpeed(landingConfig as ILandingConfiguration))
            }}
          </p>

          <p>
            {{ $t('landing_info.ground_roll') }} (ft) :

            {{
              Math.ceil(
                LandingGroundRoll(landingConfig as ILandingConfiguration),
              )
            }}
          </p>
        </div>
      </div>
    </div>

    <p class="text-h6">{{ $t('flight') }}</p>
    <q-card-section class="row txt-block">
      <ShowItem
        :label="$t('flight_phase.cruise_alt')"
        :value="flight.CruiseAltitude.toFixed(0)"
        unit="ft"
      />

      <ShowItem
        :label="$t('flight_phase.distance')"
        :value="flight.TotalDistance.toFixed(0)"
        unit="NM"
      />

      <ShowItem
        :label="$t('flight_phase.duration')"
        :value="flight.TotalDuration.toFixed(0)"
        unit="Min"
      />
      <ShowItem
        :label="$t('flight_phase.fuel_used')"
        :value="flight.TotalFuelUsed.toFixed(0)"
        unit="lbs"
      />
      <ShowItem
        :label="$t('flight_phase.std_day_temp_dev')"
        :value="takeOff.DeltaTemp"
        unit="°C"
      />
      <ShowItem
        :label="$t('flight_phase.bingo')"
        :value="flight.Bingo"
        unit="lbs"
      />
    </q-card-section>

    <q-markup-table style="margin: 5px" class="text-right">
      <thead>
        <tr>
          <th class="q-pa-sm">{{ $t('flight_phase.phase') }}</th>
          <th>{{ $t('flight_phase.starting_weight') }}<br />(lbs)</th>
          <th>{{ $t('flight_phase.efob') }}<br />(lbs)</th>
          <th>{{ $t('flight_phase.starting_altitude') }}<br />(ft)</th>
          <th>{{ $t('flight_phase.ending_altitude') }}<br />(ft)</th>
          <th>{{ $t('flight_phase.fuel_used') }}<br />(lbs)</th>
          <th>{{ $t('flight_phase.duration') }}<br />(min)</th>
          <th>{{ $t('flight_phase.distance') }}<br />(NM)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(phase, index) in flight.phases" :key="index">
          <td>{{ $t('flight_phase.' + PhaseType[phase.type]) }}</td>
          <td>
            {{ phase.getStartingWeight().toFixed(0) }}
          </td>
          <td>
            {{ phase.getFuelOnBoard().toFixed(0) }}
          </td>
          <td>
            {{ phase.getStartingAltitude() }}
          </td>
          <td>
            {{ phase.getEndingAltitude() }}
          </td>
          <td>{{ phase.fuelUsed.toFixed(0) }}</td>
          <td>
            {{ phase.duration.toFixed(1) }}
          </td>
          <td>
            {{ phase.distance.toFixed(1) }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script setup lang="ts">
import { useA10CStore } from 'src/stores/a10c';
import { useFlightStore } from 'src/stores/flight';
import { useTakeOffStore, useLandingStore } from 'src/stores/Airport';
import { TakeoffSpeed } from 'src/modules/a10c/takeoff/takeOffSpeed';
import { PhaseType, QNH_Unit } from 'src/components/models';

import ShowItem from 'src/components/flightphases/ShowItem.vue';
import { Wind, WindDirections } from 'src/service/Wind';
import {
  LandingGroundRoll,
  TouchdownSpeed,
  ILandingConfiguration,
  ApproachSpeed,
} from 'src/modules/a10c/landing/Landing';
import { RCR } from '../modules/a10c/Rcr';
import { onMounted, ref } from 'vue';

import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

const aircraft = useA10CStore();
const flight = useFlightStore();
const takeOff = useTakeOffStore();
const landing = useLandingStore();

const landingConfig = ref({
  weight: 0,
  flaps: 20,
  minspeed: false,
  singleEngine: false,
  speedbrakes: true,

  altitude: landing.AirportPressureAltitude,
  temperature: landing.Temp,
  wind: new Wind(landing.WindDirection, landing.WindSpeed),

  runwayCourse: landing.runwayQFU,
  rcr: landing.rcr | RCR.DRY,
} as ILandingConfiguration);

onMounted(() => {
  // Init landing weight from Landing phase if plan exists
  const landing = flight.phases.find((p) => p.type === PhaseType.LANDING);
  if (landing) {
    landingConfig.value.weight = landing.getStartingWeight();
  }
});

function exportToPng() {
  const node = document.getElementById('kneeboard');
  if (node) {
    toPng(node, { backgroundColor: 'white' })
      .then((blob) => {
        saveAs(blob, 'kneeboard.png');
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
      });
  }
}
</script>

<style scoped>
.txt-block {
  border: 1px solid;
  padding: 0.5rem;
  margin: 5px;
}

td,
th {
  border: 1px dotted;
  padding: 0.5rem;
}
</style>
