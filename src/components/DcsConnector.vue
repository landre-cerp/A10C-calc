<template>
  <div>
    <p>Status :{{ status_message }}</p>
    <pre>{{ message }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

const message = ref<string>('');
const status_message = ref<string>('');

// Fonction pour gérer les données TCP
const handleTcpData = (event: Event, data: string) => {
  message.value = data;
};

const handleTcpStatus = (event: Event, status: string) => {
  status_message.value = status;
};

// Vérifier que `window.electron` est défini et utiliser ses méthodes
onMounted(() => {
  if (window.electron) {
    window.electron.onTcpData(handleTcpData);
    window.electron.onTcpStatus(handleTcpStatus);
  } else {
    console.error('window.electron is not defined');
  }
});

onUnmounted(() => {
  if (window.electron) {
    // Nettoyer les écouteurs d'événements
    window.electron.onTcpData(() => {}); // Passer une fonction vide pour retirer les écouteurs
    window.electron.onTcpStatus(() => {});
  }
});
</script>
