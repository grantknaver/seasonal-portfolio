import { ref } from 'vue';
import { defineStore } from 'pinia';

import { Theme } from '../shared/constants/theme';

export const useMainStore = defineStore('main', () => {
  const activeTopic = ref<string | null>(null);
  const activeTheme = ref<Theme>(Theme.Fall);

  const SET_ACTIVE_TOPIC = (topicName: string | null) => {
    activeTopic.value = topicName;
  };

  const SET_ACTIVE_THEME = (theme: Theme) => {
    activeTheme.value = theme;
  };

  return {
    activeTopic,
    activeTheme,
    SET_ACTIVE_TOPIC,
    SET_ACTIVE_THEME,
  };
});
