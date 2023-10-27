<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <p class="text-h5">About This application</p>
        <q-banner rounded class="bg-orange q-gutter-sm">
          This calculator is intended to be used for DCS game only, not for real
          flight
        </q-banner>
        <p>
          I started this project as an 'exercice' to play with the
          <a target="_blank" href="https://quasar.dev/"
            >Quasar.dev framework
          </a>
          and help planning
          <a href="https://discord.gg/jgENU4e7eS" target="_blank"
            >06MHR A10C's</a
          >
          missions in a more 'realistic' way
        </p>
        <p>
          Calculations are based on Old A10A performance charts (which you can
          search for on the Internet if you are curious) and some mixed
          informations from DCS forums. Some drag coefficients are "made up"
        </p>
        <p>
          It's not been toroughly tested yet agains DCS implementation to see if
          it matches or is totally wrong, so use it at your own risk :)
        </p>
        <p>
          But based on some flight tests i made, it gives a good idea of the
          parameters in game, and helps understand the impact of each parameter
          on fuel consumption
        </p>
        <p>
          I'm not a pilot, so if you find any mistake ( and i'm sure there are
          !), please let me know (on discord) and i'll try to fix it
        </p>
        <p class="text-h5">How did i made this application ?</p>
        <p>
          Basically it's been reading charts in the doc (sampling points), put
          numbers in a google sheet and interpolate equations using sheet's
          graph series interpolation capabilities ( you can do this in excel too
          if you wan). That's why some numbers are not very accurate and don't
          take some limits/flight params into account.
        </p>

        <p class="text-h5">Roadmap</p>
        <p>In progress</p>
        <ul>
          <li>RAS</li>
        </ul>
        <p>Some day</p>
        <ul>
          <li>
            Flight phases rework with different mission profiles (LO-LO-LO ,
            HI-LO-HI) ( in progress)
          </li>
          <li>
            DCS airport database with runway informations (things like TORA,
            TODA, QFU, etc.) and METAR decoder.
          </li>
          <li>Takeoff continuation speed , refusal</li>
          <li>
            DCS connector to get live data from the game ( weight, weapons
            remaining )
          </li>
          <li>Flaps 0 configuration</li>
          <li>Some converters</li>
          <li>DCS Web editor plugin ?</li>
        </ul>
        <p>
          If you want to discuss about this project, or have any question, feel
          free to join my
          <a href="https://discord.gg/FHu59hU" target="_blank"
            >discord server</a
          >
        </p>

        <p>
          You can also
          <a
            href="https://www.youtube.com/channel/UCNzgdkE2SYx1ShmxvazhqAg"
            target="_blank"
            >find some videos</a
          >
          on some other projects like interfacing the 737 CDU with DCS
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts"></script>
