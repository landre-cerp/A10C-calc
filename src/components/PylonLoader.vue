<template>
  <q-select
    use-input
    dense
    input-debounce="0"
    v-model="pylonVm"
    option-label="short"
    :label="pylon.weight + ' lbs ' + $t('drag') + ': ' + pylon.drag"
    :options="options"
    @filter="filterFn"
    :disable="props.locked"
    clearable
    filled
    hide-dropdown-icon
    @update:model-value="emit('item-selected', pylonVm)"
    @clear="emit('item-cleared')"
  >
  </q-select>
</template>

<script setup lang="ts">
import { onUpdated, PropType, ref } from 'vue';
import { IAircraftStore } from './models';
import { emptyLoad } from '../data/A10C';

const emit = defineEmits(['item-selected', 'item-cleared']);

const props = defineProps({
  pylon: {
    required: true,
    type: Object as PropType<IAircraftStore>,
    default: { ...emptyLoad } as IAircraftStore,
  },
  availableStores: {
    required: true,
    type: Array as PropType<IAircraftStore[]>,
  },
  empty: { required: true, type: Object as PropType<IAircraftStore> },
  locked: Boolean,
});

const pylonVm = ref(props.pylon);
let options = ref(props.availableStores);

onUpdated(() => {
  pylonVm.value = props.pylon;
});

type updateFn = (fn: () => void) => void;

function filterFn(val: string, update: updateFn): void {
  if (val === '') {
    update(() => (options.value = props.availableStores));
    return;
  }
  update(() => {
    const needle = val.toLowerCase();

    options.value = props.availableStores.filter((w) =>
      w.label.toLocaleLowerCase().includes(needle),
    );
  });
}
</script>
