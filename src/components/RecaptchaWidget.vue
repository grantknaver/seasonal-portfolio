<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMainStore } from 'src/stores/main';

const mainStore = useMainStore();
const widgetId = ref<number | null>(null);

onMounted(() => {
  grecaptcha.ready(() => {
    widgetId.value = grecaptcha.render('recaptcha', {
      sitekey: '6Lfgtr8rAAAAAMLTtsoeUz0tkVGKcGLog0JWasz6',
      theme: 'light',
      size: 'normal',
      callback: (token: string) => {
        mainStore
          .VERIFY_RECAPTCHA(token)
          .catch((err) => {
            // e.g. $q.notify({ type: 'negative', message: String(err) });
            console.error(err);
          })
          .finally(() => {
            if (widgetId.value !== null) grecaptcha.reset(widgetId.value);
          });
      },
    });
  });
});
</script>

<template>
  <div id="recaptcha"></div>
</template>
