import { type ReCaptchaV2 } from '@types/grecaptcha';

declare global {
  const grecaptcha: ReCaptchaV2.ReCaptcha;
  interface Window {
    grecaptcha: ReCaptchaV2.ReCaptcha;
  }
}
export {};
