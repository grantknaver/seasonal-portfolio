// composables/useGsapTimeline.ts
import gsap from 'gsap';
import { type GsapStep } from '../types/gsapStep';
import { GsapStepType } from '../constants/gsapStepType';

export function useGsapTimeline() {
  let tl = gsap.timeline({
    paused: true,
    defaults: {
      overwrite: true,
    },
  });

  /** Kill + rebuild + add full sequence (sets + tweens) and play from 0 */
  function resetSequence(steps: GsapStep[]) {
    tl.kill();
    tl = gsap.timeline({
      paused: true,
      defaults: {
        overwrite: true,
      },
    });

    for (const s of steps) {
      if (s.type === GsapStepType.Label) {
        tl.addLabel(s.name, s.at ?? '>');
      } else if (s.type === 'set') {
        tl.set(s.targets, s.vars, s.at ?? '>');
      } else if (s.type === 'fromTo') {
        tl.fromTo(s.targets, s.from, { ...s.to, immediateRender: false }, s.at ?? '>');
      } else {
        tl.to(s.targets, s.vars, s.at ?? '>');
      }
    }
    tl.play(0);
    return tl;
  }

  function kill() {
    tl.kill();
    tl = gsap.timeline({ paused: true });
  }

  function timeline() {
    return tl;
  }

  return { resetSequence, kill, timeline };
}
