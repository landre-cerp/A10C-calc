<template>
  <div>
    <p>Status :{{ status_message }}</p>
    <pre>{{ message }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import type { IpcRendererEvent } from 'electron';

const message = ref<string>('');
const status_message = ref<string>('');
const isElectron = typeof window !== 'undefined' && !!window.electron;

// Fonction pour gérer les données TCP
const handleTcpData = (event: IpcRendererEvent, data: string) => {
  message.value = data;
};

const handleTcpStatus = (event: IpcRendererEvent, status: string) => {
  status_message.value = status;
};

onMounted(() => {
  if (isElectron) {
    window.electron.onTcpData(handleTcpData);
    window.electron.onTcpStatus(handleTcpStatus);
  } else {
    status_message.value = 'Electron features are not available in the web version.';
    message.value = 'Connect to DCS is only available in the desktop (Electron) app.';
  }
});

onUnmounted(() => {
  if (isElectron) {
    // Nettoyer les écouteurs d'événements
    window.electron.onTcpData(() => {}); // Passer une fonction vide pour retirer les écouteurs
    window.electron.onTcpStatus(() => {});
  }
});
</script>
