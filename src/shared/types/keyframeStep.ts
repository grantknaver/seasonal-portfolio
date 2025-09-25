import { type NumStr } from './numStr';

export interface KeyframeStep {
  x?: NumStr;
  y?: NumStr;
  rotation?: NumStr;
  scale?: number;
  opacity?: number;
  duration?: number;
  ease?: string;
  delay?: number;
}
