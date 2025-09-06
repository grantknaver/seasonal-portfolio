import { type Theme } from '../constants/theme';

export interface SeasonClasses {
  [Theme.Fall]: string;
  [Theme.Winter]: string;
  [Theme.Spring]: string;
  [Theme.Summer]: string;
}
