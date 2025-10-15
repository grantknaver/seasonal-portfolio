import gsap from 'gsap';

export const gsapPreflightReset = (nodes: Element[] | NodeListOf<Element>) => {
  const arr = Array.from(nodes).filter(Boolean) as HTMLElement[];
  if (!arr.length) return;
  gsap.killTweensOf(arr);
  gsap.set(arr, { clearProps: 'all' });
};
