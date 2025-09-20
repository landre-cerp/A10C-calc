<template>
  <q-item-label>{{ $t('runway_condition.label') }} </q-item-label>

  <q-option-group
    v-model="runwayCondition"
    :options="[
      {
        label: $t('runway_condition.dry'),
        value: RCR.DRY,
      },
      { label: $t('runway_condition.wet'), value: RCR.WET },
      { label: $t('runway_condition.icy'), value: RCR.ICY },
    ]"
    inline
    @update:model-value="updateRcr"
  />
</template>

<script setup lang="ts">
import { RCR } from 'a10c-perf-calculator';
import { computed } from 'vue';

const props = defineProps<{
  rcr: RCR;
  updateRcr: (rcr: RCR) => void;
}>();

const updateRcr = (rcr: RCR) => {
  props.updateRcr(rcr);
};

let runwayCondition = computed(() => props.rcr);
</script>
