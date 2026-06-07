<template>
  <div class="q-pa-sm q-gutter-sm">

    <!-- Summary card -->
    <q-card>
      <q-card-section class="text-h6 bg-primary text-white" horizontal>
        <q-card-section class="row items-center">
          <q-item class="q-mr-md">{{ $t('flight_phase.summary') }}</q-item>
          <q-input
            filled dense debounce="500" dark hide-bottom-space class="q-mr-md"
            v-model.number="fuelReserve"
            :label="$t('flight_phase.reserve')"
            :rules="[(val) => val >= 0]"
          />
          <q-input
            filled dense dark debounce="500" class="q-mr-md"
            v-model.number="missionRange"
            :label="$t('flight_phase.mission_range')"
          />
        </q-card-section>
      </q-card-section>
      <q-card-section class="row q-col-gutter-md">
        <ShowItem :label="$t('flight_phase.cruise_alt')" :value="flight.CruiseAltitude.toFixed(0)" unit="ft" />
        <ShowItem :label="$t('flight_phase.optimum_cruise_alt')" :value="optimum_cruise_altitude.toFixed(0)" unit="ft" />
        <ShowItem :label="$t('flight_phase.distance')" :value="flight.TotalDistance.toFixed(0)" unit="NM" />
        <ShowItem :label="$t('flight_phase.duration')" :value="flight.TotalDuration.toFixed(0)" unit="Min" />
        <ShowItem :label="$t('flight_phase.fuel_used')" :value="flight.TotalFuelUsed.toFixed(0)" unit="lbs" />
        <ShowItem :label="$t('flight_phase.std_day_temp_dev')" :value="airport.DeltaTemp" unit="°C" />
        <ShowItem :label="$t('flight_phase.bingo')" :value="flight.Bingo" unit="lbs" />
      </q-card-section>
    </q-card>

    <!-- Phase table -->
    <div style="overflow-x: auto">
      <q-markup-table flat bordered dense separator="cell">
        <thead>
          <tr class="bg-grey-3 text-grey-9">
            <th class="text-left">{{ $t('flight_phase.phase') }}</th>
            <th class="text-right">{{ $t('flight_phase.starting_weight') }}<br><span class="text-caption">(lbs)</span></th>
            <th class="text-right">{{ $t('flight_phase.efob') }}<br><span class="text-caption">(lbs)</span></th>
            <th class="text-right">{{ $t('flight_phase.fuel_used') }}<br><span class="text-caption">(lbs)</span></th>
            <th class="text-right">{{ $t('flight_phase.starting_altitude') }}</th>
            <th class="text-right">{{ $t('flight_phase.fuel_flow') }}<br><span class="text-caption">(lbs/h)</span></th>
            <th class="text-right">{{ $t('flight_phase.altitude') }}</th>
            <th class="text-right">{{ $t('flight_phase.distance') }}<br><span class="text-caption">(NM)</span></th>
            <th class="text-right">{{ $t('flight_phase.duration') }}<br><span class="text-caption">(min)</span></th>
            <th class="text-right gt-xs">{{ $t('flight_phase.drag') }}</th>
            <th class="text-center">{{ $t('flight_phase.wind') }}</th>
          </tr>
        </thead>
        <tbody>
          <PhaseTableRow
            v-for="(phase, index) in flight.FlightPhases"
            :key="index"
            :phase="phase"
            :reserve="fuelReserve"
            @remove="flight.RemovePhase()"
          />
        </tbody>
      </q-markup-table>
    </div>

    <!-- Add phase / preset buttons -->
    <div class="row items-center q-gutter-sm">
      <template v-if="flight.FlightPhases.length === 0">
        <q-btn outline size="sm" @click="flight.AddPhase(PhaseType.TAKEOFF)">
          {{ $t('flight_phase.' + PhaseType[PhaseType.TAKEOFF]) }}
        </q-btn>
        <q-btn-dropdown outline size="sm" label="Load preset">
          <q-list>
            <q-item
              v-for="preset in presets" :key="preset.name"
              clickable v-close-popup
              @click="flight.LoadProfile(preset)"
            >
              <q-item-section>{{ preset.name }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
      <template v-else-if="flight.NextPhases.length > 0">
        <q-btn
          v-for="(possible, i) in flight.NextPhases" :key="i"
          outline size="sm" class="q-mr-xs"
          @click="flight.AddPhase(possible)"
        >{{ $t('flight_phase.' + PhaseType[possible]) }}</q-btn>
      </template>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useA10CStore } from 'src/stores/a10c';
import { useTakeOffStore } from 'src/stores/Airport';
import { useFlightStore } from 'src/stores/flight';
import { storeToRefs } from 'pinia';

import { PhaseType } from '../models';
import { OptimumCruiseAltitude } from 'src/modules/a10c/cruise/OptimumCruiseAltitude';
import { MissionPresets } from 'src/service/MissionPresets';

import { computed } from 'vue';
import ShowItem from './ShowItem.vue';
import PhaseTableRow from './PhaseTableRow.vue';

const aircraft = useA10CStore();
const airport = useTakeOffStore();
const flight = useFlightStore();

flight.Qnh = airport.Qnh;

const presets = MissionPresets;
const { missionRange, fuelReserve } = storeToRefs(flight);

const optimum_cruise_altitude = computed(() =>
  OptimumCruiseAltitude(aircraft.Drag, aircraft.TakeOffWeight, missionRange.value),
);
</script>

