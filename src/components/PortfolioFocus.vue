<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { Theme } from '../shared/constants/theme';
import { useMainStore } from '../stores/main';
import { onMounted, onBeforeUnmount } from 'vue';
import { type Topic } from '../shared/models/topic';
import { v4 as uuidv4 } from 'uuid';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);

const topics: Topic[] = [
  { id: uuidv4(), name: 'resume', icon: 'description', label: '' },
  { id: uuidv4(), name: 'about', icon: 'info', label: 'About', theme: Theme.Winter },
  {
    id: uuidv4(),
    name: 'projects',
    icon: 'folder',
    label: 'Projects',
    theme: Theme.Spring,
  },
  { id: uuidv4(), name: 'contact', icon: 'mail', label: 'Contact', theme: Theme.Summer },
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
  <div class="container col column items-center full-width">
    <div class="simon-circle hidden">
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

    <hr class="hidden q-mt-lg" />
    <p class="q-ma-none text-primary text-center bounce-text">Grant Knaver</p>
    <hr />
    <p class="q-ma-none text-secondary text-center bounce-text">Fullstack Developer</p>
    <transition name="fade-up" appear>
      <blockquote class="fancy-quote text-primary">
        "Full-stack JavaScript developer with 7+ years of experience building responsive, real-world
        apps using Angular, Vue, and Node.js."
      </blockquote>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.container {
  justify-content: center;

  @media (min-width: $breakpoint-md) {
    position: relative;
    padding: initial;
  }

  p {
    line-height: normal;
    text-shadow: 2px 2px 2px var(--q-dark);
  }

  a {
    color: var(--q-primary);
    text-shadow: 2px 2px 5px var(--q-dark);
    font-size: 2rem;
    cursor: pointer;

    &:hover {
      text-shadow: 2px 2px 5px var(--q-accent);
    }
  }

  hr {
    background-color: var(--q-primary);
    width: 100px;

    @media (min-width: $breakpoint-xs) {
      display: initial !important;
    }
  }

  hr:nth-of-type(2) {
    display: none !important;
  }
}

.container p:nth-of-type(1) {
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 2.2rem;
  text-transform: uppercase;
}

.container p:nth-of-type(2) {
  font-size: 1rem;
  color: var(--q-secondary);
}

.simon-circle {
  position: relative;
  border-radius: 10px;
  overflow: visible;

  @media (min-width: $breakpoint-xs) {
    display: initial !important;
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
  border: solid 4px rgba($color: #f4e7e1, $alpha: 0.5);
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

.fancy-quote {
  text-align: center;
  width: 90%;
  font-style: italic;
  font-family: Georgia, serif;
  border-left: 4px solid var(--q-primary);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background-color: rgba($color: #d5451b, $alpha: 0.5);
  position: relative;
  text-shadow: 1px 1px 2px var(--q-dark);

  @media (min-width: $breakpoint-xs) {
    display: none !important;
  }
}

.fade-up-enter-active {
  animation: fadeUp 0.8s ease-out both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
