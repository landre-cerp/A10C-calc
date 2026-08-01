<template>
  <q-card v-if="isElectron && isA10" class="my-card q-mb-md">
    <q-card-section class="row items-center">
      <div class="col">
        <div class="text-subtitle1">
          {{ t('dcs_sync.title') }}
          <q-icon name="help" class="q-ml-xs">
            <q-tooltip>{{ t('dcs_sync.help') }}</q-tooltip>
          </q-icon>
        </div>
        <div v-if="!isStale" class="text-caption">
          <span v-if="windDirection !== undefined"
            >{{ t('dcs_sync.wind') }}: {{ windDirection }}&deg;/{{ windSpeed }}kts &middot; </span
          >
          <span v-if="altFt !== undefined">{{ t('dcs_sync.altitude') }}: {{ altFt }}ft &middot; </span>
          <span v-if="qnhHpa !== undefined">{{ t('dcs_sync.qnh') }}: {{ qnhHpa }}hPa</span>
        </div>
        <div v-else class="text-caption text-grey">
          {{ t('dcs_sync.stale') }}
        </div>
      </div>
      <q-btn
        color="primary"
        outline
        :disable="isStale"
        :label="t('dcs_sync.apply')"
        @click="apply"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTakeOffStore, useLandingStore } from 'src/stores/Airport';
import { QNH_Unit } from './models';
import { convertAltitudeUnits } from 'src/service/conversionTool';

interface WctrlExportData {
  ver?: number;
  aircraft?: string;
  environment?: {
    wind_direction_deg?: number;
    wind_speed_kts?: number;
    temperature_c?: number;
    pressure_hpa?: number;
    pressure_inhg?: number;
  };
  position?: {
    lat?: number;
    lon?: number;
    alt_ft?: number;
  };
}

const { t } = useI18n();

const props = defineProps<{
  airport: ReturnType<typeof useTakeOffStore> | ReturnType<typeof useLandingStore>;
}>();

const isElectron = typeof window !== 'undefined' && !!window.electron;

// A stale packet (sim paused, DCS closed, aircraft respawned) must not silently
// keep offering to overwrite the form with old numbers.
const STALE_MS = 3000;

const latest = ref<WctrlExportData | null>(null);
const lastReceived = ref(0);
const now = ref(Date.now());
let tick: ReturnType<typeof setInterval> | undefined;

const isStale = computed(() => now.value - lastReceived.value > STALE_MS);

// The pressure-altitude derivation below only makes sense for the A-10C's own
// take-off numbers, so the card stays hidden for every other airframe.
const isA10 = computed(() => latest.value?.aircraft?.startsWith('A-10C') ?? false);

const windDirection = computed(() => latest.value?.environment?.wind_direction_deg);
const windSpeed = computed(() => latest.value?.environment?.wind_speed_kts);
const altFt = computed(() => latest.value?.position?.alt_ft);

// wctrl-export reports station pressure at the aircraft's current position, not QNH.
// Converted back to sea level using this app's own 30 ft/hPa pressure-altitude
// approximation (src/service/conversionTool.ts), so it stays consistent with the
// figure the take-off page later derives from AirportElevation + Qnh.
const qnhHpa = computed(() => {
  const pressure = latest.value?.environment?.pressure_hpa;
  const alt = altFt.value;
  if (pressure === undefined || alt === undefined) return undefined;
  return Math.round(pressure + alt / 30);
});

function handleData(_event: unknown, data: WctrlExportData) {
  latest.value = data;
  lastReceived.value = Date.now();
}

onMounted(() => {
  if (!isElectron) return;
  window.electron.onWctrlExportData(handleData);
  tick = setInterval(() => {
    now.value = Date.now();
  }, 500);
});

onUnmounted(() => {
  if (tick) clearInterval(tick);
});

function apply() {
  if (!latest.value || isStale.value) return;

  if (windDirection.value !== undefined) props.airport.WindDirection = windDirection.value;
  if (windSpeed.value !== undefined) props.airport.WindSpeed = windSpeed.value;
  if (latest.value.environment?.temperature_c !== undefined) {
    props.airport.Temp = latest.value.environment.temperature_c;
  }
  if (altFt.value !== undefined) props.airport.AirportElevation = altFt.value;

  if (qnhHpa.value !== undefined) {
    props.airport.Qnh.value =
      props.airport.Qnh.unit === QNH_Unit.inHg
        ? convertAltitudeUnits({ value: qnhHpa.value, unit: QNH_Unit.inHg })
        : qnhHpa.value;
  }
}
</script>
