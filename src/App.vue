<script setup lang="ts">
import { watch } from 'vue';
import { themeMap } from './shared/utils/themeMap';
import { useMainStore } from './stores/main';
import { storeToRefs } from 'pinia';
import { TopicName } from './shared/constants/topicName';
const mainStore = useMainStore();
const { activeTheme, activeTopic } = storeToRefs(mainStore);

watch(
  activeTheme,
  (t) => {
    const theme = themeMap[t];
    const root = document.documentElement;
    root.style.setProperty('--q-primary', theme.primary);
    root.style.setProperty('--q-secondary', theme.secondary);
    root.style.setProperty('--q-accent', theme.accent);
    root.style.setProperty('--q-dark', theme.dark);
  },
  { immediate: true },
);

watch(
  activeTopic,
  (topic) => {
    if (topic !== TopicName.Contact && topic !== TopicName.Packages) {
      mainStore.SET_PACKAGE_OF_INTEREST(null);
    }
  },
  { immediate: true },
);
</script>

<template>
  <router-view />
</template>
