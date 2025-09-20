import { StoresConfiguration } from 'src/components/models';
import { AIM9M, TGP, ALQ184, emptyLoad } from './A10C';

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
