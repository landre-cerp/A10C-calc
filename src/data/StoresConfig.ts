import { StoresConfiguration } from 'src/components/models';
import {
  AIM9M,
  TGP,
  LAU88_D_AGM65D,
  GBU_54,
  M151_APKWS,
  ALQ184,
  emptyLoad,
  GBU_12,
} from './A10C';

export const Hog01: StoresConfiguration = {
  name: 'Hog 01',
  pylonsLoad: [
    { ...AIM9M },
    { ...TGP },
    { ...LAU88_D_AGM65D },
    { ...GBU_54 },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...GBU_54 },
    { ...LAU88_D_AGM65D },
    { ...M151_APKWS },
    { ...ALQ184 },
  ] as StoresConfiguration['pylonsLoad'],
};

export const Hog02: StoresConfiguration = {
  name: 'Hog 02',
  pylonsLoad: [
    { ...AIM9M },
    { ...TGP },
    { ...LAU88_D_AGM65D },
    { ...GBU_54 },
    { ...GBU_12 },
    { ...GBU_12 },
    { ...GBU_12 },
    { ...GBU_54 },
    { ...LAU88_D_AGM65D },
    { ...M151_APKWS },
    { ...ALQ184 },
  ] as StoresConfiguration['pylonsLoad'],
};
export const BasicConfiguration: StoresConfiguration = {
  name: 'Base configuration',
  pylonsLoad: [
    { ...AIM9M },
    { ...TGP },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...ALQ184 },
  ] as StoresConfiguration['pylonsLoad'],
};

export const EmptyConfiguration: StoresConfiguration = {
  name: 'Empty',
  pylonsLoad: [
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
    { ...emptyLoad },
  ] as StoresConfiguration['pylonsLoad'],
};
