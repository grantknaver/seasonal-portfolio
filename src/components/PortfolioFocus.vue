<script lang="ts" setup>
import { Theme } from '../shared/constants/theme';
import { useMainStore } from '../stores/main';
import { onMounted, onBeforeUnmount } from 'vue';
import { type Topic } from '../shared/models/topic';
import { v4 as uuidv4 } from 'uuid';
import { storeToRefs } from 'pinia';

const mainStore = useMainStore();
const topics: Topic[] = [
  { id: uuidv4(), name: 'resume', icon: 'description', label: '' },
  {
    id: uuidv4(),
    name: 'about',
    icon: 'info',
    label: 'About',
    theme: Theme.Winter,
    seasonIcon: 'ac_unit',
  },
  {
    id: uuidv4(),
    name: 'projects',
    icon: 'folder',
    label: 'Projects',
    theme: Theme.Spring,
    seasonIcon: 'eco',
  },
  {
    id: uuidv4(),
    name: 'contact',
    icon: 'mail',
    label: 'Contact',
    theme: Theme.Summer,
    seasonIcon: 'wb_sunny',
  },
];

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});

const selectTopic = (name: string, theme?: Theme) => {
  if (name !== 'resume') {
    mainStore.SET_ACTIVE_TOPIC(name);
  }
  mainStore.SET_ACTIVE_THEME(theme ?? Theme.Fall);
};

const { activeTheme } = storeToRefs(mainStore);

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const simonCircle = document.querySelector('.simon-circle');
  if (simonCircle && !simonCircle.contains(event.target as Node)) {
    mainStore.SET_ACTIVE_TOPIC(null);
    mainStore.SET_ACTIVE_THEME(Theme.Fall);
  }
};
</script>

<template>
  <div class="container col column justify-center items-center">
    <div class="mobile-view col column items-center justify-center full-width">
      <p class="q-ma-none text-primary bounce-text">Grant Knaver</p>
      <p class="q-ma-none text-secondary">Fullstack Developer</p>
      <hr />
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
            :id="topic.name"
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
    <div class="desktop-view col column justify-center items-center full-width">
      <div class="simon-circle">
        <div
          v-for="topic in topics"
          :key="topic.id"
          class="simon-quadrant"
          :class="[topic.name, { 'active-topic': topic.theme === activeTheme }]"
          tabindex="0"
          style="padding: 1rem"
          @click.stop="selectTopic(topic.name, topic.theme)"
        >
          <a v-if="topic.name !== 'resume'" class="simon-link">
            <q-icon :name="topic.icon" size="32px" />
            <q-tooltip anchor="center middle" self="top left">
              {{ topic.label }}
            </q-tooltip>
          </a>
          <a v-else class="text-primary text-body2" label="Resume" flat>Resume</a>
        </div>
      </div>
      <hr class="q-mt-lg" />
      <p class="q-ma-none text-primary">Grant Knaver - Desktop</p>
      <p class="q-ma-none text-secondary">Fullstack Developer</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

$winterBackground: map-get($winter-theme, accent);
$winterColor: map-get($winter-theme, primary);
$winterCardColor: map-get($winter-theme, dark);

$springBackground: map-get($spring-theme, accent);
$springColor: map-get($spring-theme, dark);

$summerBackground: map-get($summer-theme, secondary);
$summerColor: map-get($summer-theme, dark);

.container {
  @media (min-width: $breakpoint-md) {
    position: relative;
    padding: initial;
  }

  hr {
    background-color: var(--q-primary);
    width: 100px;
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

    #about {
      background-color: $winterBackground;
      color: $winterColor;

      .q-card {
        color: $winterCardColor;
      }
    }

    #projects {
      background-color: $springBackground;
      color: $springColor;
    }

    #contact {
      background-color: $summerBackground;
      color: $summerColor;
    }
  }

  .desktop-view {
    display: none;

    @media (min-width: $breakpoint-md) {
      display: flex;
    }

    .simon-circle {
      position: relative;
      border-radius: 10px;
      overflow: visible;

      @media (min-width: $breakpoint-xs) {
        width: 350px;
        height: 350px;
        margin-top: 3%;
      }

      @media (min-width: $breakpoint-sm) {
        width: 375px;
        height: 375px;
      }
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

        &.about {
          background-color: var(--q-secondary);
        }

        &.projects {
          background-color: var(--q-accent);
        }

        &.contact {
          background-color: var(--q-secondary);
        }
      }

      &.resume {
        background-color: transparent;
        border: none;
        top: 0;
        left: 0;

        a {
          text-shadow: 2px 2px var(--q-dark);
        }
      }

      &.about {
        top: 0;
        right: 0;
      }

      &.projects {
        bottom: 0;
        left: 0;
      }

      &.contact {
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
      font-size: 2rem;
      cursor: pointer;
    }
  }
}
</style>
