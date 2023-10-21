<template>
  <q-btn
    dense
    flat
    :icon-right="locale == 'fr-FR' ? flagUS : flagFR"
    @click="changeLocale(locale == 'fr-FR' ? 'en-US' : 'fr-FR')"
    class="q-ml-sm"
    :label="$t('change_language')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { flagFR, flagUS } from 'quasar-extras-svg-icons/country-flag-icons';
const { locale } = useI18n({ useScope: 'global' });

const changeLocale = (lang: string) => {
  locale.value = lang;
};
</script>
