/**
 * Aircraft Weight Calculation Utilities
 * Provides standardized weight calculation functions with validation
 */
export class WeightCalculationService {
  // Aircraft constants
  static readonly EMPTY_WEIGHT = 25629; // pounds
  static readonly MAX_TAKEOFF_WEIGHT = 46476; // pounds
  static readonly MAX_LANDING_WEIGHT = 46476; // pounds
  static readonly FUEL_WEIGHT_PER_PERCENT = 110.87; // pounds per percent
  static readonly MAX_FUEL_WEIGHT = 11087; // pounds (100%)
  static readonly AMMO_WEIGHT_PER_PERCENT = 17.75; // pounds per percent
  static readonly MAX_AMMO_WEIGHT = 1775; // pounds (100%)

  /**
   * Calculate fuel weight from fuel quantity percentage
   * @param fuelPercentage - Fuel quantity as percentage (0-100+)
   * @returns Fuel weight in pounds
   */
  static calculateFuelWeight(fuelPercentage: number): number {
    if (fuelPercentage < 0) {
      return 0;
    }
    
    if (fuelPercentage <= 100) {
      return fuelPercentage * this.FUEL_WEIGHT_PER_PERCENT;
    }
    
    return this.MAX_FUEL_WEIGHT;
  }

  /**
   * Calculate ammunition weight from ammo percentage
   * @param ammoPercentage - Ammunition quantity as percentage (0-100+)
   * @returns Ammunition weight in pounds
   */
  static calculateAmmoWeight(ammoPercentage: number): number {
    if (ammoPercentage < 0) {
      return 0;
    }
    
    if (ammoPercentage <= 100) {
      return ammoPercentage * this.AMMO_WEIGHT_PER_PERCENT;
    }
    
    return this.MAX_AMMO_WEIGHT;
  }

  /**
   * Calculate total aircraft weight
   * @param weaponWeight - Weight of weapons in pounds
   * @param fuelWeight - Weight of fuel in pounds
   * @param ammoWeight - Weight of ammunition in pounds
   * @returns Total aircraft weight in pounds
   */
  static calculateTotalWeight(
    weaponWeight: number,
    fuelWeight: number,
    ammoWeight: number
  ): number {
    return this.EMPTY_WEIGHT + weaponWeight + fuelWeight + ammoWeight;
  }

  /**
   * Calculate takeoff weight (total weight minus taxi fuel)
   * @param totalWeight - Total aircraft weight in pounds
   * @param taxiFuel - Taxi fuel consumption in pounds
   * @returns Takeoff weight in pounds
   */
  static calculateTakeoffWeight(totalWeight: number, taxiFuel: number): number {
    return Math.max(0, totalWeight - taxiFuel);
  }

  /**
   * Check if aircraft is overweight for takeoff
   * @param totalWeight - Total aircraft weight in pounds
   * @returns True if aircraft exceeds maximum takeoff weight
   */
  static isOverweight(totalWeight: number): boolean {
    return totalWeight > this.MAX_TAKEOFF_WEIGHT;
  }

  /**
   * Check if aircraft is overweight for landing
   * @param weight - Aircraft weight in pounds
   * @returns True if aircraft exceeds maximum landing weight
   */
  static isOverweightForLanding(weight: number): boolean {
    return weight > this.MAX_LANDING_WEIGHT;
  }

  /**
   * Validate fuel percentage input
   * @param fuelPercentage - Fuel percentage to validate
   * @returns True if valid fuel percentage
   */
  static isValidFuelPercentage(fuelPercentage: number): boolean {
    return !isNaN(fuelPercentage) && fuelPercentage >= 0;
  }

  /**
   * Validate ammo percentage input
   * @param ammoPercentage - Ammo percentage to validate
   * @returns True if valid ammo percentage
   */
  static isValidAmmoPercentage(ammoPercentage: number): boolean {
    return !isNaN(ammoPercentage) && ammoPercentage >= 0;
  }
}