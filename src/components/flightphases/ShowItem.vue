<template>
  <q-item class="col-xs-6 col-sm-4 col-md-2">
    <q-item-section>
      <q-item-label class="text-caption text-grey-7">{{ label }}</q-item-label>
      <div class="text-bold text-body1">{{ value }} <span class="text-caption">{{ unit }}</span></div>
    </q-item-section>
  </q-item>
</template>
<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  unit: string;
}>();
</script>
