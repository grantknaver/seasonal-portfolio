import { ref } from 'vue';
import { defineStore } from 'pinia';

import { Theme } from '../shared/constants/theme';
import { syncThemeGlobals } from '../shared/utils/theme';
import { type TopicName } from 'src/shared/constants/topicName';

export const useMainStore = defineStore('main', () => {
  const activeTopic = ref<string | null>(null);
  const activeTheme = ref<Theme>(Theme.Fall);
  const contactSectionRef = ref<HTMLElement | null>(null);
  const mobileScrollTarget = ref<TopicName | null>(null);

  const SET_MOBILE_SCROLL_TARGET = (topicName: TopicName) => {
    mobileScrollTarget.value = topicName;
  };

  const SET_ACTIVE_TOPIC = (topicName: string | null) => {
    activeTopic.value = topicName;
  };

  const SET_ACTIVE_THEME = (theme: Theme) => {
    activeTheme.value = theme;
    syncThemeGlobals(theme);
  };

  const SET_CONTACT_SECTION_REF = (element: HTMLElement | null) => {
    contactSectionRef.value = element;
  };

  return {
    activeTopic,
    activeTheme,
    contactSectionRef,
    mobileScrollTarget,
    SET_ACTIVE_TOPIC,
    SET_ACTIVE_THEME,
    SET_CONTACT_SECTION_REF,
    SET_MOBILE_SCROLL_TARGET,
  };
});
