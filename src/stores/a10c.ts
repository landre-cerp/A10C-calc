import {
  emptyLoad,
  AIM9M,
  ALQ184,
  TGP,
  LAU88_D_AGM65D,
  CBU_105,
  GBU_12,
  GBU_54,
  M151_APKWS,
} from './../data/A10C';
import { IAircraftStore } from './../components/models';

import { defineStore } from 'pinia';

const defaultState = {
  pylonsLoad: [
    { ...AIM9M },
    { ...TGP },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...ALQ184 },
  ] as IAircraftStore[],

  fuelQty: 75 as number,
  gunAmmoPercent: 100 as number,
  flaps: 7 as number,
  taxiFuel: 300 as number,
};

export const useA10CStore = defineStore('a10c', {
  state: () => ({ ...defaultState }),
  getters: {
    // Load
    Pylons(): IAircraftStore[] | null {
      return this.pylonsLoad;
    },

    // Drag coeff for the Load
    Drag(): number {
      if (!this.pylonsLoad) return 0;

      return this.pylonsLoad.reduce(
        (total, current) => total + current.drag,
        0
      );
    },

    // Weigth Section
    WeaponWeight(): number {
      if (!this.pylonsLoad) return 0;
      const weigth = this.pylonsLoad.reduce(
        (total, current) => total + current.weight,
        0
      );

      return weigth;
    },
    // Weigth Section

    FuelWeight(): number {
      if (this.fuelQty <= 100) {
        return this.fuelQty * 110.87;
      } else {
        return 11087;
      }
    },
    AmmoWeight(): number {
      if (this.gunAmmoPercent <= 100) {
        return this.gunAmmoPercent * 17.75;
      } else {
        return 1775;
      }
    },

    TotalWeight(): number {
      return (
        this.ZeroFuelWeight +
        this.WeaponWeight +
        this.FuelWeight +
        this.AmmoWeight
      );
    },

    TakeOffWeight(): number {
      return this.TotalWeight - this.taxiFuel;
    },

    ZeroFuelWeight(): number {
      return 25629;
    },

    MaxTakeOffWeight(): number {
      return 46476;
    },

    OverWeight(): boolean {
      return this.TotalWeight > this.MaxTakeOffWeight;
    },
  },

  actions: {
    setPylon(pylon: number, store: IAircraftStore) {
      if (pylon >= 0 && pylon <= 10) {
        this.pylonsLoad[pylon] = store;
      }
    },

    EmptyAllPylons() {
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

    ResetAllPylons() {
      this.pylonsLoad = [
        { ...AIM9M },
        { ...TGP },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...emptyLoad },
        { ...ALQ184 },
      ];
    },

    loadHogDefault() {
      this.pylonsLoad = [
        { ...AIM9M },
        { ...TGP },
        { ...LAU88_D_AGM65D },
        { ...GBU_54 },
        { ...CBU_105 },
        { ...GBU_12 },
        { ...CBU_105 },
        { ...GBU_54 },
        { ...LAU88_D_AGM65D },
        { ...M151_APKWS },
        { ...ALQ184 },
      ];
    },

    ResetPylon(pylon: number) {
      const pylonConf = [];
      for (let index = 0; index < this.pylonsLoad.length; index++) {
        if (index == pylon) {
          pylonConf.push({ ...emptyLoad });
        } else {
          pylonConf.push({ ...this.pylonsLoad[index] });
        }
      }
      this.pylonsLoad = [...pylonConf];
    },
  },
});
