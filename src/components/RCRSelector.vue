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
    @update:model-value="(r) => emit('update-rcr', r)"
  />
</template>

<script setup lang="ts">
import { RCR } from 'src/modules/a10c/Rcr';
import { ref } from 'vue';

const props = defineProps<{
  rcr: RCR;
}>();

const emit = defineEmits(['update-rcr']);
let runwayCondition = ref(props.rcr);
</script>
