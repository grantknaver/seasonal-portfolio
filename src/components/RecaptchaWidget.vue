<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { useMainStore } from 'src/stores/main';
import { storeToRefs } from 'pinia';

declare const grecaptcha: ReCaptchaV2.ReCaptcha;

const mainStore = useMainStore();
const { recaptchaWidgetId } = storeToRefs(mainStore);

const recaptchaEl = ref<HTMLElement | null>(null);

const waitForGrecaptcha = () =>
  new Promise<void>((resolve) => {
    const tick = () =>
      typeof window !== 'undefined' && window.grecaptcha?.ready ? resolve() : setTimeout(tick, 50);
    tick();
  });

// ensure element is visible before rendering (not display:none)
function waitUntilVisible(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const isVisible = () => {
      const style = getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    };
    if (isVisible()) return resolve();
    const obs = new ResizeObserver(() => {
      if (isVisible()) {
        obs.disconnect();
        resolve();
      }
    });
    obs.observe(document.body);
    // safety: also poll a bit
    const i = setInterval(() => {
      if (isVisible()) {
        clearInterval(i);
        obs.disconnect();
        resolve();
      }
    }, 100);
  });
}

async function init() {
  if (!recaptchaEl.value) return;

  // ✅ guard: if we already have a widget id (0,1,2...) don't render again
  if (Number.isInteger(recaptchaWidgetId.value as number)) return;

  await waitForGrecaptcha();
  await waitUntilVisible(recaptchaEl.value); // avoid rendering while hidden

  grecaptcha.ready(() => {
    // ✅ render into the element, not the string id
    console.log('recaptcha fires');
    const id = grecaptcha.render(recaptchaEl.value!, {
      sitekey: '6Lfgtr8rAAAAAMLTtsoeUz0tkVGKcGLog0JWasz6',
      theme: 'light',
      size: 'normal',
      callback: (token: string) => {
        mainStore
          .VERIFY_RECAPTCHA(token)
          .then(async () => {
            await mainStore.VERIFY_HUMANITY();
          })
          .catch((err) => console.error(err))
          .finally(() => {
            if (recaptchaWidgetId.value !== null) grecaptcha.reset(recaptchaWidgetId.value);
          });
      },
      'error-callback': () => console.error('reCAPTCHA error'),
      'expired-callback': () => console.warn('reCAPTCHA expired'),
    });
    mainStore.SET_RECAPTCHA_WIDGET_ID(id); // id might be 0 → valid
  });
}

watch(
  recaptchaEl,
  async (el) => {
    if (el) await init();
  },
  { flush: 'post', immediate: true },
);

// if this component gets destroyed (e.g., view switch), clear id so you can re-init later
onBeforeUnmount(() => mainStore.SET_RECAPTCHA_WIDGET_ID(null));
</script>

<template>
  <div ref="recaptchaEl" class="q-mt-sm"></div>
</template>
