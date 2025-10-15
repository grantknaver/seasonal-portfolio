import { ViewType } from '../constants/viewType';

const hasDesktopRendered = (mode: ViewType, el: Element | null) => {
  if (!el) return;
  return mode === ViewType.Desktop && getComputedStyle(el).display === 'none';
};

const hasTabletRendered = (mode: ViewType, el: Element | null) => {
  if (!el) return;
  return mode === ViewType.Tablet && getComputedStyle(el).display === 'none';
};

const hasNotDesktopRendered = (mode: ViewType, el: Element | null) => {
  if (!el) return;
  return mode === ViewType.NotDesktop && getComputedStyle(el).display === 'none';
};

const hasMobileRendered = (mode: ViewType, el: Element) => {
  if (!el) return;
  return mode === ViewType.Mobile && getComputedStyle(el).display === 'none';
};

export default { hasDesktopRendered, hasTabletRendered, hasNotDesktopRendered, hasMobileRendered };
