const lineColors = {
  RD: '#ff9999',
  BL: '#99ccff',
  YL: '#ffff99',
  OR: '#ffcc99',
  GR: '#99ff99',
  SV: '#f2f2f2'
};
export function getLineColor(lineCode) {
  return lineColors[lineCode] || '#ffffff';
}

const directions = {
  1: 'Northbound',
  2: 'Southbound'
};

export function getDirection(directionNum) {
  return directions[directionNum] || 'Unknown';
}
  