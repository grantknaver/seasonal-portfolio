import { Theme } from '../constants/theme';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
}

export const themeMap = {
  [Theme.Fall]: { primary: '#f7eddc', secondary: '#eac08c', accent: '#8d3a1e', dark: '#3b2718' },
  [Theme.Winter]: { primary: '#e3f2fd', secondary: '#bbdefb', accent: '#0d47a1', dark: '#0b1f3b' },
  [Theme.Spring]: { primary: '#e8f5e9', secondary: '#c8e6c9', accent: '#00796b', dark: '#233129' },
  [Theme.Summer]: { primary: '#fff9c4', secondary: '#ffe082', accent: '#006064', dark: '#0d3b66' },
} as const satisfies Record<Theme, ThemeColors>;
