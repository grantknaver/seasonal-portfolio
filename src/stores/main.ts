import { ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { Theme } from '../shared/constants/theme';
import { syncThemeGlobals } from '../shared/utils/theme';
import { type TopicName } from '../shared/constants/topicName';
import { type ChatMessage } from '../shared/types/chatMessage';
import { useQuasar } from 'quasar';
import type OALog from '../shared/types/oaLog';
import { OARole } from '../shared/types/oaRole';
import { default as useChatTime } from '../shared/composables/useChatTime';
import { fetchRetry } from '../shared/utils/fetchRetry';
import { safeJson } from '../shared/composables/useSafeJson';
import { HttpError } from '../shared/errors/HttpError';
import { useErrorNotifier } from '../shared/composables/useErrorNotifier';
import { CaseStudies } from '../shared/constants/caseStudies';
import type { Package } from 'src/shared/constants/packages';

export const useMainStore = defineStore('main', () => {
  const activeTopic = ref<TopicName | null>(null);
  const activeTheme = ref<Theme>(Theme.Fall);
  const activeAiAssistLogo = ref<string>(
    new URL('/src/assets/ai-chat_fall.avif', import.meta.url).href,
  );
  const activeRecaptchaBackground = ref<string>(
    new URL('/src/assets/recaptcha-fall.avif', import.meta.url).href,
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
  const isLoading = ref<boolean>(true);
  const { notifyHttp, notifyGeneric } = useErrorNotifier();
  const recaptchaWidgetId = ref<number | null>();
  const containsScrollbar = ref<boolean>(false);
  const caseStudyActiveTab = ref<CaseStudies>(CaseStudies.WeatherAndTheme);
  const hasPainted = ref<boolean>(false);
  const packageOfInterest = ref<Package | null>(null);

  const SET_PACKAGE_OF_INTEREST = (packageName: Package | null): void => {
    packageOfInterest.value = packageName;
  };
  const SET_MOBILE_SCROLL_TARGET = (topicName: TopicName | null): void => {
    mobileScrollTarget.value = topicName;
  };
  const SET_ACTIVE_TOPIC = (topicName: TopicName | null): void => {
    activeTopic.value = topicName;
  };
  const SET_ACTIVE_THEME = (theme: Theme): void => {
    const recaptchaBackgrounds = {
      [Theme.Fall]: new URL('/src/assets/recaptcha-fall.avif', import.meta.url).href,
      [Theme.Winter]: new URL('/src/assets/recaptcha-winter.avif', import.meta.url).href,
      [Theme.Spring]: new URL('/src/assets/recaptcha-spring.avif', import.meta.url).href,
      [Theme.Summer]: new URL('/src/assets/recaptcha-summer.avif', import.meta.url).href,
    };
    const aiAssistLogos = {
      [Theme.Fall]: new URL('/src/assets/ai-chat_fall.avif', import.meta.url).href,
      [Theme.Winter]: new URL('/src/assets/ai-chat_winter.avif', import.meta.url).href,
      [Theme.Spring]: new URL('/src/assets/ai-chat_spring.avif', import.meta.url).href,
      [Theme.Summer]: new URL('/src/assets/ai-chat_summer.avif', import.meta.url).href,
    };

    activeTheme.value = theme;
    syncThemeGlobals(theme);
    activeAiAssistLogo.value = aiAssistLogos[theme];
    activeRecaptchaBackground.value = recaptchaBackgrounds[theme];
  };
  const SET_CONTACT_SECTION_REF = (element: HTMLElement | null): void => {
    contactSectionRef.value = element;
  };
  const SET_OALOG = (logItems: OALog[]) => {
    oaLogs.value = [...oaLogs.value, ...logItems];
    isLoading.value = true;
  };

  const constructChatMessage = (log: OALog): ChatMessage => {
    const d = new Date();
    const stamp = d.toISOString();
    return {
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
  };
  const UPDATE_CHATLOG = (logItem: OALog) => {
    if (logItem.role !== OARole.System) {
      const message = constructChatMessage(logItem);
      chatLog.value = [...chatLog.value, message];
    }
  };
  const SET_CASE_STUDY_ACTIVE_TAB = (tab: CaseStudies) => {
    caseStudyActiveTab.value = tab;
  };
  const SEND_OALOGS = async () => {
    const url = `${import.meta.env.VITE_BASE_URL}/api/openAi/submit-logs`;
    const TIMEOUT_MS = 6000;

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetchRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify([...oaLogs.value]),
        signal: controller.signal,
      });
      const data = await safeJson(res);

      if (!res.ok) {
        throw new HttpError(res.status, data);
      }
      const { text: assistantDialog } = data;
      const logItem: OALog = {
        role: OARole.Assistant,
        content: [{ type: 'output_text', text: (assistantDialog ?? '').trim() }],
      };

      oaLogs.value = [...oaLogs.value, logItem];
      UPDATE_CHATLOG(logItem);
      isLoading.value = false;
    } catch (err) {
      const logError: OALog = {
        role: OARole.Assistant,
        content: [{ type: 'output_text', text: 'Chat failure - please reload page' }],
      };
      if (err instanceof HttpError) {
        UPDATE_CHATLOG(logError);
        isLoading.value = false;
        notifyHttp(err);
      } else {
        UPDATE_CHATLOG(logError);
        isLoading.value = false;
        notifyGeneric(err);
      }
    } finally {
      clearTimeout(t);
      isLoading.value = false;
    }
  };
  const VERIFY_RECAPTCHA = async (token: string): Promise<void> => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6000);
    try {
      const res = await fetchRetry(`${import.meta.env.VITE_BASE_URL}/api/auth/verify-recaptcha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token }),
        signal: controller.signal,
      });
      const data = await safeJson(res);

      if (!res.ok || data.success !== true) {
        throw new HttpError(res.status, data);
      }
    } catch (err) {
      if (err instanceof HttpError) {
        notifyHttp(err);
      } else {
        notifyGeneric(err);
      }
    } finally {
      clearTimeout(t);
    }
  };
  const VERIFY_IS_HUMAN = async () => {
    const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/auth/verify-status`).toString();
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetchRetry(url, {
        credentials: 'include',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      const data = await res.json();
      isHuman.value = data.isHuman;
    } catch (err) {
      console.error('[VERIFY_IS_HUMAN] error:', err);
      $q.notify({ type: 'negative', message: `500 - Server Error` });
      return;
    } finally {
      clearTimeout(t);
    }
  };
  const HAS_SCROLLBAR = (status: boolean) => {
    containsScrollbar.value = status;
  };
  const SET_RECAPTCHA_WIDGET_ID = (id: number | null) => (recaptchaWidgetId.value = id);

  const SET_PAINTED_STATUS = (status: boolean) => (hasPainted.value = status);

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
    recaptchaWidgetId,
    activeRecaptchaBackground,
    containsScrollbar,
    caseStudyActiveTab,
    hasPainted,
    packageOfInterest,
    SET_RECAPTCHA_WIDGET_ID,
    SET_ACTIVE_TOPIC,
    SET_ACTIVE_THEME,
    SET_CONTACT_SECTION_REF,
    SET_MOBILE_SCROLL_TARGET,
    SEND_OALOGS,
    VERIFY_RECAPTCHA,
    VERIFY_IS_HUMAN,
    SET_OALOG,
    HAS_SCROLLBAR,
    SET_CASE_STUDY_ACTIVE_TAB,
    SET_PAINTED_STATUS,
    SET_PACKAGE_OF_INTEREST,
    UPDATE_CHATLOG,
  };
});
