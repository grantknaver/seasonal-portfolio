<script setup lang="ts">
import { TopicName } from '../shared/constants/topicName';
import { useMainStore } from '../stores/main';
import { type Topic } from '../shared/types/topic';
import { v4 as uuidv4 } from 'uuid';
import { storeToRefs } from 'pinia';
import {
  mdiPackageVariantClosed,
  mdiInformation,
  mdiEmailOutline,
  mdiBookOpenPageVariant,
} from '@quasar/extras/mdi-v7';
import { onMounted, ref } from 'vue';

const mainStore = useMainStore();
const { activeTopic } = storeToRefs(mainStore);
const labelsVisible = ref(false);

const topics: Topic[] = [
  {
    id: uuidv4(),
    name: TopicName.About,
    icon: mdiInformation,
    label: TopicName.About,
  },
  {
    id: uuidv4(),
    name: TopicName.Contact,
    icon: mdiEmailOutline,
    label: TopicName.Contact,
  },
  {
    id: uuidv4(),
    name: TopicName.Packages,
    icon: mdiPackageVariantClosed,
    label: 'Packages',
  },
  {
    id: uuidv4(),
    name: 'Case Studies' as TopicName,
    icon: mdiBookOpenPageVariant,
    label: 'Studies',
  },
];

const selectTopic = (name: TopicName) => {
  if (name === activeTopic.value) {
    mainStore.SET_ACTIVE_TOPIC(null);
  } else {
    mainStore.SET_ACTIVE_TOPIC(name);
  }

  mainStore.SET_PACKAGE_INTEREST_TEXT('');
};

onMounted(() => {
  window.setTimeout(() => {
    labelsVisible.value = true;
  }, 1000);
});
</script>
<template>
  <div class="simon">
    <div
      v-for="topic in topics"
      :key="topic.id"
      class="simon-quadrant"
      :class="[topic.name.replace(' ', ''), { 'active-topic': topic.name === activeTopic }]"
      tabindex="0"
      style="padding: 1rem"
      @click.stop="selectTopic(topic.name)"
    >
      <a class="simon-link text-body-2">
        <q-icon :name="topic.icon" size="80px" />
        <span class="label" :class="{ 'labels-visible': labelsVisible }">{{ topic.label }}</span>
      </a>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '/src/css/_tokens.scss' as tokens;

.simon {
  position: relative;
  border-radius: 10px;
  overflow: visible;
  width: 250px;
  height: 250px;
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
  border: solid 2px rgba($color: tokens.$ivory, $alpha: 0.5);
  background: var(--q-dark);
  z-index: 1;

  &:hover {
    transform: scale(0.9);
    z-index: 10;
    background: var(--q-secondary);
    border: solid 4px var(--q-accent);
    cursor: pointer;

    .q-icon {
      opacity: 0.1;
      color: tokens.$ink;
    }
  }

  &.Packages {
    top: 0;
    right: 0;
  }

  &.CaseStudies {
    top: 0;
    left: 0;
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
    background-color: var(--q-secondary);
    border: solid 5px var(--q-accent);
    transform: scale(0.9);
    transition: transform 0.7s ease-in;

    .q-icon {
      opacity: 0.1;
      color: tokens.$ink;
    }
  }
}

.simon-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-shadow: 0 0 5px var(--q-dark);
  position: relative;

  .label {
    position: absolute;
    opacity: 0;
    transition: opacity 0.8s ease-out;
  }

  .labels-visible {
    opacity: 1;
  }

  .q-icon {
    opacity: 0.04;
  }

  &:focus {
    outline: none;
  }
}
</style>
