<template>
  <div class="q-pa-md">
    <!-- Toolbar -->
    <div class="row items-center q-mb-md q-gutter-sm">
      <div class="text-h5">{{ t('airports.database') }}</div>
      <q-space />
      <q-btn outline size="sm" icon="add" :label="t('airports.add')" color="primary" @click="openAdd" />
      <q-btn outline size="sm" icon="download" :label="t('airports.export')" @click="db.exportToJson()" :disable="db.airports.length === 0" />
      <q-btn outline size="sm" icon="upload" :label="t('airports.import')" @click="triggerImport" />
      <input ref="fileInput" type="file" accept=".json" style="display:none" @change="onImport" />
    </div>

    <!-- Airport table -->
    <q-table
      flat bordered dense
      :rows="db.airports"
      :columns="columns"
      row-key="id"
      :no-data-label="t('airports.no_airports')"
    >
      <template #body-cell-runways="props">
        <q-td :props="props" class="text-center">
          {{ props.row.runways.length }}
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props" class="text-center q-gutter-xs">
          <q-btn flat round dense icon="edit" size="xs" color="primary" @click="openEdit(props.row)" />
          <q-btn flat round dense icon="delete" size="xs" color="negative" @click="confirmDelete(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Add/Edit dialog -->
    <AirportForm v-model="showForm" :airport="editTarget" @save="onSave" />

    <!-- Delete confirm dialog -->
    <q-dialog v-model="showDeleteConfirm">
      <q-card style="min-width: 300px">
        <q-card-section class="text-h6">{{ t('airports.confirm_delete') }}</q-card-section>
        <q-card-section class="text-body2 q-pt-none">{{ deleteTarget?.name }}</q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="t('airports.cancel')" v-close-popup />
          <q-btn color="negative" :label="t('airports.delete')" @click="doDelete" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useAirportDatabaseStore } from 'src/stores/airportDatabase';
import { SavedAirport } from 'src/service/AirportDatabase';
import AirportForm from './AirportForm.vue';

const { t } = useI18n();
const $q = useQuasar();
const db = useAirportDatabaseStore();

onMounted(() => db.init());

const showForm = ref(false);
const editTarget = ref<SavedAirport | null>(null);
const showDeleteConfirm = ref(false);
const deleteTarget = ref<SavedAirport | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const columns = [
  { name: 'name', label: t('airports.name'), field: 'name', align: 'left' as const, sortable: true },
  { name: 'icao', label: t('airports.icao'), field: 'icao', align: 'left' as const, sortable: true },
  { name: 'elevation', label: t('airports.elevation'), field: 'elevation', align: 'right' as const, sortable: true },
  { name: 'runways', label: t('airports.runways'), field: 'runways', align: 'center' as const },
  { name: 'actions', label: '', field: 'id', align: 'center' as const },
];

function openAdd() {
  editTarget.value = null;
  showForm.value = true;
}

function openEdit(airport: SavedAirport) {
  editTarget.value = airport;
  showForm.value = true;
}

function onSave(airport: SavedAirport) {
  if (editTarget.value) {
    db.updateAirport(airport);
  } else {
    db.addAirport(airport);
  }
}

function confirmDelete(airport: SavedAirport) {
  deleteTarget.value = airport;
  showDeleteConfirm.value = true;
}

function doDelete() {
  if (deleteTarget.value) {
    db.deleteAirport(deleteTarget.value.id);
    deleteTarget.value = null;
  }
}

function triggerImport() {
  fileInput.value?.click();
}

function onImport(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string) as SavedAirport[];
      if (!Array.isArray(data)) throw new Error('Invalid format');
      const added = db.importFromJson(data);
      $q.notify({ type: 'positive', message: `${t('airports.import_success')}: +${added}` });
    } catch {
      $q.notify({ type: 'negative', message: t('airports.import_error') });
    }
    input.value = '';
  };
  reader.readAsText(file);
}
</script>
