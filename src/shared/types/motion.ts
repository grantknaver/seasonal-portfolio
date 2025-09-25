import { type Keyframes } from './keyframes';

export type Motion = {
  keyframes?: Keyframes;
  ease?: string;
  yoyo?: boolean;
};
