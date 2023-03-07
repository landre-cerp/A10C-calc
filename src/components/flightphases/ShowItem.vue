<template>
  <q-item class="col-xs-3 col-sm-2 col-md-1">
    <q-item-section>
      <q-item-label> {{ label }} </q-item-label>
      <span class="text-bold">{{ value }} {{ unit }}</span>
    </q-item-section>
  </q-item>
</template>
<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: string | number;
  unit: string;
}>();
</script>
