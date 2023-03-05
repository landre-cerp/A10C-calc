<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">About</div>
      </q-card-section>
      <q-card-section>
        <q-banner rounded class="bg-orange q-gutter-sm">
          This calculator is intended to be used for DCS game only, not for real
          flight
        </q-banner>
      </q-card-section>
      <q-card-section>
        <p>
          I started this project as an 'exercice' to play with
          <a target="_blank" href="https://quasar.dev/"
            >Quasar.dev framework
          </a>
          and help planning our missions in a more 'realistic' way
        </p>
        <p>
          It is based on Old A10A performance charts ( which you can search for
          on the Internet ) and some mixed informations from DCS forums. Some
          drag coefficients are "made up"
        </p>
        <p>
          It's not be toroughly tested yet agains DCS implementation to see if
          it matches or is totally wrong, so use it at your own risk :)
        </p>
        <p>
          But based on some flight tests, it gives a good idea of the parameters
          in game , and helps understand the impact of each parameter on fuel
          consumption
        </p>
        <p>
          I'm not a pilot, so if you find any mistake ( and i know there are !),
          please let me know
        </p>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">How was it made</div>
        <p>
          Basically it's reading charts, put numbers in a google sheet,
          interpolate equations. That's why numbers are not very accurate and
          don't take some limits / flight params into account.
        </p>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Roadmap</div>
        <p>In progress</p>
        <ul>
          <li>Landing calculation</li>
          <li>
            Flight phases rework with different mission profiles (LO-LO-LO ,
            HI-LO-HI) ( in progress)
          </li>
        </ul>
        <p>Some day</p>
        <ul>
          <li>
            DCS airport database with runway informations (things like TORA,
            TODA, QFU, etc.) and METAR decoder.
          </li>
          <li>Cross wind check at take off / landing</li>
          <li>Takeoff continuation speed , refusal</li>
          <li>
            DCS connector to get live data from the game ( weight, weapons
            remaining )
          </li>
          <li>Flaps 0 configuration</li>
          <li>Translations (at least french + english to start somewhere)</li>
          <li>Some converters</li>
          <li>DCS Web editor plugin ?</li>
        </ul>
      </q-card-section>

      <q-card-section>
        <p>
          If you want to discuss about this project, or have any question, feel
          free to join the
          <a href="https://discord.gg/FHu59hU" target="_blank"
            >discord server</a
          >
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts"></script>
