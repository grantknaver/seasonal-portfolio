import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Theme } from '../shared/constants/theme';

export const useThemeStore = defineStore('user', () => {
  const activeTheme = ref<Theme>(Theme.Fall);

  const SET_ACTIVE_THEME = (theme: Theme) => {
    console.log('SET_ACTIVE_THEME', theme);
    activeTheme.value = theme;
  };

  return {
    activeTheme,
    SET_ACTIVE_THEME,
  };
});
