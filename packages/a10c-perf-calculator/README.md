# A-10C Performance Calculator

A TypeScript module for calculating A-10C aircraft performance metrics including takeoff, landing, climb, cruise, descent, and combat performance.

## Installation

```bash
npm install a10c-perf-calculator
```

## Usage

```typescript
import {
  TakeoffIndexCalculator,
  TakeoffSpeed,
  GroundRun,
} from 'a10c-perf-calculator';

// Example usage
const calculator = new TakeoffIndexCalculator(/* parameters */);
const result = calculator.Calc(/* parameters */);
```

## Features

- **Takeoff Performance**: Ground run, takeoff speed, obstacle clearance, critical field length
- **Landing Performance**: Landing distance calculations with RCR support
- **Climb Performance**: Time, distance, and fuel calculations
- **Cruise Performance**: Fuel flow and optimal altitude calculations
- **Descent Performance**: Penetration descent and maximum range
- **Combat Performance**: Combat ceiling and fuel flow

## API Documentation

[API documentation will be generated from TypeScript definitions]

## License

MIT
