<template>
  <AboutFr v-if="locale == 'fr-FR'" />
  <AboutEn v-else />
</template>

<script setup lang="ts">
import AboutFr from 'src/components/AboutFr.vue';
import AboutEn from 'src/components/AboutEn.vue';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
</script>
