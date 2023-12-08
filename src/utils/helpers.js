import { lineColors, directions, aliases } from './constants';

export function getLineColor(lineCode) {
  return lineColors[lineCode] || '#ffffff';
}

export function getDirection(directionNum) {
  return directions[directionNum] || 'Unknown';
}

export const getUniqueValues = (data, key) => {
  let unique = data.map((item) => item[key]);

  return ['all', ...new Set(unique)];
};

export const getAliases = (key, value) => {
  return aliases?.[key]?.[value] || value;
};