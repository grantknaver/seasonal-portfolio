<script setup lang="ts">
import { TopicName } from '../shared/constants/topicName';
import { useMainStore } from '../stores/main';
import { type Topic } from '../shared/types/topic';
import { v4 as uuidv4 } from 'uuid';
import { storeToRefs } from 'pinia';
import {
  mdiInformation,
  mdiEmailOutline,
  mdiMagnify,
  mdiViewGalleryOutline,
} from '@quasar/extras/mdi-v7';
import { onMounted, ref } from 'vue';

const mainStore = useMainStore();
const { activeTopic } = storeToRefs(mainStore);
const labelsVisible = ref(false);

const props = withDefaults(defineProps<{ layout?: 'grid' | 'row' }>(), {
  layout: 'grid',
});

const topics: Topic[] = [
  {
    id: uuidv4(),
    name: TopicName.Lens,
    icon: mdiMagnify,
    label: TopicName.Lens,
  },
  {
    id: uuidv4(),
    name: TopicName.Examples,
    icon: mdiViewGalleryOutline,
    label: TopicName.Examples,
  },
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
  <div class="simon" :class="`simon--${props.layout}`">
    <div
      v-for="topic in topics"
      :key="topic.id"
      class="simon-quadrant"
      :class="[topic.name, { 'active-topic': topic.name === activeTopic }]"
      tabindex="0"
      @click.stop="selectTopic(topic.name)"
    >
      <a class="simon-link text-body-2">
        <q-icon :name="topic.icon" />
        <span class="label" :class="{ 'labels-visible': labelsVisible }">{{ topic.label }}</span>
      </a>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '../css/tokens' as tokens;

.simon {
  position: relative;
  border-radius: 10px;
  overflow: visible;

  /* ---------- Grid (default) ---------- */

  &--grid {
    width: 250px;
    height: 250px;

    .simon-quadrant {
      position: absolute;
      width: 49%;
      height: 49%;
      padding: 1rem;

      &.Lens {
        top: 0;
        left: 0;
      }

      &.Examples {
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
    }

    .simon-link .q-icon {
      font-size: 80px;
    }
  }

  /* ---------- Row ---------- */

  &--row {
    display: flex;
    gap: 0.5rem;

    .simon-quadrant {
      position: static;
      width: 104px;
      height: 72px;
      padding: 0.5rem;
    }

    .simon-link .q-icon {
      font-size: 42px;
    }
  }
}

/* ---------- Shared tile ---------- */

.simon-quadrant {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  transform-origin: center;
  border-radius: 10px;
  border: solid 2px rgba($color: white, $alpha: 0.5);
  background: var(--q-accent-soft);
  z-index: 1;

  .simon-link {
    display: flex;
    flex-direction: column;
  }

  .q-icon {
    color: var(--q-primary);
  }

  .label {
    position: static;
    opacity: 1;
    font-size: 0.5rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    font-weight: 400;
    color: color-mix(in srgb, var(--q-secondary) 80%, transparent);
    text-align: center;
  }

  &:hover {
    transform: scale(0.9);
    z-index: 10;
    background: var(--q-secondary);
    border: solid 4px var(--q-accent);
    cursor: pointer;

    .q-icon {
      color: var(--q-accent);
    }

    .label {
      color: color-mix(in srgb, var(--q-dark) 60%, transparent);
      font-weight: 800;
    }
  }

  &.active-topic {
    background-color: var(--q-secondary);
    border: solid 5px var(--q-accent);
    transform: scale(0.9);
    transition: transform 0.7s ease-in;

    .q-icon {
      color: var(--q-accent);
    }

    .label {
      color: color-mix(in srgb, var(--q-dark) 60%, transparent);
      font-weight: 800;
    }
  }
}
</style>
