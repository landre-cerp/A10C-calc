import { IAircraftStore, StoresConfiguration } from 'src/components/models';
import { emptyLoad } from 'src/data/A10C';
import { BasicConfiguration, EmptyConfiguration } from 'src/data/StoresConfig';
import { StorageService } from './storage.service';

/**
 * Aircraft Configuration Service
 * Handles business logic for aircraft loadout configurations
 */
export class AircraftConfigurationService {
  private static readonly EMPTY_CONFIGURATION: StoresConfiguration = {
    ...EmptyConfiguration,
    name: 'Empty',
  };

  private static readonly BASIC_CONFIGURATION: StoresConfiguration = {
    ...BasicConfiguration,
  };

  /**
   * Get all available configurations including defaults and stored ones
   * @returns Array of all available configurations
   */
  static getAvailableConfigurations(): StoresConfiguration[] {
    const storedConfigurations = StorageService.getStoredConfigurations();
    
    if (storedConfigurations.length === 0) {
      return [this.EMPTY_CONFIGURATION, this.BASIC_CONFIGURATION];
    }
    
    return storedConfigurations;
  }

  /**
   * Create a deep copy of a configuration for safe modification
   * @param config - Configuration to clone
   * @returns Deep cloned configuration
   */
  static cloneConfiguration(config: StoresConfiguration): StoresConfiguration {
    return {
      name: config.name,
      pylonsLoad: config.pylonsLoad.map(pylon => ({ ...pylon })),
    };
  }

  /**
   * Validate pylon index
   * @param pylonIndex - Index to validate
   * @returns True if valid pylon index
   */
  static isValidPylonIndex(pylonIndex: number): boolean {
    return pylonIndex >= 0 && pylonIndex <= 10;
  }

  /**
   * Calculate total weapon weight from pylons
   * @param pylonsLoad - Array of pylon loads
   * @returns Total weapon weight in pounds
   */
  static calculateWeaponWeight(pylonsLoad: IAircraftStore[]): number {
    return pylonsLoad.reduce((total, pylon) => total + pylon.weight, 0);
  }

  /**
   * Calculate total drag coefficient from pylons
   * @param pylonsLoad - Array of pylon loads
   * @returns Total drag coefficient
   */
  static calculateDragCoefficient(pylonsLoad: IAircraftStore[]): number {
    return pylonsLoad.reduce((total, pylon) => total + pylon.drag, 0);
  }

  /**
   * Create an empty pylon load
   * @returns Empty pylon load configuration
   */
  static createEmptyPylon(): IAircraftStore {
    return { ...emptyLoad };
  }

  /**
   * Save a configuration with validation
   * @param name - Name for the configuration
   * @param pylonsLoad - Pylon configuration to save
   * @throws Error if configuration is invalid
   */
  static saveConfiguration(name: string, pylonsLoad: IAircraftStore[]): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Configuration name cannot be empty');
    }

    if (!pylonsLoad || pylonsLoad.length !== 11) {
      throw new Error('Invalid pylon configuration: must have 11 pylons');
    }

    const configToSave: StoresConfiguration = {
      name: name.trim(),
      pylonsLoad: pylonsLoad.map(pylon => ({ ...pylon })),
    };

    StorageService.saveConfiguration(configToSave);
  }

  /**
   * Delete a configuration by name
   * @param name - Name of configuration to delete
   */
  static deleteConfiguration(name: string): void {
    StorageService.removeConfiguration(name);
  }
}