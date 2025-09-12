<template>
  <div>
    <p>Status: {{ status_message }}</p>
    <div>
      <strong>Anti Skid:</strong> {{ antiSkid }}
    </div>
    <div>
      <strong>Anti Skid Caution:</strong> {{ clb1 }}
    </div>
    <div>
      <ul style="background: none; padding: 8px; list-style: none; margin: 0;">
<li
  v-for="(line, idx) in cduLines"
  :key="idx"
  style="
    background:black; color:#00FF00;
    font-family:'Consolas',monospace;
    white-space:pre; display:block;
    width:40ch;
    letter-spacing:calc(16ch / 23);
  "
>
  {{ line || '\u00A0' }}
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
const cduLines = ref<string[]>(Array(10).fill(''));
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
      case 'CDU_SCREEN':
        // Update all CDU lines at once
        if (Array.isArray(data.lines)) {
          const newLines: string[] = Array(10).fill('');
          data.lines.forEach((lineObj: any) => {
            if (typeof lineObj.line === 'number' && lineObj.line >= 1 && lineObj.line <= 10) {
              newLines[lineObj.line - 1] = lineObj.value;
            }
          });
          cduLines.value = newLines;
        }
        break;
      case 'CDU':
        // Legacy: update single line
        if (typeof data.line === 'number' && data.line >= 1 && data.line <= 10) {
          cduLines.value[data.line - 1] = data.value;
        }
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
