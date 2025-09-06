import { type ReCaptchaV2 } from '@types/grecaptcha';

declare global {
  // const onRecaptchaVerified: (token: string) => void;
  const grecaptcha: ReCaptchaV2.ReCaptcha;
  interface Window {
    grecaptcha: ReCaptchaV2.ReCaptcha;
    // onRecaptchaVerified?: (token: string) => void;
  }
}
export {};
