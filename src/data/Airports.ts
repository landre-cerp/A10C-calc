export interface EntryPoints {
  name: string;
  TORA: number;
  TODA: number;
  ASDA: number;
  LDA: number;
}

export interface Runway {
  name: string;
  QFU: number;
  entries: EntryPoints[];
}

export interface Airport {
  code: string;
  name: string;
  elevation: number;
  runways: Runway[];
}

export const Airports = [
  {
    code: 'URKH',
    name: 'Maykop-Khanskaya',
    elevation: 51,
    QFU: 32,
    runways: [
      {
        name: '04',
        entries: [
          { name: 'full', TORA: 10495, TODA: 10495, ASDA: 10495, LDA: 10495 },
          { name: 'B', TORA: 8300, TODA: 8300, ASDA: 8300, LDA: 8300 },
          { name: 'C', TORA: 3930, TODA: 3930, ASDA: 3930, LDA: 3930 },
          { name: 'D', TORA: 1750, TODA: 1750, ASDA: 1750, LDA: 1750 },
        ],
      },
      {
        name: '22',
        entries: [
          { name: 'full', TORA: 10495, TODA: 10495, ASDA: 10495, LDA: 10495 },
          { name: 'D', TORA: 8750, TODA: 8750, ASDA: 8750, LDA: 8750 },
          { name: 'C', TORA: 6900, TODA: 6900, ASDA: 6900, LDA: 6900 },
          { name: 'B', TORA: 2125, TODA: 2125, ASDA: 2125, LDA: 2125 },
        ],
      },
    ],
  },
];
