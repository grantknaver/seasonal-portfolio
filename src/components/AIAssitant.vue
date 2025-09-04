<script lang="ts" setup>
import { ref, nextTick, watch } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { TopicName } from 'src/shared/constants/topicName';
import { Theme } from 'src/shared/constants/theme';
import { QScrollArea } from 'quasar';

const mainStore = useMainStore();
const { activeAiAssistLogo, activeTopic, chatLog, activeTheme } = storeToRefs(mainStore);

const isChatting = ref(true);
const text = ref('');
const chatScroll = ref<QScrollArea>();
const hasPassedRecaptcha = ref(false);
const right = ref(false);

const submitMessage = async () => {
  if (!text.value.trim()) return;
  mainStore.SEND_ASSITANT_MESSAGE(text.value);
  text.value = '';
  await nextTick();
  chatScroll.value?.setScrollPosition('vertical', 99999, 300);
};

// const submitRecaptcha = () => {
//   console.log('submitRecaptcha');
// };

watch(chatLog, async () => {
  await nextTick();
  chatScroll.value?.setScrollPosition('vertical', 99999, 300);
});
</script>

<template>
  <div class="container">
    <!-- <q-btn
      v-if="!hasPassedRecaptcha"
      @click="submitRecaptcha()"
      class="g-recaptcha"
      color="primary"
      text-color="dark"
      data-sitekey="6Lcpeb0rAAAAAMJTycfari4SgoePh5mrzvZIYTiP"
      data-callback="onSubmit"
      data-action="submit"
      >Captcha</q-btn
    > -->
    <div
      class="recaptcha-container flex row full-width justify-between q-pa-xs"
      v-if="!hasPassedRecaptcha"
    >
      <q-checkbox
        color="dark"
        v-model="right"
        label="I'm not a robot"
        class="g-recaptcha"
        data-sitekey="6Lcpeb0rAAAAAMJTycfari4SgoePh5mrzvZIYTiP"
        data-callback="onSubmit"
        data-action="submit"
      />
      <q-img src="../assets/recaptcha.png" />
    </div>
    <div v-else>
      <div v-if="isChatting" class="assistant-chat full-width q-pa-lg">
        <q-scroll-area ref="chatScroll" class="chat-feed q-pa-md">
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
        </q-scroll-area>

        <hr />
        <q-input
          color="dark"
          :dark="false"
          bg-color="white"
          filled
          v-model="text"
          label="What is up?"
          :borderless="false"
          @keyup.enter="submitMessage"
          outlined
          class="custom-input"
        >
          <template #prepend><q-icon name="chat" /></template>
        </q-input>
      </div>

      <q-btn
        @click="isChatting = !isChatting"
        class="chat-button"
        round
        size="lg"
        :color="activeTopic === TopicName.Contact ? 'dark' : 'accent'"
      >
        <q-tooltip anchor="center middle" self="top left">Chat</q-tooltip>
        <q-avatar><img :src="activeAiAssistLogo" /></q-avatar>
      </q-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 400px;

  .recaptcha-container {
    background-color: white;
    max-width: 250px;
    .g-recaptcha {
      z-index: 100;
    }

    .q-img {
      max-width: 75px;
    }
  }

  .assistant-chat {
    z-index: 100;
    background-color: var(--q-primary);
    border: 4px solid var(--q-accent);
    border-radius: 1rem;
    box-shadow: 5px 5px 10px black;

    @media (min-width: $breakpoint-md) {
      right: 8px;
    }

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
}

.custom-input {
  border: 1px solid var(--q-secondary);
  border-radius: 5px;
}
</style>
