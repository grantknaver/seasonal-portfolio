<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Theme } from '../shared/constants/theme';
import { useMainStore } from '../stores/main';
import { type Topic } from '../shared/models/topic';
import { v4 as uuidv4 } from 'uuid';
import { storeToRefs } from 'pinia';
import { TopicName } from 'src/shared/constants/topicName';
import AboutSection from '../components/AboutSection.vue';
import SkillsSection from '../components/SkillsSection.vue';
import ProjectSection from 'src/components/ProjectSection.vue';
import ContactSection from '../components/ContactSection.vue';

const currentBg = ref('');
const backgroundMap: Record<Theme, string> = {
  [Theme.Fall]: new URL('../assets/autumn-forestry.jpg', import.meta.url).href,
  [Theme.Winter]: new URL('../assets/snowy-winter-landscape.jpg', import.meta.url).href,
  [Theme.Spring]: new URL('../assets/beautiful-forest-spring-season.jpg', import.meta.url).href,
  [Theme.Summer]: new URL('../assets/beautiful-shot-forest.jpg', import.meta.url).href,
};
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
    name: TopicName.Skills,
    icon: 'code',
    label: TopicName.Skills,
    theme: Theme.Summer,
    seasonIcon: 'wb_sunny',
  },
];
const { activeTheme, activeTopic } = storeToRefs(mainStore);
const expandedPanel = ref<TopicName | null>(null);

onMounted(() => {
  currentBg.value = backgroundMap[Theme.Fall];
});

watch(activeTopic, (newTopic) => {
  if (!newTopic) return;

  const tryScroll = () => {
    const target = document.getElementById(newTopic);
    const header = document.querySelector('.q-header');
    const headerHeight = header?.clientHeight ?? 0;

    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: offsetTop - headerHeight,
        behavior: 'smooth',
      });
    }
  };

  tryScroll();
});

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
</script>

<template>
  <q-page class="page-container column col q-pa-md">
    <img class="q-pt-sm logo" style="max-width: 200px" src="../assets/logo.png" alt="logo" />
    <div class="sub-container column col items-center">
      <section class="mobile-view column items-center full-width">
        <div inline-actions class="flex full-width text-white bg-accent q-mt-lg q-mb-sm q-pa-md">
          <span>
            <p class="q-ma-none text-primary bounce-text">Grant Knaver</p>
            <p
              class="q-ma-none"
              :class="{
                'text-warning': activeTheme !== Theme.Summer && activeTheme !== Theme.Fall,
                'text-primary': activeTheme === Theme.Summer || activeTheme === Theme.Fall,
              }"
            >
              Fullstack Developer
            </p>
          </span>
          <q-space></q-space>
          <q-btn size="lg" color="dark">Resume</q-btn>
        </div>
        <blockquote
          class="full-width q-pa-md text-center"
          cite="http://www.worldwildlife.org/who/index.html"
        >
          "Successful software is built not just with code, but with trust. The best developers
          listen first — not to respond, but to understand. Because building the right thing is just
          as important as building it right."
        </blockquote>

        <q-list padding class="full-width q-pa-none">
          <q-item
            v-for="topic in topics.slice(1)"
            :key="topic.id"
            :name="topic.name"
            class="full-width bg-transparent q-pa-none q-mb-sm"
          >
            <q-expansion-item
              :model-value="expandedPanel === topic.name"
              @update:model-value="
                (val) => {
                  if (val) {
                    expandedPanel = topic.name;
                    selectTopic(topic.name, topic.theme); // only when opening
                  } else {
                    expandedPanel = null;
                  }
                }
              "
              :icon="topic.seasonIcon"
              :label="topic.label"
              :header-class="['text-dark', 'bg-secondary']"
              class="full-width"
            >
              <template v-if="topic.name === TopicName.About">
                <div class="full-width" :id="TopicName.About">
                  <AboutSection />
                </div>
              </template>
              <template v-if="topic.name === TopicName.Skills">
                <div :id="TopicName.Skills">
                  <SkillsSection />
                </div>
              </template>
              <template v-if="topic.name === TopicName.Projects">
                <div class="bg-green full-width" :id="TopicName.Projects">
                  <ProjectSection />
                </div>
              </template>
            </q-expansion-item>
          </q-item>
        </q-list>
        <q-separator color="secondary" class="full-width q-mt-xs q-mb-lg"></q-separator>
        <div class="full-width" :id="TopicName.Contact">
          <ContactSection />
        </div>
      </section>
      <section class="desktop-view flex col column justify-center items-center full-width">
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
        <p class="q-ma-none text-warning">Fullstack Developer</p>
      </section>
    </div>
    <q-btn
      @click.stop="selectTopic(TopicName.Contact)"
      round
      class="contact-btn"
      :color="activeTopic === TopicName.Contact ? 'dark' : 'accent'"
      size="lg"
      icon="mail"
    >
      <q-tooltip anchor="center middle" self="top left"> Contact </q-tooltip>
    </q-btn>
  </q-page>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.page-container {
  background-color: rgba($color: white, $alpha: 0.7);
  position: relative;

  @media (min-width: $breakpoint-md) {
    background-color: initial;
  }

  .logo {
    display: none;
    position: absolute;
    top: 3%;
    left: 3%;

    @media (min-width: $breakpoint-md) {
      display: flex !important;
      z-index: 10;
    }
  }

  .sub-container {
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
      max-width: 800px;
      @media (min-width: $breakpoint-md) {
        display: none;
      }

      blockquote {
        border-left: 4px solid var(--q-dark);
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
        z-index: 1;

        &:hover {
          transform: scale(1.25);
          z-index: 10;

          &.About {
            background-color: var(--q-secondary);
          }

          &.Projects {
            background-color: var(--q-accent);
          }

          &.Skills {
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

        &.Skills {
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

  .contact-btn {
    display: none;
    position: absolute;
    max-width: 80px;
    bottom: 2rem;
    right: 2rem;

    @media (min-width: $breakpoint-md) {
      display: initial;
    }
  }
}

// .q-expansion-item {
//   width: 100%;
// }
</style>
