// /composables/useMediaAnimations.ts
import gsap from 'gsap';
import { onBeforeUnmount, nextTick } from 'vue';

export const useMediaAnimations = () => {
  const mm = gsap.matchMedia();

  const runAtMedia = (query: string, build: () => () => void) => {
    mm.add(query, async () => {
      let dispose = () => {};
      await (async () => {
        await nextTick();
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        dispose = build();
      })();
      return () => dispose();
    });
  };

  onBeforeUnmount(() => mm.kill());
  return { runAtMedia };
};
