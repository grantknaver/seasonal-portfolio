import { gsap } from 'gsap';

export const randInt = (min: number, max: number): number => gsap.utils.random(min, max, 1, false); // integer
