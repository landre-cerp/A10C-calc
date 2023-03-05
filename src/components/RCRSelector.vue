<template>
  <q-item-label>Runway Condition </q-item-label>

  <q-option-group
    v-model="runwayCondition"
    :options="[
      {
        label: 'Dry',
        value: RCR.DRY,
      },
      { label: 'WET', value: RCR.WET },
      { label: 'ICY', value: RCR.ICY },
    ]"
    inline
    @update:model-value="updateRcr"
  />
</template>

<script setup lang="ts">
import { RCR } from 'src/service/calculators/Rcr';
import { ref } from 'vue';

const props = defineProps<{
  rcr: RCR;
  updateRcr: (rcr: RCR) => void;
}>();

const updateRcr = (rcr: RCR) => {
  props.updateRcr(rcr);
};

const runwayCondition = ref(props.rcr);
</script>
