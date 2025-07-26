export const getCustomCssVar = (name: string, el = document.documentElement) => {
  return getComputedStyle(el).getPropertyValue(`--${name}`).trim();
};
