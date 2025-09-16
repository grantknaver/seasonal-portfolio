<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMainStore } from 'src/stores/main';

declare const grecaptcha: ReCaptchaV2.ReCaptcha; // let TS chill

const mainStore = useMainStore();
const widgetId = ref<number | null>(null);
const recaptchaEl = ref<HTMLElement | null>(null);

const waitForGrecaptcha = () =>
  new Promise<void>((resolve) => {
    const tick = () =>
      typeof window !== 'undefined' && window.grecaptcha ? resolve() : setTimeout(tick, 100);
    tick();
  });

const init = () => {
  grecaptcha.ready(() => {
    widgetId.value = grecaptcha.render('recaptcha', {
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
            if (widgetId.value !== null) grecaptcha.reset(widgetId.value);
          });
      },
    });
  });
};

watch(
  recaptchaEl,
  async (v) => {
    if (v) {
      await waitForGrecaptcha(); // ✅ just this line
      init();
    }
  },
  { flush: 'post', immediate: true },
);
</script>

<template>
  <div id="recaptcha" ref="recaptchaEl"></div>
</template>
