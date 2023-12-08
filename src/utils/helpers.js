import { lineColors, aliases } from './constants';

export const getLineColor = (lineCode) => {
  return lineColors[lineCode] || '#ffffff';
};

export const getUniqueValues = (data, key) => {
  let unique = data.map((item) => item[key]);

  return [...new Set(unique)];
};

export const getAliases = (key, value) => {
  return aliases?.[key]?.[value] || value;
};
