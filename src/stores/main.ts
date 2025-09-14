import { ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { Theme } from '../shared/constants/theme';
import { syncThemeGlobals } from '../shared/utils/theme';
import { type TopicName } from '../shared/constants/topicName';
import { type ChatMessage } from '../shared/types/chatMessage';
import type { CustomError } from 'src/shared/types/customError';
import { useCustomError } from 'src/shared/composables/useCustomError';
import { useQuasar } from 'quasar';
import type OAMessageElement from '../shared/types/oaMessageElement';
import { OARole } from 'src/shared/types/oaRole';

export const useMainStore = defineStore('main', () => {
  const activeTopic = ref<TopicName | null>(null);
  const activeTheme = ref<Theme>(Theme.Fall);
  const activeAiAssistLogo = ref<string>(
    new URL('/src/assets/ai-chat_fall.png', import.meta.url).href,
  );
  const $q = useQuasar();
  const contactSectionRef = ref<HTMLElement | null>(null);
  const mobileScrollTarget = ref<TopicName | null>(null);
  const isHuman = ref<boolean>(false);
  const oaLog = ref<OAMessageElement[]>([
    {
      role: OARole.Developer,
      content: [
        {
          type: 'text',
          text: 'Introduce yourself with a season-inspired name (e.g., Snowflake, Autumn, Solstice). Speak briefly and clearly. Whenever possible, weave in light seasonal references (weather, nature, time of year) into your answers. If you are uncertain, ask a clarifying question instead of guessing.',
        },
      ],
    },
  ]);
  const chatLog = ref<ChatMessage[]>([
    // {
    //   id: uuidv4(),
    //   name: 'Bot',
    //   avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
    //   text: ['Doing fine, how are you?'],
    //   sent: false,
    //   stamp: '6 minutes ago',
    //   bgColor: 'grey-4',
    // },
  ]);

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
  const SEND_ASSITANT_MESSAGE = async (messageElements: OAMessageElement[]) => {
    const url = `${import.meta.env.VITE_BASE_URL}/api/openAi/submit-message`;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6000);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify([]),
        signal: controller.signal,
      });
      const data = await res.json();
      const error = data as CustomError;
      if (!res.ok) {
        if (data.status !== 429) {
          useCustomError(error);
        }
      }
      // {
      //   id: uuidv4(),
      //   name: 'Bot',
      //   avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
      //   text: ['Doing fine, how are you?'],
      //   sent: false,
      //   stamp: '6 minutes ago',
      //   bgColor: 'grey-4',
      // },
      const d = new Date();
      const stamp = d.toISOString();

      const newMessage = {
        id: uuidv4(),
        name: 'Me',
        avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
        text: [messageDetails.content[0]?.text],
        sent: true,
        stamp,
        label: 'label',
        bgColor: 'primary',
      };
      chatLog.value = [...chatLog.value, newMessage];
    } catch (error) {
      console.error('[SEND_ASSITANT_MESSAGE]', error);
      $q.notify({ type: 'negative', message: `500 - Server error 0` });
      return;
    } finally {
      clearTimeout(t);
    }
  };
  const VERIFY_RECAPTCHA = async (token: string): Promise<void> => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6000);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/verify-recaptcha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token }),
        signal: controller.signal,
      });
      const data = await res.json();
      const error = data as CustomError;
      if (!res.ok) {
        useCustomError(error);
      }

      if (data.success !== true) {
        useCustomError(error);
      }
    } catch (error) {
      console.error('[VERIFY_RECAPTCHA]', error);
      $q.notify({ type: 'negative', message: `500 - Server error 1` });
      return;
    } finally {
      clearTimeout(t);
    }
  };
  const VERIFY_HUMANITY = async () => {
    const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/auth/verify-status`).toString();
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(url, {
        credentials: 'include',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      const data = await res.json();
      isHuman.value = data.isHuman;
    } catch (error) {
      console.error('[VERIFY_HUMANITY]', error);
      $q.notify({ type: 'negative', message: `500 - Server Error 2` });
      return;
    } finally {
      clearTimeout(t);
    }
  };

  return {
    activeTopic,
    activeTheme,
    contactSectionRef,
    mobileScrollTarget,
    activeAiAssistLogo,
    chatLog,
    isHuman,
    SET_ACTIVE_TOPIC,
    SET_ACTIVE_THEME,
    SET_CONTACT_SECTION_REF,
    SET_MOBILE_SCROLL_TARGET,
    SEND_ASSITANT_MESSAGE,
    VERIFY_RECAPTCHA,
    VERIFY_HUMANITY,
  };
});
