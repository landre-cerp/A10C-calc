<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="row items-center">
        <q-item-label class="text-h5 col">{{
          t('airport.information')
        }}</q-item-label>
        <q-chip v-if="airportLabel" icon="flight" color="primary" text-color="white" dense class="q-mr-sm">
          {{ airportLabel }}
        </q-chip>
        <q-btn
          outline size="sm" icon="flight_land" color="primary"
          :label="t('airports.load_airport')"
          @click="showSelector = true"
        />
      </div>
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
          :label="t('airport.runway_length')"
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
          :label="t('airport.temperature') + ' °C'"
          @update:model-value="emit('updated-temp')"
        >
          <template #append>
            <q-icon name="help">
              <q-tooltip>
                {{ t('airport.temperature_help') }}
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
          <template #append
            ><q-btn color="primary" no-caps @click="airport.switchQnhUnit()">{{
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
          v-model.number="AirportElevation"
          :label="t('airport.elevation')"
          @update:model-value="emit('updated-elevation')"
          :rules="[(val) => val >= 0]"
        >
          <template #append>
            {{ airport.AirportPressureAltitude }}
            <q-icon name="help">
              <q-tooltip>{{ t('airport.pressure_altitude') }}</q-tooltip>
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
            (val) => (val >= 0 && val <= 360) || t('validator_between_0_360'),
          ]"
          :label="t('airport.runway_qfu')"
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
            (val) => (val >= 0 && val <= 360) || t('validator_between_0_360'),
          ]"
          :label="t('airport.wind_direction')"
          :hint="t('airport.wind_direction_help')"
          @update:model-value="emit('updated-wind')"
        />
        <q-input
          style="width: 100%"
          filled
          dense
          debounce="500"
          class="q-mr-md"
          v-model.number="WindSpeed"
          :label="t('airport.wind_speed')"
          :hint="t('airport.wind_speed_help')"
          @update:model-value="emit('updated-wind')"
        />
      </q-item>
    </q-card-section>

    <AirportSelector
      v-model="showSelector"
      :mode="mode"
      @load="onAirportLoaded"
    />
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTakeOffStore, useLandingStore } from 'src/stores/Airport';
import { useI18n } from 'vue-i18n';

import { QNH_Unit } from './models';
import AirportSelector from './airport/AirportSelector.vue';

const { t } = useI18n();

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
  mode?: 'takeoff' | 'landing';
}>();

const {
  Temp,
  AirportElevation,
  WindDirection,
  WindSpeed,
  Qnh,
  runwayLength,
  runwayQFU,
  airportLabel,
} = storeToRefs(props.airport);

const showSelector = ref(false);

function onAirportLoaded(payload: {
  elevation: number;
  runwayQfu: number;
  runwayLength: number;
  airportName: string;
  icao: string;
  runwayName: string;
}) {
  AirportElevation.value = payload.elevation;
  runwayQFU.value = payload.runwayQfu;
  runwayLength.value = payload.runwayLength;
  airportLabel.value = `${payload.icao} – ${payload.airportName} · RWY ${payload.runwayName}`;
  emit('updated-elevation');
  emit('updated-qfu');
}
</script>
