import {
  CorrectionVector,
  CorrectionTable,
  DragCorrectionTable,
} from '../CorrectionTable.js';

export const combatFuelFlow = (
  indicatedAirSpeed: number,
  pressureAltitude: number,
  deltaTemp: number,
): number => {
  return Math.max(
    0,
    CombatFF_Std_Day_linear.getLinear(
      deltaTemp,
      pressureAltitude,
      indicatedAirSpeed,
    ),
  );
};

const CombatFF_Std_Day = new CorrectionTable(
  'Combat Fuel Flow Standard Day',
  new Map([
    [0, new CorrectionVector([7113, -4.63, 0.0168])],
    [5000, new CorrectionVector([5981, -0.414, 0.00661])],
    [10000, new CorrectionVector([5275, -0.595, 0.00762])],
    [15000, new CorrectionVector([4375, 0.884, 0.00586])],
    [20000, new CorrectionVector([3613, 1.26, 0.00621])],
    [25000, new CorrectionVector([3010, 1.99, 0.00429])],
    [30000, new CorrectionVector([2498, 1.55, 0.005])],
    [35000, new CorrectionVector([1800, 4, 0])],
  ]),
);

const CombatFF_Std_Minus20 = new CorrectionTable(
  'Combat Fuel Flow STD Day -20°C',
  new Map([
    [0, new CorrectionVector([7186, 5.91, -0.00996])],
    [2000, new CorrectionVector([7141, 2.46, -0.00147])],
    [5000, new CorrectionVector([6687, -0.573, 0.00814])],
    [10000, new CorrectionVector([5742, 0.375, 0.00689])],
    [15000, new CorrectionVector([4654, 1.94, 0.0062])],
    [20000, new CorrectionVector([3702, 2.37, 0.00696])],
    [25000, new CorrectionVector([3050, 1.97, 0.00857])],
    [30000, new CorrectionVector([2054, 4.68, 0.0025])],
    [35000, new CorrectionVector([1268, 8.65, -0.005])],
  ]),
);

const CombatFF_Std_Day_plus20 = new CorrectionTable(
  'Combat Fuel Flow STD Day +20°C',
  new Map([
    [0, new CorrectionVector([5974, -0.145, 0.00409])],
    [5000, new CorrectionVector([5190, 0.686, 0.00347])],
    [10000, new CorrectionVector([4492, 1.25, 0.00307])],
    [15000, new CorrectionVector([3899, 0.469, 0.00589])],
    [20000, new CorrectionVector([3440, 0.586, 0.00429])],
    [25000, new CorrectionVector([2920, 0.179, 0.00643])],
    [30000, new CorrectionVector([2009, 5.58, -0.0075])],
    [35000, new CorrectionVector([2095, -0.9, 0.01])],
  ]),
);

const CombatFF_Std_Day_linear = new DragCorrectionTable(
  'Combat Fuel Flow Standard Day',
  new Map([
    [-20, CombatFF_Std_Minus20],
    [0, CombatFF_Std_Day],
    [20, CombatFF_Std_Day_plus20],
  ]),
);
