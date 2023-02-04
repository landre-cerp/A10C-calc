import { emptyLoad } from './../data/A10C';
import { IAircraftStore } from './../components/models';

import { defineStore } from 'pinia';

const defaultState = {
  pylonsLoad: [
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
  ] as IAircraftStore[] | null,
  fuelQty: 0 as number,
  gunAmmo: 0 as number,
  shaff: 0 as number,
  flare: 0 as number,
};

export const useA10CStore = defineStore('a10c', {
  state: () => ({ ...defaultState }),
  getters: {
    Pylons(): IAircraftStore[] | null {
      return this.pylonsLoad;
    },
    Weight(): number {
      if (!this.pylonsLoad) return 0;

      return this.pylonsLoad.reduce(
        (total, current) => total + current.weight,
        0
      );
    },
    Drag(): number {
      if (!this.pylonsLoad) return 0;

      return this.pylonsLoad.reduce(
        (total, current) => total + current.drag,
        0
      );
    },
  },

  actions: {
    setPylon(pylon: number, store: IAircraftStore) {
      if (pylon >= 0 && pylon <= 10) {
        this.pylonsLoad[pylon] = { ...store };
      }
    },

    ResetPylons() {
      this.pylonsLoad = [
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
      ];
    },
  },
});
