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

        <!-- Runway direction picker -->
        <template v-if="selectedAirport">
          <div class="text-subtitle2">{{ t('airports.select_runway') }}</div>
          <q-list bordered separator dense>
            <q-item
              v-for="(dir, i) in runwayDirections"
              :key="i"
              clickable
              :active="selectedDirIndex === i"
              active-class="bg-primary text-white"
              @click="selectedDirIndex = i"
            >
              <q-item-section>
                <q-item-label>
                  <strong>RWY {{ dir.name }}</strong>
                  <span class="q-ml-sm text-caption">({{ dir.qfu }}°)</span>
                </q-item-label>
                <q-item-label caption>
                  TORA {{ dir.rwy.tora }} ft &nbsp;|&nbsp;
                  TODA {{ dir.rwy.toda }} ft &nbsp;|&nbsp;
                  LDA {{ dir.rwy.lda }} ft
                  <span v-if="dir.rwy.asda">&nbsp;|&nbsp; ASDA {{ dir.rwy.asda }} ft</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>
            <q-item v-if="!runwayDirections.length">
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
          :disable="selectedDirIndex === null || !selectedAirport"
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
import { rwyName, reciprocalQfu } from 'src/service/AirportDatabase';

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
const selectedDirIndex = ref<number | null>(null);

watch(selectedAirport, () => {
  selectedDirIndex.value = null;
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      selectedAirport.value = null;
      selectedDirIndex.value = null;
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

/** Each physical runway expanded into two selectable directions */
const runwayDirections = computed(() => {
  const dirs: { rwy: (typeof selectedAirportData.value)['runways'][0]; qfu: number; name: string }[] = [];
  for (const rwy of selectedAirportData.value?.runways ?? []) {
    dirs.push({ rwy, qfu: rwy.qfu, name: rwyName(rwy.qfu) });
    dirs.push({ rwy, qfu: reciprocalQfu(rwy.qfu), name: rwyName(reciprocalQfu(rwy.qfu)) });
  }
  return dirs;
});

function onLoad() {
  if (selectedDirIndex.value === null || !selectedAirportData.value) return;
  const airport = selectedAirportData.value;
  const dir = runwayDirections.value[selectedDirIndex.value];
  const runwayLength = props.mode === 'landing' ? dir.rwy.lda : dir.rwy.toda;

  emit('load', {
    elevation: airport.elevation,
    runwayQfu: dir.qfu,
    runwayLength,
  });
  emit('update:modelValue', false);
}
</script>
