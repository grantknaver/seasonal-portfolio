import gsap from 'gsap';

export function useGsapTimeline() {
  let tl = gsap.timeline({ paused: true });

  const reset = (
    el: Element | Document,
    selector: string,
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
  ) => {
    const targets = (el as Element).querySelectorAll(selector);
    gsap.killTweensOf(targets);
    tl.pause(0);
    gsap.set(targets, fromVars);
    tl.fromTo(targets, fromVars, { ...toVars, immediateRender: false }, 0).play(0);
    return tl;
  };

  const kill = () => {
    tl.kill();
    tl = gsap.timeline({ paused: true });
  };
  return { kill, reset, timeline: () => tl };
}
