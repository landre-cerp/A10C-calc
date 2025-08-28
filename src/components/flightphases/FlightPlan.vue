<template>
  <div class="q-pa-sm items-start q-gutter-sm">
    <!-- summary -->
    <q-card>
      <q-card-section class="text-h6 bg-primary text-white" horizontal>
        <q-card-section class="row">
          <q-item class="q-mr-md">{{ $t('flight_phase.summary') }}</q-item>
          <q-input
            filled
            dense
            debounce="500"
            dark
            class="q-mr-md"
            v-model.number="fuelReserve"
            :label="$t('flight_phase.reserve')"
            :rules="[(val) => val >= 0]"
          ></q-input>
          <q-input
            filled
            dense
            dark
            debounce="500"
            class="q-mr-md"
            v-model.number="missionRange"
            :label="$t('flight_phase.mission_range')"
          ></q-input>
        </q-card-section>
      </q-card-section>
      <q-card-section class="row">
        <ShowItem
          :label="$t('flight_phase.cruise_alt')"
          :value="flight.CruiseAltitude.toFixed(0)"
          unit="ft"
        />
        <ShowItem
          :label="$t('flight_phase.optimum_cruise_alt')"
          :value="optimum_cruise_altitude.toFixed(0)"
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
          :value="airport.DeltaTemp"
          unit="°C"
        />
        <ShowItem
          :label="$t('flight_phase.bingo')"
          :value="flight.Bingo"
          unit="lbs"
        />
      </q-card-section>
    </q-card>
    <q-card> </q-card>

    <q-card v-for="(phase, index) in flight.FlightPhases" :key="index">
      <div
        class="row justify-between bg-secondary text-white q-pa-md items-center"
      >
        <div class="row items-center">
          <span class="text-h6 q-mr-md">{{
            $t('flight_phase.' + PhaseType[phase.type])
          }}</span>
          <OptimumPhaseParams :phase="phase" />
        </div>
        <div class="row items-center">
          <ShowWind :wind="phase.wind.Winds(phase.course)" horizontal />
          <q-btn-dropdown
            v-if="phase.type != PhaseType.TAKEOFF"
            dense
            icon="fas fa-wind"
            size="sm"
            text-color="black"
            color="warning"
            class="q-mr-sm"
            @click="phase.Recalc()"
          >
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <CourseAndWind :phase="phase" />
              </div>
            </div>
          </q-btn-dropdown>
          <q-btn
            dense
            icon="fas fa-calculator"
            color="accent"
            size="md"
            class="q-mr-sm"
            @click="phase.Recalc()"
          ></q-btn>
          <q-btn
            v-if="phase.isLastPhase()"
            dense
            color="negative"
            icon="delete"
            size="sm"
            :label="$t('flight_phase.remove_last')"
            @click="flight.RemovePhase()"
          />
        </div>
      </div>

      <q-card-section>
        <PhaseViewer
          v-if="phase.type == PhaseType.TAKEOFF"
          :phase="phase"
          :reserve="fuelReserve"
        />
        <PhaseViewer
          v-else-if="phase.type == PhaseType.CLIMB"
          :phase="phase"
          :reserve="fuelReserve"
          edit-altitude
        />
        <PhaseViewer
          v-else-if="phase.type == PhaseType.CRUISE"
          :phase="phase"
          :reserve="fuelReserve"
          edit-distance
        />
        <PhaseViewer
          v-else-if="phase.type == PhaseType.HI_COMBAT"
          :phase="phase"
          :reserve="fuelReserve"
          edit-duration
          edit-fuel-flow
        />
        <PhaseViewer
          v-else-if="phase.type == PhaseType.REFUEL"
          :phase="phase"
          :reserve="fuelReserve"
          edit-f-o-b
        />
        <PhaseViewer
          v-else-if="phase.type == PhaseType.DESCENT"
          :phase="phase"
          :reserve="fuelReserve"
          edit-altitude
        />
        <PhaseViewer
          v-else-if="phase.type == PhaseType.LANDING"
          :phase="phase"
          :reserve="fuelReserve"
        />
      </q-card-section>

      <q-card-actions v-if="phase.isLastPhase()">
        <q-btn
          v-if="flight.phases.length == 0"
          outline
          size="sm"
          @click="flight.AddPhase(PhaseType.TAKEOFF)"
          >{{ $t('flight_phase.' + PhaseType[PhaseType.TAKEOFF]) }}</q-btn
        >

        <q-btn
          class="q-mr-sm"
          outline
          size="sm"
          v-for="(possible, idxPhase) in flight.NextPhases"
          :key="idxPhase"
          @click="flight.AddPhase(possible)"
          >{{ $t('flight_phase.' + PhaseType[possible]) }}
        </q-btn>
      </q-card-actions>
    </q-card>
    <q-card v-if="flight.FlightPhases.length == 0">
      <q-card-section class="row">
        <q-btn outline size="sm" @click="flight.AddPhase(PhaseType.TAKEOFF)">
          {{ $t('flight_phase.' + PhaseType[PhaseType.TAKEOFF]) }}
        </q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useA10CStore } from 'src/stores/a10c';
import { useTakeOffStore } from 'src/stores/Airport';
import { useFlightStore } from 'src/stores/flight';
import { storeToRefs } from 'pinia';

import { PhaseType } from '../models';

import { OptimumCruiseAltitude } from 'src/modules/a10c/cruise/OptimumCruiseAltitude';

import { computed } from 'vue';
import PhaseViewer from './PhaseViewer.vue';

import ShowItem from './ShowItem.vue';
import CourseAndWind from './CourseAndWind.vue';
import ShowWind from '../ShowWind.vue';
import OptimumPhaseParams from './OptimumPhaseParams.vue';

const aircraft = useA10CStore();
const airport = useTakeOffStore();
const flight = useFlightStore();

flight.Qnh = airport.Qnh;

const { missionRange, fuelReserve } = storeToRefs(flight);

const optimum_cruise_altitude = computed(() => {
  {
    return OptimumCruiseAltitude(
      aircraft.Drag,
      aircraft.TakeOffWeight,
      missionRange.value,
    );
  }
});
</script>
