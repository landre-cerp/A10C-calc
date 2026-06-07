<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: min(700px, 95vw)">
      <q-card-section class="bg-primary text-white row items-center q-py-sm">
        <div class="text-h6">{{ isEditing ? t('airports.edit') : t('airports.add') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <q-input
            class="col-12 col-sm-6"
            filled dense
            v-model="local.name"
            :label="t('airports.name')"
            :rules="[(val) => !!val || t('airports.name_required')]"
            hide-bottom-space
          />
          <q-input
            class="col-6 col-sm-3"
            filled dense
            v-model="local.icao"
            :label="t('airports.icao')"
            maxlength="5"
            hint="e.g. UGSB"
            hide-bottom-space
          />
          <q-input
            class="col-6 col-sm-3"
            filled dense
            type="number"
            v-model.number="local.elevation"
            :label="t('airports.elevation')"
            hide-bottom-space
          />
        </div>

        <!-- Runways -->
        <div>
          <div class="row items-center q-mb-sm">
            <span class="text-subtitle1 text-weight-medium">{{ t('airports.runways') }}</span>
            <q-space />
            <q-btn size="sm" outline icon="add" :label="t('airports.add_runway')" @click="addRunway" />
          </div>

          <div style="overflow-x: auto">
            <q-markup-table flat bordered dense>
              <thead>
                <tr class="bg-grey-2 text-grey-9">
                  <th class="text-left">{{ t('airports.runway_name') }}</th>
                  <th class="text-center">
                    {{ t('airports.qfu') }}
                    <q-icon name="help" size="xs" class="q-ml-xs cursor-pointer">
                      <q-tooltip>{{ t('airports.qfu_help') }}</q-tooltip>
                    </q-icon>
                  </th>
                  <th class="text-right">
                    {{ t('airports.tora') }}<br><span class="text-caption">(ft)</span>
                    <q-icon name="help" size="xs" class="q-ml-xs cursor-pointer">
                      <q-tooltip>{{ t('airports.tora_help') }}</q-tooltip>
                    </q-icon>
                  </th>
                  <th class="text-right">
                    {{ t('airports.toda') }}<br><span class="text-caption">(ft)</span>
                    <q-icon name="help" size="xs" class="q-ml-xs cursor-pointer">
                      <q-tooltip>{{ t('airports.toda_help') }}</q-tooltip>
                    </q-icon>
                  </th>
                  <th class="text-right">
                    {{ t('airports.lda') }}<br><span class="text-caption">(ft)</span>
                    <q-icon name="help" size="xs" class="q-ml-xs cursor-pointer">
                      <q-tooltip>{{ t('airports.lda_help') }}</q-tooltip>
                    </q-icon>
                  </th>
                  <th class="text-right">
                    {{ t('airports.asda') }}<br><span class="text-caption">(ft)</span>
                    <q-icon name="help" size="xs" class="q-ml-xs cursor-pointer">
                      <q-tooltip>{{ t('airports.asda_help') }}</q-tooltip>
                    </q-icon>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(rwy, i) in local.runways" :key="i">
                  <td>
                    <q-input
                      borderless dense
                      v-model="rwy.designator"
                      :placeholder="rwyName(rwy.qfu)"
                      style="width:70px"
                      maxlength="4"
                      hint=""
                    />
                  </td>
                  <td><q-input borderless dense type="number" v-model.number="rwy.qfu" style="width:60px" /></td>
                  <td><q-input borderless dense type="number" v-model.number="rwy.tora" style="width:75px" @update:model-value="onToraChange(rwy)" /></td>
                  <td><q-input borderless dense type="number" v-model.number="rwy.toda" style="width:75px" /></td>
                  <td><q-input borderless dense type="number" v-model.number="rwy.lda" style="width:75px" /></td>
                  <td><q-input borderless dense type="number" v-model.number="rwy.asda" style="width:75px" /></td>
                  <td class="text-center">
                    <q-btn flat round dense icon="delete" color="negative" size="xs" @click="removeRunway(i)" />
                  </td>
                </tr>
                <tr v-if="local.runways.length === 0">
                  <td colspan="7" class="text-center text-grey q-pa-sm">{{ t('airports.empty_runways') }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="t('airports.cancel')" v-close-popup />
        <q-btn color="primary" :label="t('airports.save')" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  SavedAirport,
  emptyRunway,
  emptyAirport,
  rwyName,
} from 'src/service/AirportDatabase';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  airport?: SavedAirport | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [airport: SavedAirport];
}>();

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const isEditing = computed(() => !!props.airport);
const local = ref<SavedAirport>(emptyAirport());

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      local.value = props.airport
        ? {
            ...props.airport,
            runways: props.airport.runways.map((r) => ({ ...r })),
          }
        : emptyAirport();
    }
  },
);

function addRunway() {
  local.value.runways.push(emptyRunway());
}

function onToraChange(rwy: ReturnType<typeof emptyRunway>) {
  if (!rwy.toda) rwy.toda = rwy.tora;
  if (!rwy.asda) rwy.asda = rwy.tora;
}

function removeRunway(index: number) {
  local.value.runways.splice(index, 1);
}

function onSubmit() {
  if (!local.value.name.trim()) return;
  emit('save', { ...local.value, runways: local.value.runways.map((r) => ({ ...r })) });
  emit('update:modelValue', false);
}
</script>
