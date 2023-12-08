import { lineColors, aliases } from './constants';

export const getLineColor = (lineCode) => {
  return lineColors[lineCode] || '#ffffff';
};

export const getUniqueValues = (data, key) => {
  let unique = data.map((item) => item[key] || '(blank)');

  return [...new Set(unique)].sort();
};

export const getAliases = (key, value) => {
  return aliases?.[key]?.[value] || value;
};
