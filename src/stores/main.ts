import { ref } from 'vue';
import { defineStore } from 'pinia';

import { Theme } from '../shared/constants/theme';
import { syncThemeGlobals } from '../shared/utils/theme';

export const useMainStore = defineStore('main', () => {
  const activeTopic = ref<string | null>(null);
  const activeTheme = ref<Theme>(Theme.Fall);
  const activeThemeBackground = ref<string>(
    new URL('../assets/autumn-forestry.jpg', import.meta.url).href,
  );
  const contactSectionRef = ref<HTMLElement | null>(null);
  const backgroundMap: Record<Theme, string> = {
    [Theme.Fall]: new URL('../assets/autumn-forestry.jpg', import.meta.url).href,
    [Theme.Winter]: new URL('../assets/snowy-winter-landscape.jpg', import.meta.url).href,
    [Theme.Spring]: new URL('../assets/beautiful-forest-spring-season.jpg', import.meta.url).href,
    [Theme.Summer]: new URL('../assets/beautiful-shot-forest.jpg', import.meta.url).href,
  };

  const SET_ACTIVE_TOPIC = (topicName: string | null) => {
    activeTopic.value = topicName;
  };

  const SET_ACTIVE_THEME = (theme: Theme) => {
    activeTheme.value = theme;
    syncThemeGlobals(theme);
    SET_THEME_BACKGROUND(theme);
  };

  const SET_THEME_BACKGROUND = (theme: Theme) => {
    activeThemeBackground.value = backgroundMap[theme];
  };

  const SET_CONTACT_SECTION_REF = (element: HTMLElement | null) => {
    contactSectionRef.value = element;
  };

  return {
    activeTopic,
    activeTheme,
    contactSectionRef,
    activeThemeBackground,
    SET_ACTIVE_TOPIC,
    SET_ACTIVE_THEME,
    SET_CONTACT_SECTION_REF,
    SET_THEME_BACKGROUND,
  };
});
