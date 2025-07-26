import { type Theme } from '../constants/theme';

export interface Topic {
  id: string;
  name: string;
  icon?: string;
  label?: string;
  theme?: Theme;
  seasonIcon?: string;
}
