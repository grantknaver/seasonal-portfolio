<script setup lang="ts">
import { onMounted } from 'vue';

const onRecaptchaVerified = (token: string) => {
  console.log('No global:', token); // send to backend
};

onMounted(() => {
  grecaptcha.render('recaptcha', {
    sitekey: '6Lfgtr8rAAAAAMLTtsoeUz0tkVGKcGLog0JWasz6',
    theme: 'light',
    size: 'normal',
    callback: onRecaptchaVerified,
  });
});
</script>

<template>
  <div id="recaptcha"></div>
</template>
