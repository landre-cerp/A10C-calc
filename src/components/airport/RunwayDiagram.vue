<template>
  <svg :viewBox="`0 0 600 165`" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:600px; display:block">
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#999" stroke-width="2" />
      </pattern>
      <marker id="arrow-left" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
        <path d="M6,0 L0,3 L6,6 Z" fill="#333" />
      </marker>
      <marker id="arrow-right" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#333" />
      </marker>
    </defs>

    <!-- Clearway (hatched, ASDA → TODA) -->
    <rect
      v-if="xToda > xAsda + 1"
      :x="xAsda" :y="RY + 4"
      :width="xToda - xAsda" :height="RH - 8"
      fill="url(#hatch)" stroke="#888" stroke-width="1"
    />
    <text v-if="xToda - xAsda > 30" :x="xAsda + (xToda - xAsda) / 2" :y="RY - 4" text-anchor="middle" font-size="10" fill="#555">CLEARWAY</text>

    <!-- Stopway (TORA → ASDA) -->
    <rect
      v-if="xAsda > xTora + 1"
      :x="xTora" :y="RY"
      :width="xAsda - xTora" :height="RH"
      fill="#b8b8b8" stroke="#555" stroke-width="1.5"
    />
    <text v-if="xAsda - xTora > 18" :x="xTora + (xAsda - xTora) / 2" :y="RY + RH / 2 + 4" text-anchor="middle" font-size="9" font-weight="bold" fill="#333">STOPWAY</text>

    <!-- Displaced threshold zone (0 → LDA offset) -->
    <rect
      v-if="xLdaStart > LEFT + 1"
      :x="LEFT" :y="RY"
      :width="xLdaStart - LEFT" :height="RH"
      fill="#d0d0d0" stroke="#888" stroke-width="1"
    />

    <!-- Main runway strip -->
    <rect :x="LEFT" :y="RY" :width="xTora - LEFT" :height="RH" fill="white" stroke="#222" stroke-width="2" fill-opacity="0.0" />
    <rect :x="LEFT" :y="RY" :width="xTora - LEFT" :height="RH" fill="none" stroke="#222" stroke-width="2" />

    <!-- Threshold line -->
    <line v-if="xLdaStart > LEFT + 1" :x1="xLdaStart" :y1="RY + 2" :x2="xLdaStart" :y2="RY + RH - 2" stroke="#333" stroke-width="2" stroke-dasharray="4 3" />

    <!-- Centerline dashes -->
    <line v-for="n in 5" :key="n"
      :x1="LEFT + (n-1) * (xTora - LEFT) / 5 + 6" :y1="RY + RH/2"
      :x2="LEFT + (n-1) * (xTora - LEFT) / 5 + (xTora - LEFT)/5 - 6" :y2="RY + RH/2"
      stroke="#aaa" stroke-width="1.5" stroke-dasharray="none"
    />

    <!-- Direction arrow in threshold box -->
    <line :x1="LEFT + 4" :y1="RY + RH/2" :x2="LEFT + (xLdaStart > LEFT + 1 ? xLdaStart - 4 : 20)" :y2="RY + RH/2"
      stroke="#555" stroke-width="1.5" marker-end="url(#arrow-right)" />

    <!-- ── Distance arrows ── -->

    <!-- LDA -->
    <g :transform="`translate(0, ${RY + RH + 8})`">
      <line :x1="xLdaStart" y1="8" :x2="xTora" y2="8" stroke="#333" stroke-width="1.5"
        marker-start="url(#arrow-left)" marker-end="url(#arrow-right)" />
      <text :x="xLdaStart + (xTora - xLdaStart) / 2" y="6" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">LDA</text>
    </g>

    <!-- TORA -->
    <g :transform="`translate(0, ${RY + RH + 26})`">
      <line :x1="LEFT" y1="8" :x2="xTora" y2="8" stroke="#333" stroke-width="1.5"
        marker-start="url(#arrow-left)" marker-end="url(#arrow-right)" />
      <text :x="LEFT + (xTora - LEFT) / 2" y="6" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">TORA</text>
    </g>

    <!-- ASDA -->
    <g v-if="xAsda > xTora + 1" :transform="`translate(0, ${RY + RH + 44})`">
      <line :x1="LEFT" y1="8" :x2="xAsda" y2="8" stroke="#333" stroke-width="1.5"
        marker-start="url(#arrow-left)" marker-end="url(#arrow-right)" />
      <text :x="LEFT + (xAsda - LEFT) / 2" y="6" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">ASDA</text>
    </g>

    <!-- TODA -->
    <g v-if="xToda > xTora + 1" :transform="`translate(0, ${RY + RH + 62})`">
      <line :x1="LEFT" y1="8" :x2="xToda" y2="8" stroke="#333" stroke-width="1.5"
        marker-start="url(#arrow-left)" marker-end="url(#arrow-right)" />
      <text :x="LEFT + (xToda - LEFT) / 2" y="6" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">TODA</text>
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

// Layout constants
const LEFT = 20;
const RIGHT = 580;
const DRAW_W = RIGHT - LEFT;
const RY = 22;
const RH = 36;

// Use schematic proportions when no real data entered
const base = computed(() => {
  const t = props.toda || props.tora || props.asda || props.lda;
  if (t > 0) {
    return {
      toda: Math.max(props.toda || props.tora, props.tora, props.asda ?? 0, props.lda),
      tora: props.tora,
      lda: props.lda,
      asda: props.asda ?? props.tora,
    };
  }
  // Schematic fallback
  return { toda: 1200, tora: 900, lda: 750, asda: 1000 };
});

const scale = computed(() => DRAW_W / base.value.toda);

const xTora = computed(() => LEFT + base.value.tora * scale.value);
const xAsda = computed(() => LEFT + base.value.asda * scale.value);
const xToda = computed(() => LEFT + base.value.toda * scale.value);
const xLdaStart = computed(() => LEFT + (base.value.tora - base.value.lda) * scale.value);
</script>
