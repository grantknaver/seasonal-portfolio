import { ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { Theme } from '../shared/constants/theme';
import { syncThemeGlobals } from '../shared/utils/theme';
import { type TopicName } from 'src/shared/constants/topicName';
import { type ChatMessage } from 'src/shared/models/chatMessage';

export const useMainStore = defineStore('main', () => {
  const activeTopic = ref<TopicName | null>(null);
  const activeTheme = ref<Theme>(Theme.Fall);
  const activeAiAssistLogo = ref<string>(
    new URL('/src/assets/ai-chat_fall.png', import.meta.url).href,
  );
  const contactSectionRef = ref<HTMLElement | null>(null);
  const mobileScrollTarget = ref<TopicName | null>(null);
  const chatLog = ref<ChatMessage[]>([
    {
      id: uuidv4(),
      name: 'Me',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
      text: ['Hey Jane, how are you?'],
      sent: true,
      stamp: '7 minutes ago',
      bgColor: 'primary',
    },
    {
      id: uuidv4(),
      name: 'Bot',
      avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
      text: ['Doing fine, how are you?'],
      sent: false,
      stamp: '6 minutes ago',
      bgColor: 'grey-4',
    },
    {
      id: uuidv4(),
      name: 'Me',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
      text: ['I’m good, just working on the new project.', 'Got time to review it later?'],
      sent: true,
      stamp: '5 minutes ago',
      bgColor: 'primary',
    },
    {
      id: uuidv4(),
      name: 'Bot',
      avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
      text: ['Sure, send it over!'],
      sent: false,
      stamp: '4 minutes ago',
      bgColor: 'grey-4',
    },
    {
      id: uuidv4(),
      name: 'Bot',
      avatar: '/images/ai-bot.svg', // <- put a real placeholder robot avatar in /public/images
      text: ['Hello 👋, I’m your AI assistant.'],
      sent: false,
      stamp: 'Just now',
      bgColor: 'dark',
    },
  ]);

  const SEND_ASSITANT_MESSAGE = (text: string): void => {
    const newMessage = {
      id: uuidv4(),
      name: 'Me',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
      text: [text],
      sent: true,
      stamp: '5 minutes ago',
      bgColor: 'primary',
    };
    chatLog.value = [...chatLog.value, newMessage];
  };
  const SET_MOBILE_SCROLL_TARGET = (topicName: TopicName | null): void => {
    mobileScrollTarget.value = topicName;
  };
  const SET_ACTIVE_TOPIC = (topicName: TopicName | null): void => {
    activeTopic.value = topicName;
  };
  const SET_ACTIVE_THEME = (theme: Theme): void => {
    const aiAssistLogos = {
      [Theme.Fall]: new URL('/src/assets/ai-chat_fall.png', import.meta.url).href,
      [Theme.Winter]: new URL('/src/assets/ai-chat_winter.png', import.meta.url).href,
      [Theme.Spring]: new URL('/src/assets/ai-chat_spring.png', import.meta.url).href,
      [Theme.Summer]: new URL('/src/assets/ai-chat_summer.png', import.meta.url).href,
    };

    activeTheme.value = theme;
    syncThemeGlobals(theme);
    activeAiAssistLogo.value = aiAssistLogos[theme];
  };

  const SET_CONTACT_SECTION_REF = (element: HTMLElement | null): void => {
    contactSectionRef.value = element;
  };

  return {
    activeTopic,
    activeTheme,
    contactSectionRef,
    mobileScrollTarget,
    activeAiAssistLogo,
    chatLog,
    SET_ACTIVE_TOPIC,
    SET_ACTIVE_THEME,
    SET_CONTACT_SECTION_REF,
    SET_MOBILE_SCROLL_TARGET,
    SEND_ASSITANT_MESSAGE,
  };
});
