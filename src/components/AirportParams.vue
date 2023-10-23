<template>
  <q-card class="my-card">
    <q-card-section>
      <q-item-label class="text-h5">{{
        $t('airport.information')
      }}</q-item-label>
    </q-card-section>
    <slot></slot>

    <q-card-section class="row">
      <q-item class="col-12 col-sm-6 col-md-4">
        <q-input
          style="width: 100%"
          filled
          dense
          debounce="500"
          class="q-mr-md"
          v-model.number="runwayLength"
          :label="$t('airport.runway_length')"
        />
      </q-item>

      <q-item class="col-12 col-sm-6 col-md-4">
        <q-input
          bottom-slots
          style="width: 100%"
          filled
          dense
          debounce="500"
          class="q-mr-md"
          v-model.number="Temp"
          :label="$t('airport.temperature') + ' °C'"
          @update:model-value="emit('updated-temp')"
        >
          <template v-slot:append>
            <q-icon name="help">
              <q-tooltip>
                {{ $t('airport.temperature_help') }}
              </q-tooltip>
            </q-icon>
          </template>
        </q-input>

        <q-input
          style="width: 100%"
          filled
          dense
          debounce="500"
          class="q-mr-md"
          v-model.number:model-value="Qnh.value"
          label="QNH"
          :rules="[(val) => val >= 0]"
          @update:model-value="emit('updated-qnh')"
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
          :label="$t('airport.elevation')"
          @update:model-value="emit('updated-elevation')"
          :rules="[(val) => val >= 0]"
        >
          <template v-slot:append>
            {{ airport.AirportPressureAltitude }}
            <q-icon name="help">
              <q-tooltip>{{ $t('airport.pressure_altitude') }}</q-tooltip>
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
            (val) => (val >= 0 && val <= 360) || $t('validator_between_0_360'),
          ]"
          :label="$t('airport.runway_qfu')"
          @update:model-value="emit('updated-qfu')"
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
            (val) => (val >= 0 && val <= 360) || $t('validator_between_0_360'),
          ]"
          :label="$t('airport.wind_direction')"
          :hint="$t('airport.wind_direction_help')"
          @update:model-value="emit('updated-wind')"
        />
        <q-input
          style="width: 100%"
          filled
          dense
          debounce="500"
          class="q-mr-md"
          v-model.number="WindSpeed"
          :label="$t('airport.wind_speed')"
          :hint="$t('airport.wind_speed_help')"
          @update:model-value="emit('updated-wind')"
        />
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTakeOffStore, useLandingStore } from 'src/stores/Airport';

import { QNH_Unit } from './models';

const emit = defineEmits([
  'updated-qnh',
  'updated-temp',
  'updated-wind',
  'updated-elevation',
  'updated-qfu',
]);

const props = defineProps<{
  airport:
    | ReturnType<typeof useTakeOffStore>
    | ReturnType<typeof useLandingStore>;
}>();

const {
  Temp,
  AirportElevation,
  WindDirection,
  WindSpeed,
  Qnh,
  runwayLength,
  runwayQFU,
} = storeToRefs(props.airport);
</script>
