import { Wind } from '../../../service/Wind';
import { CorrectionTable, CorrectionVector, PosNegCorrectionTable } from '../CorrectionTable';
import { RCR } from '../Rcr';

export interface ILandingConfiguration {
  weight: number;
  flaps: number;
  minspeed: boolean;
  singleEngine: boolean;
  speedbrakes: boolean;

  altitude: number;
  temperature: number;

  wind: Wind
  runwayCourse: number;
  rcr: RCR,
}

export const ApproachSpeed = (landingConfig: ILandingConfiguration) => {

  if (landingConfig.singleEngine) {
    return SingleEngineApproachSpeed(landingConfig.weight);
  }

  if (landingConfig.minspeed) {
    return ApproachMinSpeed(landingConfig.weight);
  }

  switch (landingConfig.flaps) {
    case 7:
      return 70 + 0.002 * landingConfig.weight;
    case 20:
      return 60 + 0.002 * landingConfig.weight;
    default:
      return 0;
  }
}

export const ApproachMinSpeed = (weight: number) => {
  return 50 + 0.002 * weight;
}

export const SingleEngineApproachSpeed = (weight: number) => {
  return 120 + 0.001 * weight;
}

export const TouchdownSpeed = (landingConfig: ILandingConfiguration) => {
  return landingConfig.minspeed ?
    ApproachSpeed(landingConfig) : ApproachSpeed(landingConfig) - 10;
}


export const LandingIndex = (landingConfig: ILandingConfiguration) => {
  return Math.ceil(10 * vector_landingIndex.GetLinear(landingConfig.altitude, landingConfig.temperature)) / 10;
}

export const LandingGroundRoll = (landingConfig: ILandingConfiguration) => {

  let groundRoll = 0;

  if (landingConfig.speedbrakes) {

    groundRoll = vector_landing_distance_flaps20_SB100.GetLinear(landingConfig.weight,
      LandingIndex(landingConfig));
  }
  else {
    groundRoll = vector_landing_distance_flaps20_SB0.GetLinear(landingConfig.weight,
      LandingIndex(landingConfig));
  }
  // Adjust for wind
  const wind = landingConfig.wind.RelativeHeadwind(landingConfig.runwayCourse);

  // Positive wind is a headwind
  // Negative wind is a tailwind
  if (wind != 0) {

    groundRoll = headwind_landing_distance_flaps20.GetLinear(groundRoll, wind);
  }

  groundRoll = RCR_landing_distance_flaps20.GetLinear(groundRoll, landingConfig.rcr);

  if (landingConfig.minspeed) {
    // Chart A8-5 , flaps 20 , 100% speedbrakes
    if (landingConfig.speedbrakes) {
      groundRoll = groundRoll - 180;
    }
    else {
      groundRoll = groundRoll - 250;
    }
  }
  return groundRoll;
}

// Pressure altitude is the altitude above sea level, adjusted for the local atmospheric pressure.

const vector_landingIndex = new CorrectionTable(
  'Landing Index', new Map([
    [0, new CorrectionVector([106, -0.389, 0.00128])],
    [2000, new CorrectionVector([98.2, -0.359, 1.17E-03])],
    [4000, new CorrectionVector([91, -0.342, 1.29E-03])],
    [6000, new CorrectionVector([84.5, -0.316, 0.00114])],
  ])
)

const vector_landing_distance_flaps20_SB100 = new CorrectionTable(
  'Landing Distance Flaps 20', new Map([
    [25000, new CorrectionVector([2120, -16.2, 0.0589])],
    [30000, new CorrectionVector([2455, -20.2, 0.0732])],
    [35000, new CorrectionVector([2695, -22.5, 0.0804])],
    [40000, new CorrectionVector([2939, -24.3, 0.0839])],
    [45000, new CorrectionVector([3246, -27, 0.0893])],
    [50000, new CorrectionVector([3431, -27.3, 0.0866])]]
  )
)

const vector_landing_distance_flaps20_SB0 = new CorrectionTable(
  'Landing Distance Flaps 20', new Map([
    [25000, new CorrectionVector([3500, -28.4, 0.0804])],
    [30000, new CorrectionVector([3836, -29.8, 0.0804])],
    [35000, new CorrectionVector([5050, -49.1, 0.17])],
    [40000, new CorrectionVector([6300, -67.5, 0.25])],
    [45000, new CorrectionVector([6474, -61.2, 0.196])],
    [50000, new CorrectionVector([7816, -81.7, 0.295])],
  ])
)

const RCR_landing_distance_flaps20 = new CorrectionTable(
  'RCR Landing Distance Flaps 20', new Map([
    [250, new CorrectionVector([440, -6.33, -0.4, 0.0133])],
    [500, new CorrectionVector([875, -10.8, -1, 0.0333])],
    [750, new CorrectionVector([2150, -85, 1, 0])],
    [1000, new CorrectionVector([4450, -300, 11, -0.2])],
    [1250, new CorrectionVector([6050, -400, 13, -0.2])],
    [1500, new CorrectionVector([8000, -580, 22, -0.4])],
    [1750, new CorrectionVector([9600, -707, 28, -0.533])],
    [2000, new CorrectionVector([11650, -905, 39, -0.8])],
    [2500, new CorrectionVector([12050, -483, 0, 0.133])],
    [3000, new CorrectionVector([13200, -450, 0, 0])],
    [3500, new CorrectionVector([16150, -560, 0, 0])]
  ])
)


const headwind_landing_distance_flaps20 = new PosNegCorrectionTable(
  'Headwind Landing Distance Flaps 20',
  new CorrectionTable('Headwind Landing Distance Flaps 20',
    new Map([

      [1000, new CorrectionVector([1000, -20, 0])],
      [1500, new CorrectionVector([1488, -17.3, -0.125])],
      [2000, new CorrectionVector([2028, -23, -0.025])],
      [2500, new CorrectionVector([2488, -22.3, -0.125])],
      [3000, new CorrectionVector([3013, -25.3, -0.125])],
      [3500, new CorrectionVector([3425, -20.5, -0.25])],
      [4000, new CorrectionVector([3925, -20.5, -0.25])]
    ])
  ),
  new CorrectionTable('Tailwind Landing Distance Flaps 20',
    new Map([
      [1000, new CorrectionVector([1000, -30])],
      [1500, new CorrectionVector([1500, -35])],
      [2000, new CorrectionVector([2000, -40])],
      [2500, new CorrectionVector([2500, -40])],
      [3000, new CorrectionVector([3000, -50])],
      [3500, new CorrectionVector([3500, -55])],
      [4000, new CorrectionVector([4000, -60])]
    ])
  )
)









