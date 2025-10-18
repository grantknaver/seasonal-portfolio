export const twoRaf = () =>
  new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
