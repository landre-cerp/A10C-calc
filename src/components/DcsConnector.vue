<template>
  <div>
    <p>Status: {{ status_message }}</p>
    <div>
      <strong>Anti Skid:</strong> {{ antiSkid }}
    </div>
    <div>
      <strong>CL_B1:</strong> {{ clb1 }}
    </div>
    <div>
      <strong>CDU Lines:</strong>
      <ul>
        <li v-for="(line, addr) in cduLines" :key="addr">
          [{{ addr }}]: {{ line }}
        </li>
      </ul>
    </div>
    <pre>{{ message }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const message = ref<string>('');
const status_message = ref<string>('');
const antiSkid = ref<string>('');
const clb1 = ref<number | string>('');
const cduLines = ref<Record<number, string>>({});
const isElectron = typeof window !== 'undefined' && !!window.electron;

// Handlers for new DCSBIOS events
const handleDcsbiosStatus = (_event: any, status: string) => {
  status_message.value = status;
};

const handleDcsbiosData = (_event: any, data: any) => {
  if (typeof data === 'object' && data !== null) {
    switch (data.type) {
      case 'AntiSkid':
        antiSkid.value = data.value;
        break;
      case 'CL_B1':
        clb1.value = data.value;
        break;
      case 'CDU':
        cduLines.value[data.address] = data.value;
        break;
      default:
        message.value = `[${data.type}] ${data.value ?? JSON.stringify(data)}`;
    }
  } else {
    message.value = String(data);
  }
};

const handleDcsbiosError = (_event: any, error: string) => {
  status_message.value = `Error: ${error}`;
};

onMounted(() => {
  if (isElectron) {
    window.electron.onDcsbiosStatus(handleDcsbiosStatus);
    window.electron.onDcsbiosData(handleDcsbiosData);
    window.electron.onDcsbiosError(handleDcsbiosError);
  } else {
    status_message.value = 'Electron features are not available in the web version.';
    message.value = 'Connect to DCS is only available in the desktop (Electron) app.';
  }
});

</script>
