<script lang="ts" setup>
import { ref, nextTick, watch, computed } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
// import { TopicName } from '../shared/constants/topicName';
import { QScrollArea, debounce } from 'quasar';
import { Theme } from '../shared/constants/theme';
import RecaptchaWidget from '../components/RecaptchaWidget.vue';
import { OARole } from 'src/shared/types/oaRole';
import type OALog from 'src/shared/types/oaLog';
import { useViewport } from 'src/shared/utils/viewWidth';

const mainStore = useMainStore();
const { activeAiAssistLogo, chatLog, activeTheme, isHuman, oaLogs, isLoading } =
  storeToRefs(mainStore);
const isChatting = ref(false);
const text = ref('');
const chatScroll = ref<QScrollArea>();
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);
const dialog = ref(false);

const flushLogs = debounce(async () => {
  await mainStore.SEND_OALOGS();
  chatScroll.value?.setScrollPosition('vertical', 99999, 300);
}, 2000);

const addToLog = async (): Promise<void | undefined> => {
  await mainStore.VERIFY_HUMANITY();
  if (isHuman.value) {
    const t = text.value.trim();
    if (!t) return;
    const logItem: OALog = {
      role: OARole.User,
      content: [{ type: 'input_text', text: t }],
    };
    mainStore.SET_OALOG([logItem]);
    text.value = '';
    flushLogs();
  }
};

watch(isChatting, async (newChattingStatus) => {
  await mainStore.VERIFY_HUMANITY();
  if (isHuman.value) {
    if (newChattingStatus && chatLog.value.length === 0) {
      await mainStore.SEND_OALOGS();
    }
  }
});

watch(isHuman, async (newHumanStatus) => {
  if (newHumanStatus) {
    if (isChatting.value && chatLog.value.length === 0) {
      await mainStore.SEND_OALOGS();
    }
  }
});

watch(oaLogs, async () => {
  await nextTick();
  chatScroll.value?.setScrollPosition('vertical', 99999, 300);
});
</script>

<template>
  <div v-if="isResponsive" class="responsive-view">
    <q-dialog v-model="dialog" backdrop-filter="contrast(40%)">
      <q-card class="ai-chat-dialog">
        <q-card-section class="q-pb-none">
          <q-scroll-area ref="chatScroll" class="chat-feed q-pa-md" :visible="false" v-if="isHuman">
            <q-chat-message
              v-for="message in chatLog"
              :key="message.id"
              :name="message.name"
              :avatar="message.sent ? '/silhouette-avatar.svg' : '/robot-avatar.svg'"
              :text="message.text"
              :sent="message.sent"
              :stamp="message.stamp"
              :text-color="message.sent && activeTheme === Theme.Summer ? 'black' : 'primary'"
              :bg-color="message.sent ? 'accent' : 'dark'"
            />
            <q-chat-message
              v-if="isLoading && isHuman"
              bg-color="secondary"
              avatar="/robot-avatar.svg"
            >
              <q-spinner-dots size="2rem" />
            </q-chat-message>
          </q-scroll-area>
          <q-img
            v-else
            :style="{
              opacity: isHuman ? 1 : 0.4,
            }"
            src="../assets/4-season-not-authorized.png"
          ></q-img>
          <hr />
          <q-input
            v-if="dialog && isHuman"
            color="dark"
            :dark="false"
            bg-color="white"
            filled
            v-model="text"
            label="What is up?"
            :borderless="false"
            outlined
            class="custom-input"
            @keypress.enter.prevent="addToLog"
          >
            <template #prepend><q-icon name="chat" /></template>
          </q-input>
          <div v-else class="recaptcha-container q-mt-sm">
            <span class="full-width"> <RecaptchaWidget></RecaptchaWidget></span>
          </div>
        </q-card-section>
        <q-card-actions class="q-pt-none" align="right">
          <q-btn
            label="Close"
            color="dark"
            text-color="primary"
            class="full-width"
            v-close-popup
            size="lg"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-separator class="full-width"></q-separator>
    <!-- <b class="q-mb-md text-center">Chat Bot:</b> -->
    <q-btn @click="dialog = !dialog" class="chat-button q-mt-md" style="background-color: #f7f8f5">
      <q-tooltip
        anchor="center middle"
        self="top left"
        class="bg-secondary text-dark"
        style="font-size: 1.2rem"
        >Chat Bot</q-tooltip
      >
      <img style="width: 100%; max-width: 200px" :src="activeAiAssistLogo" />
    </q-btn>
  </div>

  <div v-if="!isResponsive" class="desktop-view">
    <div class="assistant-chat full-width q-pa-lg">
      <q-scroll-area ref="chatScroll" class="chat-feed q-pa-md" :visible="false" v-if="isHuman">
        <q-chat-message
          v-for="message in chatLog"
          :key="message.id"
          :name="message.name"
          :avatar="message.sent ? '/silhouette-avatar.svg' : '/robot-avatar.svg'"
          :text="message.text"
          :sent="message.sent"
          :stamp="message.stamp"
          :text-color="message.sent && activeTheme === Theme.Summer ? 'black' : 'primary'"
          :bg-color="message.sent ? 'accent' : 'dark'"
        />
        <q-chat-message v-if="isLoading && isHuman" bg-color="secondary" avatar="/robot-avatar.svg">
          <q-spinner-dots size="2rem" />
        </q-chat-message>
      </q-scroll-area>
      <q-img
        v-else
        :style="{
          opacity: isHuman ? 1 : 0.4,
        }"
        src="../assets/4-season-not-authorized.png"
      ></q-img>
      <hr />
      <q-input
        v-if="isHuman"
        color="dark"
        :dark="false"
        bg-color="white"
        filled
        v-model="text"
        label="What is up?"
        :borderless="false"
        outlined
        class="custom-input"
        @keypress.enter.prevent="addToLog"
      >
        <template #prepend><q-icon name="chat" /></template>
      </q-input>
      <div v-else class="recaptcha-container q-mt-sm">
        <RecaptchaWidget></RecaptchaWidget>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.responsive-view {
  .ai-chat-dialog {
    display: none;
    width: 100vw;
    height: auto;
    max-width: 400px;

    .chat-button {
      align-self: self-end;
      margin-top: 1rem;
    }

    .custom-input {
      border: 1px solid var(--q-secondary);
      border-radius: 5px;
    }
  }
}

.desktop-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 400px;
  max-height: 100%;

  .assistant-chat {
    z-index: 100;
    background-color: var(--q-primary);
    border: 4px solid var(--q-accent);
    border-radius: 1rem;
    box-shadow: 5px 5px 10px black;
    max-height: 100%;
    right: 8px;

    .chat-feed {
      height: 300px;
      max-height: 300px;
      background-color: white;
      border-radius: 5px;
      border: 1px solid var(--q-secondary);
    }
  }

  .chat-button {
    align-self: self-end;
    margin-top: 1rem;
  }

  .custom-input {
    border: 1px solid var(--q-secondary);
    border-radius: 5px;
  }
}
</style>
