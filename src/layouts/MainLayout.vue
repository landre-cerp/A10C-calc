<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar square>
            <img src="~assets/Logo_Hog.png" />
          </q-avatar>
          {{ $t('app_title') }}
          <span style="float: right">{{ appVersion }}</span>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/Load" :label="$t('loadout')" />
        <q-route-tab to="/TakeOff" :label="$t('takeoff')" />
        <q-route-tab to="/Flight" :label="$t('flight')" />
        <q-route-tab to="/Landing" :label="$t('landing')" />
        <q-route-tab to="/Brief" :label="$t('brief')" />

        <q-route-tab to="/About" :label="$t('about')" />
      </q-tabs>
      <q-tabs align="right"> <language-changer /> </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { version } from '../../package.json';
import LanguageChanger from 'src/components/languageChanger.vue';

const appVersion = version;
</script>
