import { Theme } from '../constants/theme';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
}

export const themeMap = {
  [Theme.Fall]: { primary: '#f4e7e1', secondary: '#ff9b45', accent: '#d5451b', dark: '#521c0d' },
  [Theme.Winter]: { primary: '#e0f7fa', secondary: '#81d4fa', accent: '#00acc1', dark: '#37474f' },
  [Theme.Spring]: { primary: '#dcedc8', secondary: '#aed581', accent: '#8bc34a', dark: '#33691e' },
  [Theme.Summer]: { primary: '#fff9c4', secondary: '#ffe082', accent: '#ffca28', dark: '#ef6c00' },
} as const satisfies Record<Theme, ThemeColors>;
