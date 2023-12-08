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

export const getInitialDarkMode = () => {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme:dark)"
  ).matches;
  const storedDarkMode = localStorage.getItem("darkTheme") === "true";
  return storedDarkMode || prefersDarkMode;
};
