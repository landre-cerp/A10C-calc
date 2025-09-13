import { IAircraftStore, StoresConfiguration } from './../components/models';
import { defineStore } from 'pinia';
import { AircraftConfigurationService } from 'src/service/aircraft-configuration.service';
import { WeightCalculationService } from 'src/service/weight-calculation.service';
import { ValidationService } from 'src/service/validation.service';
import { BasicConfiguration } from './../data/StoresConfig';

const defaultState = {
  configuration: { ...BasicConfiguration },
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

    // Drag coefficient for the Load
    Drag(): number {
      return AircraftConfigurationService.calculateDragCoefficient(
        this.configuration.pylonsLoad
      );
    },

    AvailableConfigurations(): StoresConfiguration[] {
      return AircraftConfigurationService.getAvailableConfigurations();
    },

    // Weight Section
    WeaponWeight(): number {
      return AircraftConfigurationService.calculateWeaponWeight(
        this.configuration.pylonsLoad
      );
    },

    FuelWeight(): number {
      return WeightCalculationService.calculateFuelWeight(this.fuelQty);
    },

    AmmoWeight(): number {
      return WeightCalculationService.calculateAmmoWeight(this.gunAmmoPercent);
    },

    TotalWeight(): number {
      return WeightCalculationService.calculateTotalWeight(
        this.WeaponWeight,
        this.FuelWeight,
        this.AmmoWeight
      );
    },

    TakeOffWeight(): number {
      return WeightCalculationService.calculateTakeoffWeight(
        this.TotalWeight,
        this.taxiFuel
      );
    },

    EmptyWeight(): number {
      return WeightCalculationService.EMPTY_WEIGHT;
    },

    MaxTakeOffWeight(): number {
      return WeightCalculationService.MAX_TAKEOFF_WEIGHT;
    },

    MaxLandingWeight(): number {
      return WeightCalculationService.MAX_LANDING_WEIGHT;
    },

    OverWeight(): boolean {
      return WeightCalculationService.isOverweight(this.TotalWeight);
    },
  },

  actions: {
    setPylon(pylonIndex: number, store: IAircraftStore): void {
      if (AircraftConfigurationService.isValidPylonIndex(pylonIndex)) {
        this.configuration.pylonsLoad[pylonIndex] = store;
      }
    },

    loadConfiguration(config: StoresConfiguration): void {
      this.configuration = AircraftConfigurationService.cloneConfiguration(config);
    },

    resetPylon(pylonIndex: number): void {
      if (AircraftConfigurationService.isValidPylonIndex(pylonIndex)) {
        this.configuration.pylonsLoad[pylonIndex] = 
          AircraftConfigurationService.createEmptyPylon();
      }
    },

    saveConfiguration(name: string): void {
      try {
        AircraftConfigurationService.saveConfiguration(
          name,
          this.configuration.pylonsLoad
        );
      } catch (error) {
        console.error('Failed to save configuration:', error);
        throw error;
      }
    },

    deleteConfiguration(name: string): void {
      try {
        AircraftConfigurationService.deleteConfiguration(name);
      } catch (error) {
        console.error('Failed to delete configuration:', error);
        throw error;
      }
    },

    /**
     * Validate and set fuel quantity
     * @param fuelQty - Fuel quantity percentage
     */
    setFuelQuantity(fuelQty: number): void {
      const sanitized = ValidationService.sanitizeNumber(fuelQty, this.fuelQty, 0);
      this.fuelQty = sanitized;
    },

    /**
     * Validate and set ammo percentage
     * @param ammoPercent - Ammunition percentage
     */
    setAmmoPercentage(ammoPercent: number): void {
      const sanitized = ValidationService.sanitizeNumber(ammoPercent, this.gunAmmoPercent, 0);
      this.gunAmmoPercent = sanitized;
    },

    /**
     * Validate and set flaps setting
     * @param flaps - Flaps setting
     */
    setFlaps(flaps: number): void {
      const sanitized = ValidationService.sanitizeNumber(flaps, this.flaps, 0, 20);
      this.flaps = sanitized;
    },

    /**
     * Validate and set taxi fuel
     * @param taxiFuel - Taxi fuel consumption in pounds
     */
    setTaxiFuel(taxiFuel: number): void {
      const sanitized = ValidationService.sanitizeNumber(taxiFuel, this.taxiFuel, 0);
      this.taxiFuel = sanitized;
    },
  },
});
