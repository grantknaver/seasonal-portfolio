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
import type OALog from '../shared/types/oaLog';
import { OARole } from '../shared/types/oaRole';
import { default as useChatTime } from '../shared/composables/useChatTime';

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
  const oaLogs = ref<OALog[]>([
    {
      role: OARole.System,
      content: [
        {
          type: 'input_text',
          text: 'Introduce yourself with a season-inspired name (e.g., Snowflake, Autumn, Solstice). Speak briefly and clearly. Whenever possible, weave in light seasonal references (weather, nature, time of year) into your answers. If you are uncertain, ask a clarifying question instead of guessing.',
        },
      ],
    },
  ]);
  const chatLog = ref<ChatMessage[]>([]);
  const lastAssistantIndex = ref<number>(-1);
  const isLoading = ref<boolean>(false);

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

  const SET_OALOG = (logItems: OALog[]) => {
    oaLogs.value = [...oaLogs.value, ...logItems];
  };

  const SEND_OALOGS = async () => {
    isLoading.value = true;
    const url = `${import.meta.env.VITE_BASE_URL}/api/openAi/submit-logs`;
    // const controller = new AbortController();
    // const t = setTimeout(() => {
    //   $q.notify({ type: 'negative', message: 'Request took too long' });
    //   controller.abort();
    // }, 6000);
    const constructChatMessage = (log: OALog): ChatMessage => {
      const d = new Date();
      const stamp = d.toISOString();
      const message: ChatMessage = {
        id: uuidv4(),
        name: log.role === OARole.Assistant ? 'Bot' : 'Me',
        avatar:
          log.role === OARole.Assistant
            ? 'https://cdn.quasar.dev/img/avatar3.jpg'
            : 'https://cdn.quasar.dev/img/avatar4.jpg',
        text: [log.content[0]?.text],
        sent: log.role === OARole.Assistant ? false : true,
        stamp: useChatTime(stamp).format('h:mm A'),
        bgColor: log.role === OARole.Assistant ? 'grey-4' : 'primary',
      };
      return message;
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify([...oaLogs.value]),
        // signal: controller.signal,
      });

      const data = await res.json();
      const error = data as CustomError;
      if (!res.ok) {
        if (data.status !== 429) {
          useCustomError(error);
        }
      }

      const { text: assistantDialog } = data;
      const logItem: OALog = {
        role: OARole.Assistant,
        content: [
          {
            type: 'output_text',
            text: assistantDialog.trim(),
          },
        ],
      };
      isLoading.value = false;
      oaLogs.value = [...oaLogs.value, logItem];
      chatLog.value = oaLogs.value
        .filter((log) => log.role !== OARole.System)
        .map((log) => constructChatMessage(log));
    } catch (err) {
      console.error('[SEND_OALOGS] error:', err);
      $q.notify({ type: 'negative', message: `500 - Server error` });
      return;
    }
    // finally {
    //   clearTimeout(t);
    // }
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
    } catch (err) {
      console.error('[VERIFY_RECAPTCHA] err:', err);
      $q.notify({ type: 'negative', message: `500 - Server error` });
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
    } catch (err) {
      console.error('[VERIFY_HUMANITY] error:', err);
      $q.notify({ type: 'negative', message: `500 - Server Error` });
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
    oaLogs,
    lastAssistantIndex,
    isLoading,
    SET_ACTIVE_TOPIC,
    SET_ACTIVE_THEME,
    SET_CONTACT_SECTION_REF,
    SET_MOBILE_SCROLL_TARGET,
    SEND_OALOGS,
    VERIFY_RECAPTCHA,
    VERIFY_HUMANITY,
    SET_OALOG,
  };
});
