// /composables/useMediaAnimations.ts
import gsap from 'gsap';
import { onBeforeUnmount } from 'vue';

export const useMediaAnimations = () => {
  // Create a matchMedia context for this component
  const mm = gsap.matchMedia();

  /**
   * runAtMedia()
   * @param query  media query string (e.g. "(min-width: 1024px)")
   * @param build  function that sets up animations and returns a cleanup () => void
   */
  const runAtMedia = (query: string, build: () => () => void) => {
    mm.add(query, () => {
      let dispose = () => {}; // cleanup reference
      let raf1 = 0,
        raf2 = 0; // frame handles

      // 🧩 Wait two frames so Vue and the browser finish layout & paint
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          dispose = build(); // Build animations after DOM is stable
        });
      });

      // GSAP will call this when the query stops matching
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
        dispose(); // Run your teardown (kill + ctx.revert)
        alert('cancelAnimationFrame');
      };
    });
  };

  // When component unmounts, revert all matchMedia contexts
  onBeforeUnmount(() => mm.revert());

  return { runAtMedia };
};
