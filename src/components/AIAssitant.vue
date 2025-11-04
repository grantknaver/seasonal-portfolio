<script lang="ts" setup>
import { ref, nextTick, watch, computed } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { QScrollArea, debounce } from 'quasar';
import { Theme } from '../shared/constants/theme';
import RecaptchaWidget from '../components/RecaptchaWidget.vue';
import { OARole } from 'src/shared/types/oaRole';
import type OALog from 'src/shared/types/oaLog';
import { useViewport } from 'src/shared/utils/viewWidth';
import { mdiChat } from '@quasar/extras/mdi-v7';

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
  await mainStore.VERIFY_IS_HUMAN();
  if (isHuman.value) {
    isChatting.value = true;
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

watch(isHuman, async (newHumanStatus) => {
  if (newHumanStatus) {
    if (chatLog.value.length === 0) {
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
    <q-dialog
      v-model="dialog"
      :maximized="isResponsive"
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <q-card
        class="rv-ai-chat-dialog column no-wrap no-overflow"
        style="width: 100%; height: 80svh; border-radius: 5px; max-width: 400px"
      >
        <q-card-section
          class="q-pb-none column no-wrap no-overflow q-gutter-y-md"
          style="flex: 1 1 auto; min-height: 0"
        >
          <q-scroll-area
            v-if="dialog && isHuman"
            ref="chatScroll"
            style="
              flex: 1 1 auto;
              min-height: 0;
              width: 100%;
              border: solid 1px var(--q-secondary);
              border-radius: 5px;
            "
          >
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
            src="../assets/4-season-not-authorized.png"
            fit="cover"
            class="no-overflow"
            style="flex: 1 1 auto; min-height: 0; width: 100%; height: 100%"
          />

          <q-separator style="flex: 0 0 auto" />

          <q-input
            v-if="dialog && isHuman"
            color="dark"
            bg-color="white"
            filled
            v-model="text"
            label="What is up?"
            outlined
            style="
              flex: 0 0 auto;
              width: 100%;
              border: 1px solid var(--q-secondary);
              border-radius: 5px;
            "
            @keypress.enter.prevent="addToLog"
          >
            <template #prepend><q-icon :name="mdiChat" /></template>
          </q-input>

          <div v-else style="flex: 0 0 auto; width: 100%">
            <span class="full-width"><RecaptchaWidget /></span>
          </div>
        </q-card-section>

        <q-card-actions class="q-pt-md" align="right" style="flex: 0 0 auto">
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
    <q-btn
      @click="dialog = !dialog"
      style="background-color: #f7f8f5; align-self: self-end; margin-top: 1rem"
    >
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
    <div class="dv-ai-assistant-chat column no-wrap q-pa-lg bg-white">
      <!-- The ONLY scrollable area -->
      <q-scroll-area v-if="isHuman" ref="chatScroll" class="dv-chat-feed">
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
        src="../assets/4-season-not-authorized-2.avif"
        fit="cover"
        class="dv-img-fill no-overflow q-mb-sm"
      />
      <q-separator />
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
        class="dv-input"
        @keypress.enter.prevent="addToLog"
      >
        <template #prepend><q-icon :name="mdiChat" /></template>
      </q-input>
      <div v-else class="q-mt-sm">
        <RecaptchaWidget />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.rv-ai-chat-dialog {
  border-radius: 5px !important;
}

.desktop-view {
  display: flex;
  align-items: center; /* center horizontally */
  justify-content: center; /* center vertically (optional) */
  width: 100%;
  padding: 16px;

  .dv-ai-assistant-chat {
    width: 100%;
    height: 500px;
    max-width: 400px; /* pick one max width */
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden; /* parents never scroll */
    border-radius: 5px;
    box-shadow: 5px 5px 10px var(--q-dark);
    border: solid 1px var(--q-dark);

    /* Only this region grows and can scroll */
    .dv-chat-feed {
      flex: 1 1 auto;
      min-height: 0; /* crucial for internal scroll */
      background: #fff;
      border: 1px solid var(--q-secondary);
      border-radius: 10px;
    }

    /* non-scroll, fills space when not human */
    .dv-img-fill {
      flex: 1 1 auto;
      min-height: 0;
      width: 100%;
    }

    /* footer pieces are fixed height, never scroll */
    .dv-input {
      flex: 0 0 auto;
      width: 100%;
      overflow: hidden;
    }
  }
}
</style>
