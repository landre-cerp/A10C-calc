import {
  BasicConfiguration,
  EmptyConfiguration,
  Hog01,
  Hog02,
} from './../data/StoresConfig';
import { emptyLoad } from './../data/A10C';
import { IAircraftStore, StoresConfiguration } from './../components/models';

import { defineStore } from 'pinia';

const conf01 = { ...Hog01 };

const availableConfigurations = [
  EmptyConfiguration,
  Hog01,
  Hog02,
  BasicConfiguration,
];

const defaultState = {
  configuration: { ...conf01 },

  fuelQty: 75 as number,
  gunAmmoPercent: 100 as number,
  flaps: 7 as number,
  taxiFuel: 100 as number,
};

export const useA10CStore = defineStore('a10c', {
  state: () => ({ ...defaultState }),
  getters: {
    // Load
    Pylons(): StoresConfiguration['pylonsLoad'] {
      return this.configuration.pylonsLoad;
    },

    // Drag coeff for the Load
    Drag(): number {
      if (!this.configuration.pylonsLoad) return 0;

      return this.configuration.pylonsLoad.reduce(
        (total, current) => total + current.drag,
        0
      );
    },

    AvailableConfigurations() {
      return availableConfigurations;
    },

    // Weigth Section
    WeaponWeight(): number {
      if (!this.configuration.pylonsLoad) return 0;
      const weigth = this.configuration.pylonsLoad.reduce(
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
        this.configuration.pylonsLoad[pylon] = store;
      }
    },

    loadConfiguration(config: StoresConfiguration) {
      const pylonConf = [] as unknown as StoresConfiguration['pylonsLoad'];

      pylonConf.push(...config.pylonsLoad);
      this.configuration.pylonsLoad = [...pylonConf];
      this.configuration.name = config.name;
    },

    ResetToDefault() {
      const pylonConf = [] as unknown as StoresConfiguration['pylonsLoad'];
      const currentDefault = availableConfigurations.find(
        (conf) => conf.name === this.configuration.name
      );

      if (currentDefault) {
        for (let index = 0; index < currentDefault.pylonsLoad.length; index++) {
          pylonConf.push({ ...currentDefault.pylonsLoad[index] });
        }
        this.configuration.pylonsLoad = [...pylonConf];
      }
    },

    ResetPylon(pylon: number) {
      const pylonConf = [] as unknown as StoresConfiguration['pylonsLoad'];
      for (
        let index = 0;
        index < this.configuration.pylonsLoad.length;
        index++
      ) {
        if (index == pylon) {
          pylonConf.push({ ...emptyLoad });
        } else {
          pylonConf.push({ ...this.configuration.pylonsLoad[index] });
        }
      }
      this.configuration.pylonsLoad = [...pylonConf];
    },
  },
});
