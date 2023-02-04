<template>
  <q-select
    dense
    use-input
    input-debounce="0"
    v-model="model"
    :options="options"
    @update:model-value="(val) => itemSelected(pylonNum, val)"
    emit-value
    @filter="filterFn"
  >
  </q-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IAircraftStore } from './models';
import { aircraftStores, emptyLoad } from '../data/A10C';

const props = defineProps({
  pylonNum: { type: Number, required: true, default: 1 },
  val: String,
  pylon: { required: true, default: { ...emptyLoad } as IAircraftStore },
  itemSelected: { required: true },
});

const weapons = aircraftStores.filter(
  (s) => s.availableOn?.indexOf(props.pylonNum + 1) !== -1
) as IAircraftStore[];

const model = ref(props.pylon);
let options = ref(weapons);

function filterFn(val, update) {
  if (val === '') {
    update(() => (options.value = weapons));
    return;
  }
  update(() => {
    const needle = val.toLowerCase();

    options.value = weapons.filter(
      (w) => w.label.toLocaleLowerCase().indexOf(needle) > -1
    );
  });
}
</script>
