import { Theme } from '../constants/theme';

export const themeMap: Record<Theme, Record<string, string>> = {
  [Theme.Fall]: {
    '--q-primary': '#f4e7e1',
    '--q-secondary': '#ff9b45',
    '--q-accent': '#d5451b',
    '--q-dark': '#521c0d',
  },
  [Theme.Winter]: {
    '--q-primary': '#d1e8ff',
    '--q-secondary': '#94b8ff',
    '--q-accent': '#5585c1',
    '--q-dark': '#001f3f',
  },
  [Theme.Spring]: {
    '--q-primary': '#e4f5dc',
    '--q-secondary': '#8fcc6d',
    '--q-accent': '#56ab2f',
    '--q-dark': '#2d572c',
  },
  [Theme.Summer]: {
    '--q-primary': '#ffe8c2',
    '--q-secondary': '#ff9e4a',
    '--q-accent': '#f95d2c',
    '--q-dark': '#6b2c12',
  },
};

export const syncThemeGlobals = (themeName: Theme) => {
  const root = document.documentElement;
  const themeVars = themeMap[themeName];

  Object.entries(themeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
