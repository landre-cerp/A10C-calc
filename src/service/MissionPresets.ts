import { MissionProfile, MissionProfileBuilder } from './MissionProfileBuilder';

export const MissionPresets: MissionProfile[] = [
  new MissionProfileBuilder('CAS')
    .withTakeoff()
    .withClimb(18000)
    .withCruise(100)
    .withHiCombat(30, 4800)
    .withCruise(100)
    .withDescent(1340)
    .withLanding()
    .build(),

  new MissionProfileBuilder('Ferry')
    .withTakeoff()
    .withClimb(20000)
    .withCruise(200)
    .withDescent(1340)
    .withLanding()
    .build(),

  new MissionProfileBuilder('Strike')
    .withTakeoff()
    .withClimb(18000)
    .withCruise(100)
    .withHiCombat(15, 5200)
    .withCruise(100)
    .withDescent(1340)
    .withLanding()
    .build(),
];
