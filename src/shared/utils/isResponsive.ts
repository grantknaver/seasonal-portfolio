import { getCustomCssVar } from './getCustomCssVar';
import { vw } from './viewWidth';

export const isResponsive = (): boolean => {
  const raw = getCustomCssVar('breakpoint-lg');
  const lg = parseFloat(raw); // 1440
  return vw() < lg;
};
