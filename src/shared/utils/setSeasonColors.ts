import { type Theme } from '../constants/theme';
import { type SeasonClasses } from '../types/seasonColorClasses';

export const setSeasonClasses = (seasonColors: SeasonClasses, season: Theme) => {
  return seasonColors[season];
};
