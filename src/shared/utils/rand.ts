import { gsap } from 'gsap';

export const rand = (min: number, max: number): number => gsap.utils.random(min, max, 0, false); // float
