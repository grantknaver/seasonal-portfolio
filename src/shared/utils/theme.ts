import { Theme } from '../constants/theme';

export const themeMap: Record<Theme, Record<string, string>> = {
  [Theme.Fall]: {
    '--q-primary': '#f7eddc',
    '--q-secondary': '#eac08c',
    '--q-accent': '#d98245',
    '--q-accent-deep': '#8d3a1e',
    '--q-accent-soft': 'rgba(217, 130, 69, 0.18)',
    '--q-dark': '#3b2718',
  },
  [Theme.Winter]: {
    '--q-primary': '#e3f2fd',
    '--q-secondary': '#bbdefb',
    '--q-accent': '#8ab4f8',
    '--q-accent-deep': '#0d47a1',
    '--q-accent-soft': 'rgba(138, 180, 248, 0.18)',
    '--q-dark': '#0b1f3b',
  },
  [Theme.Spring]: {
    '--q-primary': '#e8f5e9',
    '--q-secondary': '#c8e6c9',
    '--q-accent': '#79d7b0',
    '--q-accent-deep': '#00796b',
    '--q-accent-soft': 'rgba(121, 215, 176, 0.18)',
    '--q-dark': '#233129',
  },
  [Theme.Summer]: {
    '--q-primary': '#fff6cf',
    '--q-secondary': '#ffe08a',
    '--q-accent': '#2ec4d6',
    '--q-accent-deep': '#006064',
    '--q-accent-soft': 'rgba(46, 196, 214, 0.18)',
    '--q-dark': '#0d3b66',
  },
};

export const syncThemeGlobals = (themeName: Theme) => {
  const root = document.documentElement;
  const themeVars = themeMap[themeName];
  Object.entries(themeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
