<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { TopicName } from 'src/shared/constants/topicName';
import { QChatMessage } from 'quasar';
import { type ChatMessage } from 'src/shared/models/chatMessage';
import { Theme } from 'src/shared/constants/theme';

const mainStore = useMainStore();
const { activeAiAssistLogo, activeTopic, chatLog, activeTheme } = storeToRefs(mainStore);
const isChatting = ref<boolean>(false);
const text = ref<string>('');
const chatHistory = ref<ChatMessage[]>([]);

onMounted(() => (chatHistory.value = chatLog.value));
</script>

<template>
  <div class="container">
    <div v-if="isChatting" class="assistant-chat full-width q-pa-lg">
      <div class="message-feed">
        <q-chat-message
          v-for="message in chatHistory"
          :key="message.id"
          :name="message.name"
          :avatar="
            message.sent ? '/src/assets/silhouette-avatar.svg' : '/src/assets/robot-avatar.svg'
          "
          :text="message.text"
          :sent="message.sent"
          :stamp="message.stamp"
          :textColor="message.sent && activeTheme === Theme.Summer ? 'black' : 'primary'"
          :bg-color="message.sent ? 'accent' : 'dark'"
        />
      </div>

      <hr />
      <q-input color="white" bg-color="secondary" filled v-model="text" label="What is up?">
        <template v-slot:prepend>
          <q-icon name="chat" />
        </template>
      </q-input>
    </div>

    <q-btn
      @click="isChatting = !isChatting"
      class="chat-button"
      round
      size="lg"
      :color="activeTopic === TopicName.Contact ? 'dark' : 'accent'"
    >
      <q-tooltip anchor="center middle" self="top left"> Chat </q-tooltip>
      <q-avatar>
        <img :src="activeAiAssistLogo" />
      </q-avatar>
    </q-btn>
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

  .assistant-chat {
    z-index: 100;
    background-color: var(--q-primary);
    border: 4px solid var(--q-accent);
    border-radius: 1rem;
    box-shadow: 5px 5px 10px black;

    @media (min-width: $breakpoint-md) {
      right: 8px;
    }

    .message-feed {
      max-height: 300px;
      overflow: auto;
      background-color: white;
      border-radius: 5px;
    }
  }

  .chat-button {
    align-self: self-end;
    margin-top: 1rem;
  }
}
</style>
