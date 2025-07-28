<script lang="ts" setup>
import { Theme } from '../shared/constants/theme';
import { useMainStore } from '../stores/main';
import { type Topic } from '../shared/models/topic';
import { v4 as uuidv4 } from 'uuid';
import { storeToRefs } from 'pinia';
import { TopicName } from 'src/shared/constants/topicName';

const mainStore = useMainStore();
const topics: Topic[] = [
  { id: uuidv4(), name: TopicName.Resume, icon: 'description', label: '' },
  {
    id: uuidv4(),
    name: TopicName.About,
    icon: 'info',
    label: TopicName.About,
    theme: Theme.Winter,
    seasonIcon: 'ac_unit',
  },
  {
    id: uuidv4(),
    name: TopicName.Projects,
    icon: 'folder',
    label: TopicName.Projects,
    theme: Theme.Spring,
    seasonIcon: 'eco',
  },
  {
    id: uuidv4(),
    name: TopicName.Contact,
    icon: 'mail',
    label: TopicName.Contact,
    theme: Theme.Summer,
    seasonIcon: 'wb_sunny',
  },
];

const selectTopic = (name: TopicName, theme?: Theme) => {
  if (name === activeTopic.value) {
    mainStore.SET_ACTIVE_TOPIC(null);
    mainStore.SET_ACTIVE_THEME(Theme.Fall);
  } else {
    if (name !== TopicName.Resume) {
      mainStore.SET_ACTIVE_TOPIC(name);
    }
    mainStore.SET_ACTIVE_THEME(theme ?? Theme.Fall);
  }
};

const { activeTheme, activeTopic } = storeToRefs(mainStore);
</script>

<template>
  <div class="container column col justify-center items-center">
    <div class="mobile-view column items-center justify-start full-width">
      <div inline-actions class="full-width text-white bg-accent q-mt-lg q-mb-sm q-pa-md">
        <p class="q-ma-none text-primary bounce-text">Grant Knaver</p>
        <p class="q-ma-none text-secondary">Fullstack Developer</p>
      </div>
      <blockquote
        class="full-width q-pa-md text-center"
        cite="http://www.worldwildlife.org/who/index.html"
      >
        "For 50 years, WWF has been protecting the future of nature. The world's leading
        conservation organization, WWF works in 100 countries and is supported by 1.2 million
        members in the United States and close to 5 million globally."
      </blockquote>
      <hr class="full-width" />
      <q-list padding class="full-width">
        <q-item
          v-for="topic in topics.slice(1)"
          :key="topic.id"
          :name="topic.name"
          class="full-width bg-transparent q-pa-none q-mb-sm"
        >
          <q-expansion-item
            class="full-width"
            :icon="topic.seasonIcon"
            :label="topic.label"
            @click.stop="selectTopic(topic.name, topic.theme)"
            :model-value="topic.name === activeTopic"
            :header-class="['text-dark', 'bg-secondary']"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit
                eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores
                architecto suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-item>
      </q-list>
    </div>
    <div class="desktop-view flex col column justify-center items-center full-width">
      <div class="simon-circle q-mt-xl">
        <div
          v-for="topic in topics"
          :key="topic.id"
          class="simon-quadrant"
          :class="[topic.name, { 'active-topic': topic.theme === activeTheme }]"
          tabindex="0"
          style="padding: 1rem"
          @click.stop="selectTopic(topic.name, topic.theme)"
        >
          <a v-if="topic.name !== TopicName.Resume" class="simon-link">
            <q-icon :name="topic.icon" size="32px" />
            <q-tooltip anchor="center middle" self="top left">
              {{ topic.label }}
            </q-tooltip>
          </a>
          <a v-else class="text-primary text-body2" label="Resume" flat>Resume</a>
        </div>
      </div>
      <hr class="q-mt-lg" />
      <p class="q-ma-none text-primary">Grant Knaver</p>
      <p class="q-ma-none text-secondary">Fullstack Developer</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.container {
  @media (min-width: $breakpoint-md) {
    position: relative;
    padding: initial;
  }

  p {
    text-shadow: 2px 2px 2px var(--q-dark);
  }

  p:nth-of-type(1) {
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 2.2rem;
    text-transform: uppercase;
  }

  p:nth-of-type(2) {
    font-size: 1rem;
    color: var(--q-secondary);
    text-shadow: 2px 2px 2px var(--q-dark);
  }

  .mobile-view {
    max-width: 90%;
    @media (min-width: $breakpoint-md) {
      display: none;
    }

    blockquote {
      border-left: 4px solid var(--q-primary);
      padding: 1rem 1.5rem;
      font-style: italic;
      background-color: rgba(0, 0, 0, 0.5);
      color: var(--q-primary);
      text-shadow: 1px 1px 20px var(--q-dark);
    }
  }

  .desktop-view {
    display: none;

    @media (min-width: $breakpoint-md) {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    hr {
      background-color: var(--q-primary);
      width: 100px;
    }

    .simon-circle {
      position: relative;
      border-radius: 10px;
      overflow: visible;
      width: 325px;
      height: 325px;
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

      &:hover {
        transform: scale(1.25);
        z-index: 10;

        &.About {
          background-color: var(--q-secondary);
        }

        &.Projects {
          background-color: var(--q-accent);
        }

        &.Contact {
          background-color: var(--q-secondary);
        }
      }

      &.Resume {
        background-color: transparent;
        border: none;
        top: 0;
        left: 0;

        a {
          text-shadow: 2px 2px var(--q-dark);
        }
      }

      &.About {
        top: 0;
        right: 0;
      }

      &.Projects {
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

    a {
      color: var(--q-primary);
      font-size: 1.8rem;
      cursor: pointer;
    }
  }
}
</style>
