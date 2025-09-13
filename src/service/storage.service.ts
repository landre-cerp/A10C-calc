import { LocalStorage } from 'quasar';
import { StoresConfiguration } from 'src/components/models';

/**
 * Storage service to handle localStorage operations
 * Provides a clean abstraction layer for data persistence
 */
export class StorageService {
  private static readonly STORES_CONFIG_KEY = 'storesConfig';

  /**
   * Get stored configurations from localStorage
   * @returns Array of stored configurations or empty array if none exist
   */
  static getStoredConfigurations(): StoresConfiguration[] {
    try {
      const localConfigs = LocalStorage.getItem(this.STORES_CONFIG_KEY);
      if (!localConfigs) {
        return [];
      }
      
      const configurations = JSON.parse(localConfigs) as StoresConfiguration[];
      return Array.isArray(configurations) ? configurations : [];
    } catch (error) {
      console.warn('Failed to parse stored configurations:', error);
      return [];
    }
  }

  /**
   * Save configurations to localStorage
   * @param configurations - Array of configurations to save
   */
  static saveConfigurations(configurations: StoresConfiguration[]): void {
    try {
      LocalStorage.set(this.STORES_CONFIG_KEY, JSON.stringify(configurations));
    } catch (error) {
      console.error('Failed to save configurations:', error);
      throw new Error('Failed to save configurations to storage');
    }
  }

  /**
   * Remove a configuration by name
   * @param name - Name of the configuration to remove
   * @returns Updated array of configurations
   */
  static removeConfiguration(name: string): StoresConfiguration[] {
    const configurations = this.getStoredConfigurations();
    const filteredConfigurations = configurations.filter(
      (config) => config.name !== name
    );
    this.saveConfigurations(filteredConfigurations);
    return filteredConfigurations;
  }

  /**
   * Add or update a configuration
   * @param configuration - Configuration to add or update
   * @returns Updated array of configurations
   */
  static saveConfiguration(configuration: StoresConfiguration): StoresConfiguration[] {
    const configurations = this.removeConfiguration(configuration.name);
    const updatedConfigurations = [...configurations, configuration];
    this.saveConfigurations(updatedConfigurations);
    return updatedConfigurations;
  }
}