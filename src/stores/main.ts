import { ref } from 'vue';
import { defineStore } from 'pinia';

import { Theme } from '../shared/constants/theme';

export const useMainStore = defineStore('main', () => {
  const activeTopic = ref<string | null>(null);
  const activeTheme = ref<Theme>(Theme.Fall);
  const contactSectionRef = ref<HTMLElement | null>(null);

  const SET_ACTIVE_TOPIC = (topicName: string | null) => {
    activeTopic.value = topicName;
  };

  const SET_ACTIVE_THEME = (theme: Theme) => {
    activeTheme.value = theme;
  };

  const SET_CONTACT_SECTION_REF = (element: HTMLElement | null) => {
    contactSectionRef.value = element;
  };

  return {
    activeTopic,
    activeTheme,
    contactSectionRef,
    SET_ACTIVE_TOPIC,
    SET_ACTIVE_THEME,
    SET_CONTACT_SECTION_REF,
  };
});
