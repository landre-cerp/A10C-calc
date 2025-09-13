# Improved Architecture Documentation

## Overview

This document describes the improved architecture for Pinia stores and services in the A10C Performance Calculator application.

## Key Improvements

### 1. Service Layer Architecture

#### Storage Service (`storage.service.ts`)
- Centralized localStorage operations
- Error handling and validation
- Clean abstraction for data persistence

#### Aircraft Configuration Service (`aircraft-configuration.service.ts`)
- Business logic for aircraft loadout management
- Configuration validation and cloning
- Weight and drag calculations

#### Weight Calculation Service (`weight-calculation.service.ts`)
- Standardized weight calculation utilities
- Aircraft constants in one place
- Type-safe calculation methods

#### Validation Service (`validation.service.ts`)
- Comprehensive input validation
- Sanitization utilities
- Consistent validation patterns across the app

### 2. Flight Phase Architecture

#### Flight Context System
- **FlightContext Interface**: Provides aircraft and environment data without tight coupling
- **FlightContextFactory**: Creates contexts from store state
- **FlightPhaseData Interface**: Immutable data structure for flight phases

#### Calculator Pattern
- **FlightPhaseCalculator Interface**: Contract for phase calculations
- **Specific Calculators**: TakeoffPhaseCalculator, ClimbPhaseCalculator, etc.
- **ImprovedFlightPhaseFactory**: Uses dependency injection for calculators

### 3. Store Architecture

#### Separated Stores
- `takeoff.ts` - Takeoff-specific airport conditions
- `landing.ts` - Landing-specific airport conditions
- `a10c.ts` - Aircraft configuration and weight data
- `flight.ts` - Flight planning and phase management

#### Consistent Patterns
- Validation in all input methods
- Clear separation of concerns
- Service layer integration
- Backward compatibility maintained

## Benefits

### Maintainability
- Clear separation of concerns
- Single responsibility principle
- Focused classes with well-defined purposes

### Testability
- Services can be unit tested independently
- Dependency injection allows mocking
- Pure functions for calculations

### Type Safety
- Comprehensive TypeScript interfaces
- Input validation and sanitization
- Reduced runtime errors

### Extensibility
- Easy to add new flight phase calculators
- Pluggable architecture
- Registry pattern for calculators

## Usage Examples

### Creating Flight Phases
```typescript
// Old way (tightly coupled)
const phase = new TakeOffPhase();

// New way (dependency injection)
const context = FlightContextFactory.createTakeoffContext();
const phase = ImprovedFlightPhaseFactory.createPhase(PhaseType.TAKEOFF, context);
```

### Store Operations
```typescript
// Validated input
const aircraft = useA10CStore();
aircraft.setFuelQuantity(75); // Automatically validated and sanitized

// Service integration
aircraft.saveConfiguration('My Config'); // Uses AircraftConfigurationService
```

### Configuration Management
```typescript
// Type-safe configuration operations
const configs = AircraftConfigurationService.getAvailableConfigurations();
const weight = WeightCalculationService.calculateTotalWeight(weapons, fuel, ammo);
```

## Migration Strategy

The new architecture maintains backward compatibility:
- Legacy classes and methods are preserved
- New methods are added alongside existing ones
- Gradual migration can occur component by component

## Future Improvements

1. **Logging Service**: Centralized logging and debugging
2. **Error Handling Service**: Consistent error reporting
3. **Configuration Service**: App-wide configuration management
4. **Performance Monitoring**: Track calculation performance
5. **Caching Service**: Cache expensive calculations

## File Structure

```
src/
├── stores/
│   ├── a10c.ts           # Aircraft store (improved)
│   ├── takeoff.ts        # Takeoff store (new)
│   ├── landing.ts        # Landing store (new)
│   └── flight.ts         # Flight store (improved)
├── service/
│   ├── storage.service.ts                    # Storage operations
│   ├── aircraft-configuration.service.ts     # Aircraft config logic
│   ├── weight-calculation.service.ts         # Weight calculations
│   ├── validation.service.ts                 # Input validation
│   ├── flight-context.ts                     # Flight context interfaces
│   ├── flight-context-factory.ts             # Context creation
│   ├── improved-flight-phase-factory.ts      # New factory
│   └── calculators/
│       ├── takeoff-calculator.ts             # Takeoff calculations
│       └── climb-calculator.ts               # Climb calculations
```