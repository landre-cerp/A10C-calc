<template>
  <q-dialog v-model="show">
    <q-card style="min-width: min(500px, 95vw)">
      <q-card-section class="bg-primary text-white row items-center q-py-sm">
        <div class="text-h6">{{ t('airports.load_airport') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <!-- Airport picker -->
        <q-select
          filled dense
          v-model="selectedAirport"
          :options="airportOptions"
          :label="t('airports.select_airport')"
          emit-value map-options
        />

        <!-- Runway picker -->
        <template v-if="selectedAirport">
          <div class="text-subtitle2">{{ t('airports.select_runway') }}</div>
          <q-list bordered separator dense>
            <q-item
              v-for="(rwy, i) in selectedAirportData?.runways"
              :key="i"
              clickable
              :active="selectedRunwayIndex === i"
              active-class="bg-primary text-white"
              @click="selectedRunwayIndex = i"
            >
              <q-item-section>
                <q-item-label>QFU {{ rwy.qfu }}°<span v-if="rwy.surface" class="q-ml-sm text-caption">{{ rwy.surface }}</span></q-item-label>
                <q-item-label caption>
                  TORA {{ rwy.tora }} ft &nbsp;|&nbsp;
                  TODA {{ rwy.toda }} ft &nbsp;|&nbsp;
                  LDA {{ rwy.lda }} ft
                  <span v-if="rwy.asda">&nbsp;|&nbsp; ASDA {{ rwy.asda }} ft</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>
            <q-item v-if="!selectedAirportData?.runways.length">
              <q-item-section class="text-grey text-center">{{ t('airports.empty_runways') }}</q-item-section>
            </q-item>
          </q-list>
        </template>

        <div v-if="!db.airports.length" class="text-grey text-center q-pa-md">
          {{ t('airports.no_airports') }}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="t('airports.cancel')" v-close-popup />
        <q-btn
          color="primary"
          :label="t('airports.load')"
          :disable="selectedRunwayIndex === null || !selectedAirport"
          @click="onLoad"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAirportDatabaseStore } from 'src/stores/airportDatabase';

const { t } = useI18n();
const db = useAirportDatabaseStore();

onMounted(() => db.init());

const props = defineProps<{
  modelValue: boolean;
  /** 'takeoff' fills runwayLength with TODA; 'landing' fills with LDA */
  mode: 'takeoff' | 'landing';
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  load: [payload: { elevation: number; runwayQfu: number; runwayLength: number }];
}>();

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const selectedAirport = ref<string | null>(null);
const selectedRunwayIndex = ref<number | null>(null);

watch(selectedAirport, () => {
  selectedRunwayIndex.value = null;
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      selectedAirport.value = null;
      selectedRunwayIndex.value = null;
    }
  },
);

const airportOptions = computed(() =>
  db.airports.map((a) => ({
    label: `${a.icao ? a.icao + ' – ' : ''}${a.name} (${a.elevation} ft)`,
    value: a.id,
  })),
);

const selectedAirportData = computed(() =>
  db.airports.find((a) => a.id === selectedAirport.value) ?? null,
);

function onLoad() {
  if (selectedRunwayIndex.value === null || !selectedAirportData.value) return;
  const airport = selectedAirportData.value;
  const rwy = airport.runways[selectedRunwayIndex.value];
  const runwayLength =
    props.mode === 'landing' ? rwy.lda : rwy.toda;

  emit('load', {
    elevation: airport.elevation,
    runwayQfu: rwy.qfu,
    runwayLength,
  });
  emit('update:modelValue', false);
}
</script>
