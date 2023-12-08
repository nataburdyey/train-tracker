export const CACHE_TIME = 1000 * 60 * 2; // 2 minutes
export const AUTO_REFRESH_TIME = 1000 * 60 * 2; // 2 minutes

export const lineColors = {
  RD: '#ff9999',
  BL: '#99ccff',
  YL: '#ffff99',
  OR: '#ffcc99',
  GR: '#99ff99',
  SV: '#f2f2f2',
};

export const aliases = {
  CarCount: {
    '(blank)': '0',
  },
  DirectionNum: {
    1: 'Northbound',
    2: 'Southbound',
  },
  LineCode: {
    RD: 'Red',
    BL: 'Blue',
    YL: 'Yellow',
    OR: 'Orange',
    GR: 'Green',
    SV: 'Silver',
  },
  ServiceType: {
    NoPassengers: 'No Passengers',
    Normal: 'Normal',
    Unknown: 'Unknown',
  },
};
