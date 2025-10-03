# A10CCalc

[![Version](https://img.shields.io/badge/version-1.3.13-blue.svg)](https://github.com/Cerppo/A10C-calc)
[![License](https://img.shields.io/badge/license-private-red.svg)](LICENSE)
[![Quasar](https://img.shields.io/badge/Quasar-Framework-1976D2.svg)](https://quasar.dev/)

A performance calculator for the DCS A-10C II aircraft, built with Vue.js and Quasar Framework.

## 🚨 Important Notice

**This calculator is intended for DCS simulation use only. Do not use for real aircraft operations.**

## 📖 Overview

A10CCalc is a desktop application (electron build) or web application that provides performance calculations for the DCS A-10C II aircraft. 
It helps pilots plan their missions with relatively accurate weight and balance, takeoff and landing performance, and flight planning calculations based on real A-10 performance charts and DCS-specific data.

## ✨ Features

### Aircraft Configuration

- **Weight & Balance**: Real-time aircraft weight calculations including empty weight, fuel, weapons, and ammunition
- **Loadout Management**: Visual pylon loader with drag coefficient calculations
- **Fuel Planning**: Percentage-based fuel loading with weight conversions

### Environmental Factors

- **Weather Integration**:
  - Wind component calculations (headwind/crosswind)
  - Temperature and pressure altitude effects
  - Runway Condition Rating (RCR) support

- **Airport Parameters**:
  - Elevation and pressure altitude calculations
  - QNH/altimeter settings
  - Runway direction (QFU) configuration
  - Multiple runway condition types (dry, wet, icy)

### Flight Planning

- **Multi-Phase Flight Planning**:
  - Takeoff phase with taxi fuel
  - Climb calculations (time, fuel, distance)
  - Cruise phase planning
  - Descent calculations
  - Landing phase

- **Mission Range**: Automated range calculations based on flight profile
- **Fuel Consumption**: Phase-by-phase fuel burn calculations

### Additional Features

- **DCS Integration**: TCP server for DCS World connectivity ( electron version - WIP ) 
- **Briefing Cards**: Mission briefing export with kneeboard-style formatting
- **Multi-Language Support**: English and French interfaces
- **Data Export**: Save briefing cards as images
- **Visual Wind Display**: Runway wind component visualization

## 🛠️ Technology Stack

- **Framework**: [Quasar Framework](https://quasar.dev/) (Vue.js 3)
- **Language**: TypeScript
- **State Management**: Pinia
- **Internationalization**: Vue I18n
- **Testing**: Cypress (E2E and Component)
- **Build Tools**: Vite, ESBuild
- **Deployment**: Electron (Desktop app)
- **Styling**: SCSS with Quasar components

## 🚀 Getting Started

### Prerequisites

- Node.js (v20, v21, or v22)
- npm (>= 6.13.4) or yarn (>= 1.21.1)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Cerppo/A10C-calc.git
cd A10C-calc
```

2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run start
# or
quasar dev -m electron
```

For web development mode:

```bash
quasar dev
```

### Building

Build for production:

```bash
npm run build
# or
quasar build -m electron
```

### Code Quality

Lint the code:

```bash
npm run lint
```

Format the code:

```bash
npm run format
```

### Testing

Run E2E tests:

```bash
npm run test:e2e
```

Run component tests:

```bash
npm run test:component
```

## 📱 Application Structure

The application is organized into several main sections:

1. **Load Page** (`/Load`): Aircraft configuration, weight & balance, loadout management
2. **Takeoff Page** (`/TakeOff`): Takeoff performance calculations and airport parameters
3. **Flight Page** (`/Flight`): Multi-phase flight planning and range calculations
4. **Landing Page** (`/Landing`): Landing performance and approach calculations
5. **Brief Page** (`/Brief`): Mission briefing summary and export
6. **DCS Connect** (`/Dcs`): DCS World integration setup
7. **About** (`/About`): Application information and credits

## 🔧 Configuration

The application uses several configuration files:

- `quasar.config.js`: Quasar framework configuration
- `tsconfig.json`: TypeScript compiler configuration
- `eslint.config.js`: ESLint linting rules
- `cypress.config.js`: Cypress testing configuration

## 📊 Performance Data

Calculations are based on:

- Historical A-10A performance charts
- DCS community-validated performance data
- Real-world flight manual procedures adapted for DCS

**Note**: Some drag coefficients and performance factors are approximated for DCS-specific conditions.

## 🤝 Contributing

This project was created as a learning exercise with the Quasar framework and to support the 06MHR A-10C community.

## 📄 License

This project is private and proprietary.

## 🔗 Related Links

- [Quasar Framework Documentation](https://quasar.dev/)
- [06MHR Discord Community](https://discord.gg/jgENU4e7eS)
- [DCS World](https://www.digitalcombatsimulator.com/)

# Screenshots 
Running on https://cerpposerverlessys48b7m8-pre-a10c-cal.functions.fnc.fr-par.scw.cloud/#/
Web version does not connect to DCS, I'm working on connecting the Electron version to DCS to get some info from the sim.

Select the loadout, ammo, fuel.
<img width="1558" height="1246" alt="image" src="https://github.com/user-attachments/assets/e863caf2-0ca0-4080-bdaf-a786e308933d" />

Calculate the performance 
<img width="1789" height="1351" alt="image" src="https://github.com/user-attachments/assets/ce566164-7a02-4a0d-a441-54bc7df49633" />

Rough estimate of phase, and fuel consumption
<img width="1789" height="1351" alt="image" src="https://github.com/user-attachments/assets/e46beadf-8e84-4d46-a0a7-d6ea740ead6b" />

Landing params
<img width="1789" height="1351" alt="image" src="https://github.com/user-attachments/assets/70eeb1b2-f1a5-4092-aa54-fb61cdc103cb" />
