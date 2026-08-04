<script setup lang="ts">
import { watch } from 'vue';
import { useMainStore } from './stores/main';
import { storeToRefs } from 'pinia';
import { TopicName } from './shared/constants/topicName';
const mainStore = useMainStore();
const { activeTopic } = storeToRefs(mainStore);

watch(
  activeTopic,
  (topic) => {
    if (topic !== TopicName.Contact && topic !== TopicName.Packages) {
      mainStore.SET_PACKAGE_INTEREST_TEXT('');
    }
  },
  { immediate: true },
);
</script>

<template>
  <router-view />
</template>
