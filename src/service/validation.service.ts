/**
 * Validation Service
 * Provides common validation utilities across the application
 */
export class ValidationService {
  /**
   * Validate numeric input
   * @param value - Value to validate
   * @param min - Minimum allowed value (optional)
   * @param max - Maximum allowed value (optional)
   * @returns True if valid number within range
   */
  static isValidNumber(
    value: number, 
    min?: number, 
    max?: number
  ): boolean {
    if (isNaN(value) || !isFinite(value)) {
      return false;
    }
    
    if (min !== undefined && value < min) {
      return false;
    }
    
    if (max !== undefined && value > max) {
      return false;
    }
    
    return true;
  }

  /**
   * Validate percentage value (0-100+)
   * @param value - Percentage value to validate
   * @param allowOver100 - Whether to allow values over 100%
   * @returns True if valid percentage
   */
  static isValidPercentage(value: number, allowOver100: boolean = true): boolean {
    const max = allowOver100 ? undefined : 100;
    return this.isValidNumber(value, 0, max);
  }

  /**
   * Validate direction/heading (0-360 degrees)
   * @param degrees - Direction in degrees
   * @returns True if valid direction
   */
  static isValidDirection(degrees: number): boolean {
    return this.isValidNumber(degrees, 0, 360);
  }

  /**
   * Validate altitude
   * @param altitude - Altitude in feet
   * @param maxAltitude - Maximum allowed altitude (optional)
   * @returns True if valid altitude
   */
  static isValidAltitude(altitude: number, maxAltitude?: number): boolean {
    return this.isValidNumber(altitude, -1000, maxAltitude);
  }

  /**
   * Validate speed
   * @param speed - Speed in knots
   * @param maxSpeed - Maximum allowed speed (optional)
   * @returns True if valid speed
   */
  static isValidSpeed(speed: number, maxSpeed?: number): boolean {
    return this.isValidNumber(speed, 0, maxSpeed);
  }

  /**
   * Validate temperature
   * @param temperature - Temperature in Celsius
   * @returns True if valid temperature
   */
  static isValidTemperature(temperature: number): boolean {
    return this.isValidNumber(temperature, -100, 100);
  }

  /**
   * Validate runway length
   * @param length - Runway length in feet
   * @returns True if valid runway length
   */
  static isValidRunwayLength(length: number): boolean {
    return this.isValidNumber(length, 500, 20000);
  }

  /**
   * Validate configuration name
   * @param name - Configuration name to validate
   * @returns True if valid name
   */
  static isValidConfigurationName(name: string): boolean {
    if (!name || typeof name !== 'string') {
      return false;
    }
    
    const trimmed = name.trim();
    return trimmed.length > 0 && trimmed.length <= 50;
  }

  /**
   * Validate QNH value based on unit
   * @param value - QNH value
   * @param isInHg - True if value is in inches of mercury, false if hPa
   * @returns True if valid QNH value
   */
  static isValidQnh(value: number, isInHg: boolean): boolean {
    if (isInHg) {
      return this.isValidNumber(value, 28.0, 31.5);
    } else {
      return this.isValidNumber(value, 950, 1050);
    }
  }

  /**
   * Sanitize numeric input
   * @param value - Raw input value
   * @param defaultValue - Default value if invalid
   * @param min - Minimum allowed value
   * @param max - Maximum allowed value
   * @returns Sanitized number
   */
  static sanitizeNumber(
    value: unknown,
    defaultValue: number,
    min?: number,
    max?: number
  ): number {
    const numValue = Number(value);
    
    if (!this.isValidNumber(numValue, min, max)) {
      return defaultValue;
    }
    
    return numValue;
  }

  /**
   * Sanitize string input
   * @param value - Raw input value
   * @param defaultValue - Default value if invalid
   * @param maxLength - Maximum string length
   * @returns Sanitized string
   */
  static sanitizeString(
    value: unknown,
    defaultValue: string,
    maxLength?: number
  ): string {
    if (typeof value !== 'string') {
      return defaultValue;
    }
    
    const trimmed = value.trim();
    
    if (trimmed.length === 0) {
      return defaultValue;
    }
    
    if (maxLength && trimmed.length > maxLength) {
      return trimmed.substring(0, maxLength);
    }
    
    return trimmed;
  }
}