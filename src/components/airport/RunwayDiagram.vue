<template>
  <svg viewBox="0 0 620 160" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:620px; display:block">
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#888" stroke-width="2.5" />
      </pattern>
      <marker id="arr-l" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
        <path d="M7,0 L0,3.5 L7,7 Z" fill="#333" />
      </marker>
      <marker id="arr-r" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
        <path d="M0,0 L7,3.5 L0,7 Z" fill="#333" />
      </marker>
    </defs>

    <!-- ── CLEARWAY: taller box from xTora to xToda, encompasses stopway ── -->
    <rect
      v-if="xToda > xTora + 1"
      :x="xTora" :y="RY - 6"
      :width="xToda - xTora" :height="RH + 12"
      fill="url(#hatch)" stroke="#555" stroke-width="1.5"
    />
    <!-- CLEARWAY label above -->
    <text v-if="xToda > xTora + 1"
      :x="xTora + (xToda - xTora) / 2" :y="RY - 10"
      text-anchor="middle" font-size="10" font-weight="bold" fill="#555"
    >CLEARWAY</text>

    <!-- ── STOPWAY: grey box inside clearway, from xTora to xAsda ── -->
    <rect
      v-if="xAsda > xTora + 1"
      :x="xTora" :y="RY"
      :width="xAsda - xTora" :height="RH"
      fill="#c0c0c0" stroke="#555" stroke-width="1.5"
    />
    <text
      v-if="xAsda - xTora > 22"
      :x="xTora + (xAsda - xTora) / 2" :y="RY + RH / 2 + 4"
      text-anchor="middle" font-size="10" font-weight="bold" fill="#333"
    >STOPWAY</text>

    <!-- ── Main runway strip (white, from LEFT to xTora) ── -->
    <rect :x="LEFT" :y="RY" :width="xTora - LEFT" :height="RH"
      fill="white" stroke="#222" stroke-width="2" />

    <!-- ── Displaced threshold zone (light grey, LEFT to xLdaStart) ── -->
    <rect
      v-if="xLdaStart > LEFT + 2"
      :x="LEFT" :y="RY"
      :width="xLdaStart - LEFT" :height="RH"
      fill="#d8d8d8" stroke="#222" stroke-width="2"
    />

    <!-- ── Direction arrows inside displaced threshold box ── -->
    <!-- Both arrows equal length, ending before threshold line -->
    <g v-if="xLdaStart > LEFT + 16">
      <!-- Arrow length = capped at box width, both end at threshold - margin -->
      <line
        :x1="Math.max(LEFT + 4, xLdaStart - arrowLen - 6)" :y1="RY + RH * 0.33"
        :x2="xLdaStart - 6" :y2="RY + RH * 0.33"
        stroke="#333" stroke-width="1.5" marker-end="url(#arr-r)"
      />
      <line
        :x1="Math.max(LEFT + 4, xLdaStart - arrowLen - 6)" :y1="RY + RH * 0.67"
        :x2="xLdaStart - 6" :y2="RY + RH * 0.67"
        stroke="#333" stroke-width="1.5" marker-end="url(#arr-r)"
      />
    </g>

    <!-- ── Threshold marker: 3 horizontal bars at xLdaStart ── -->
    <g v-if="xLdaStart > LEFT + 2">
      <line v-for="n in 3" :key="n"
        :x1="xLdaStart + 3" :y1="RY + n * (RH / 4)"
        :x2="xLdaStart + 14" :y2="RY + n * (RH / 4)"
        stroke="#333" stroke-width="2.5"
      />
    </g>

    <!-- ── Vertical threshold line ── -->
    <line
      v-if="xLdaStart > LEFT + 2"
      :x1="xLdaStart" :y1="RY" :x2="xLdaStart" :y2="RY + RH"
      stroke="#333" stroke-width="1.5"
    />

    <!-- ── Distance arrows below ── -->

    <!-- LDA -->
    <g :transform="`translate(0, ${RY + RH + 10})`">
      <line :x1="xLdaStart" y1="7" :x2="xTora" y2="7"
        stroke="#333" stroke-width="1.5"
        marker-start="url(#arr-l)" marker-end="url(#arr-r)" />
      <text :x="xLdaStart + (xTora - xLdaStart) / 2" y="5"
        text-anchor="middle" font-size="12" font-weight="bold" fill="#222">LDA</text>
    </g>

    <!-- TORA -->
    <g :transform="`translate(0, ${RY + RH + 28})`">
      <line :x1="LEFT" y1="7" :x2="xTora" y2="7"
        stroke="#333" stroke-width="1.5"
        marker-start="url(#arr-l)" marker-end="url(#arr-r)" />
      <text :x="LEFT + (xTora - LEFT) / 2" y="5"
        text-anchor="middle" font-size="12" font-weight="bold" fill="#222">TORA</text>
    </g>

    <!-- ASDA -->
    <g v-if="xAsda > xTora + 2" :transform="`translate(0, ${RY + RH + 46})`">
      <line :x1="LEFT" y1="7" :x2="xAsda" y2="7"
        stroke="#333" stroke-width="1.5"
        marker-start="url(#arr-l)" marker-end="url(#arr-r)" />
      <text :x="LEFT + (xAsda - LEFT) / 2" y="5"
        text-anchor="middle" font-size="12" font-weight="bold" fill="#222">ASDA</text>
    </g>

    <!-- TODA -->
    <g v-if="xToda > xTora + 2" :transform="`translate(0, ${RY + RH + 64})`">
      <line :x1="LEFT" y1="7" :x2="xToda" y2="7"
        stroke="#333" stroke-width="1.5"
        marker-start="url(#arr-l)" marker-end="url(#arr-r)" />
      <text :x="LEFT + (xToda - LEFT) / 2" y="5"
        text-anchor="middle" font-size="12" font-weight="bold" fill="#222">TODA</text>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  tora: number;
  toda: number;
  lda: number;
  asda?: number;
}>();

const LEFT = 30;
const RIGHT = 595;
const DRAW_W = RIGHT - LEFT;
const RY = 26;
const RH = 38;

// Fall back to schematic proportions when no data entered
const base = computed(() => {
  const hasData = props.tora > 0 || props.toda > 0;
  if (hasData) {
    const toda = Math.max(props.toda, props.tora, props.asda ?? 0) || props.tora;
    return {
      toda,
      tora: props.tora || toda * 0.75,
      lda: props.lda || props.tora * 0.84,
      asda: props.asda ?? props.tora,
    };
  }
  return { toda: 1200, tora: 900, lda: 750, asda: 1050 };
});

const scale = computed(() => DRAW_W / base.value.toda);
const xTora = computed(() => LEFT + base.value.tora * scale.value);
const xAsda = computed(() => LEFT + base.value.asda * scale.value);
const xToda = computed(() => LEFT + base.value.toda * scale.value);
const xLdaStart = computed(() => LEFT + (base.value.tora - base.value.lda) * scale.value);

/** Arrow length inside the displaced threshold box — capped so they never touch the threshold line */
const arrowLen = computed(() => Math.min(xLdaStart.value - LEFT - 12, 48));
</script>
