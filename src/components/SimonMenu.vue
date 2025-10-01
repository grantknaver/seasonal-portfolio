<script setup lang="ts">
import { TopicName } from '../shared/constants/topicName';
import { ref } from 'vue';
import { useMainStore } from '../stores/main';
import { type Topic } from '../shared/types/topic';
import { v4 as uuidv4 } from 'uuid';
import { storeToRefs } from 'pinia';

const mainStore = useMainStore();
const { activeTopic } = storeToRefs(mainStore);
const topics: Topic[] = [
  {
    id: uuidv4(),
    name: TopicName.Packages,
    icon: 'inventory',
    label: 'Packages',
  },
  {
    id: uuidv4(),
    name: TopicName.About,
    icon: 'info',
    label: TopicName.About,
  },
  {
    id: uuidv4(),
    name: TopicName.Contact,
    icon: 'mail',
    label: TopicName.Contact,
  },
  {
    id: uuidv4(),
    name: TopicName.CaseStudies.replace(' ', '') as TopicName,
    icon: 'menu_book',
    label: TopicName.CaseStudies,
  },
];

const selectTopic = (name: TopicName) => {
  console.log('selectTopic');
  if (name === activeTopic.value) {
    mainStore.SET_ACTIVE_TOPIC(null);
  } else {
    mainStore.SET_ACTIVE_TOPIC(name);
  }
};

const simonRef = ref();
</script>
<template>
  <div ref="simonRef" class="simon">
    <div
      v-for="topic in topics"
      :key="topic.id"
      class="simon-quadrant"
      :class="[topic.name, { 'active-topic': topic.name === activeTopic }]"
      tabindex="0"
      style="padding: 1rem"
      @click.stop="selectTopic(topic.name)"
    >
      <a class="simon-link">
        <q-icon :name="topic.icon" size="32px" />
        <q-tooltip anchor="center middle" self="top left">
          {{ topic.label }}
        </q-tooltip>
      </a>
    </div>
  </div>
</template>
<style scoped lang="scss">
.simon {
  position: relative;
  border-radius: 10px;
  overflow: visible;
  width: 275px;
  height: 275px;
}

.simon-quadrant {
  position: absolute;
  width: 49%;
  height: 49%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  transform-origin: center;
  border-radius: 10px;
  border: solid 4px rgba($color: white, $alpha: 0.7);
  background-color: rgba($color: #521c0d, $alpha: 0.5);
  z-index: 1;

  &:hover {
    transform: scale(1.25);
    z-index: 10;

    &.Packages {
      background-color: var(--q-secondary);
    }

    &.CaseStudies {
      background-color: var(--q-accent);
    }

    &.About {
      background-color: var(--q-accent);
    }

    &.Contact {
      background-color: var(--q-secondary);
    }
  }

  &.Packages {
    top: 0;
    left: 0;
  }

  &.CaseStudies {
    top: 0;
    right: 0;
  }

  &.About {
    bottom: 0;
    left: 0;
  }

  &.Contact {
    bottom: 0;
    right: 0;
  }

  &.active-topic {
    background-color: var(--q-dark);
    border: solid 5px var(--q-accent);
    transform: scale(0.9);
    transition: transform 0.7s ease-in;
  }
}

.simon-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-shadow: 0 0 5px black;

  &:focus {
    outline: none;
  }

  &:hover {
    .q-icon {
      transform: scale(1.25);
      z-index: 5;
    }
  }
}
</style>
