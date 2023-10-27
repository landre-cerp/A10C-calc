<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <p class="text-h5">A propos</p>

        <q-banner rounded class="bg-orange q-gutter-sm">
          L'utillisation de ce calculateur est desitnée uniquement à DCS. Ne pas
          utiliser pour un vol réel
        </q-banner>

        <p>
          J'ai démarré ce projet comme un exercice pour jouer avec le
          <a target="_blank" href="https://quasar.dev/"
            >framework Quasar.dev
          </a>
          et aider à planifier les missions
          <a href="https://discord.gg/jgENU4e7eS" target="_blank"
            >à la 06MHR A10C's</a
          >
          d'une façon plus réaliste
        </p>
        <p>
          Les calculs sont basés sur les anciens graphiques de performance de
          l'A10 (que vous pouvez trouver sur internet si vous êtes curieux) et
          quelques informations trouvées sur les forums DCS. Certains
          coefficients de trainée sont "inventés"
        </p>
        <p>
          Je ne l'ai pas testé en profondeur par rapport à l'implémentation de
          DCS pour voir si cela correspond ou est totalement faux, donc
          utilisez-le à vos risques et périls :)
        </p>
        <p>
          Mais d'après quelques tests de vol que j'ai faits, cela donne une
          bonne idée des paramètres du jeu et aide à comprendre l'impact de
          chaque paramètre sur la consommation de carburant
        </p>
        <p>
          Je ne suis pas pilote, donc si vous trouvez une erreur (et je suis sûr
          qu'il y en a!), faites-le moi savoir (sur discord) et j'essaierai de
          la corriger
        </p>

        <p class="text-h5">Comment ce programme a-t-il été conçu ?</p>
        <p>
          Très grossièrement, il s'agit de lire les graphiques dans la doc
          (relever des points), mettre les chiffres dans une feuille google,
          interpoler les équations à l'aide des capacités d'interpolation des
          séries de graphiques de la feuille (vous pouvez également le faire
          dans excel si vous le souhaitez). C'est pour cette raison que certains
          chiffres ne sont pas très précis et ne tiennent pas compte de
          certaines limites / paramètres de vol.
        </p>
        <p class="text-h5">Roadmap</p>
        <p>En cours</p>
        <ul>
          <li>RAS</li>
        </ul>

        <p>Un jour</p>

        <ul>
          <li>
            Phases de vol avec différents profils de mission (LO-LO-LO,
            HI-LO-HI)
          </li>

          <li>
            Base de données des aéroports DCS avec les informations de piste (
            TORA, TODA, QFU, etc.) et décodeur METAR.
          </li>
          <li>Autres indicateurs de performance pour le décollage</li>
          <li>
            Connecteur DCS pour obtenir des données en direct du jeu (poids,
            armes restantes)
          </li>
          <li>Configuration en Volets 0</li>
          <li>Quelques convertisseurs</li>
          <li>un plugin pour DCS Web editor ?</li>
        </ul>
        <p>
          Si vous souhaitez discuter de ce projet ou si vous avez des questions,
          n'hésitez pas à rejoindre mon
          <a href="https://discord.gg/FHu59hU" target="_blank"
            >serveur discord</a
          >
        </p>
        <p>
          Vous pouvez également
          <a
            href="https://www.youtube.com/channel/UCNzgdkE2SYx1ShmxvazhqAg"
            target="_blank"
            >trouver quelques vidéos sur youtube</a
          >
          sur d'autres projets comme l'interfaçage du CDU 737 avec DCS
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts"></script>
