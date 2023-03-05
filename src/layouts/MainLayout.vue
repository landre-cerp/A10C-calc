<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar square>
            <img src="~assets/Logo_Hog.png" />
          </q-avatar>
          A10C Perf calculator (for DCS) - by Cerppo
          <span style="float: right">{{ appVersion }}</span>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/Load" label="Loadout" />
        <q-route-tab to="/TakeOff" label="TakeOff" />
        <q-route-tab to="/Flight" label="Flight" />
        <q-route-tab to="/Landing" label="Landing" />

        <q-route-tab to="/About" label="About" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { version } from '../../package.json';
const appVersion = version;
</script>
