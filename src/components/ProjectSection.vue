<script lang="ts" setup>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { type ProjectDetails } from '../shared/models/projectDetails';
import { themeMap } from 'src/shared/constants/theme';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { Project } from '../shared/constants/projects';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);

const storytaimProject = ref<ProjectDetails>({
  name: Project.StorytAIm,
  id: uuidv4(),
  src: new URL('../assets/storytaim.svg', import.meta.url).href,
  alt: Project.StorytAIm,
});
const projects = ref<ProjectDetails[]>([
  {
    name: Project.RxjsCatalog,
    id: uuidv4(),
    url: 'https://rxjs-wkwd2p.stackblitz.io/',
    src: new URL('../assets/rxjs.svg', import.meta.url).href,
    alt: Project.RxjsCatalog,
  },
  {
    name: Project.RockWatch,
    id: uuidv4(),
    url: 'https://rock-watch-frontend.vercel.app/landing',
    src: new URL('../assets/rock-watch.svg', import.meta.url).href,
    alt: Project.RockWatch,
  },

  {
    name: Project.DrainData,
    id: uuidv4(),
    url: 'https://www.draindata.org/',
    src: new URL('../assets/drainData-noSlogan.svg', import.meta.url).href,
    alt: Project.DrainData,
  },
]);
</script>

<template>
  <section>
    <!-- Mobile -->
    <div class="mobile-view full-width">
      <q-card class="full-width">
        <q-card-section class="section-container q-pa-lg">
          <h1 class="q-mt-none text-primary">Projects</h1>
          <q-separator color="primary" class="q-mb-md" />
          <p>
            This collection highlights a range of my work — from low-level reactive programming
            demos to full-stack applications. It includes an RxJS catalog built to visualize complex
            stream logic, a <span class="">MEAN-stack</span> asteroid tracker showcasing real-time
            data integration, and two evolving products: <span>DrainData</span>, a mobile-first
            healthcare tool for post-op fluid tracking, and <span>StorytAIm</span>, a creative AI
            platform for authors to bring their stories to life with voice narration.
          </p>
        </q-card-section>

        <q-card-section
          class="section-container q-mt-md q-pa-sm"
          :style="{ backgroundColor: themeMap[activeTheme]['--q-primary'] }"
        >
          <div class="project-container">
            <a
              v-for="project in projects"
              :key="project.id"
              :href="project.url!"
              class="relative-position q-ma-md"
            >
              <img
                :src="project.src"
                :alt="project.alt"
                class="project-image"
                tooltip="kdfk"
                ref="projectImgRefs"
              />
            </a>

            <div class="storytaim relative-position full-width q-ma-md">
              <div class="under-construction">
                <img src="../assets/under-construction.png" alt="under-construction" />
                <span class="under-construction-text text-primary text-center text-bold">
                  Under Construction
                </span>
              </div>
              <img
                class="storytaim-logo full-width"
                :src="storytaimProject.src"
                :alt="storytaimProject.alt"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Desktop -->
    <div class="desktop-view full-width">
      <q-card class="full-width q-pa-sm bg-transparent">
        <q-card-section class="section-container text-primary q-pa-lg">
          <h1 class="q-mt-none q-mb-xl text-primary text-center">Projects</h1>
          <q-separator color="primary" class="q-mb-md" />
          <p class="text-center q-mb-none">
            This collection highlights a range of my work — from low-level reactive programming
            demos to full-stack applications. It includes an RxJS catalog built to visualize complex
            stream logic, a MEAN-stack asteroid tracker showcasing real-time data integration, and
            two evolving products: DrainData, a mobile-first healthcare tool for post-op fluid
            tracking, and StorytAIm, a creative AI platform for authors to bring their stories to
            life with voice narration.
          </p>
        </q-card-section>

        <q-card-section
          class="section-container q-pa-sm"
          :style="{ backgroundColor: themeMap[activeTheme]['--q-primary'] }"
        >
          <div class="project-container full-width q-pa-lg">
            <a
              v-for="project in projects"
              :key="project.id"
              :href="project.url!"
              class="project-tile"
              :class="{ storytaim: project.alt === 'StorytAIm' }"
            >
              <div v-if="project.alt === 'StorytAIm'" class="under-construction">
                <img src="../assets/under-construction.png" alt="under-construction" />
                <span class="under-construction-text text-primary text-center"
                  >Under Construction</span
                >
              </div>
              <img :src="project.src" :alt="project.alt" />
              <div
                v-if="project.alt != 'StorytAIm'"
                class="project-overlay text-primary"
                :style="{ backgroundColor: themeMap[activeTheme]['--q-dark'] }"
              >
                {{ project.alt }}
              </div>
            </a>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

img {
  width: 100%;
  height: auto;
  display: block;
}

.project-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color: var(--q-accent);
  text-align: center;
  padding: 0.5rem;
  opacity: 0;
  transition: opacity 1s ease;
}

.project-container:hover .project-overlay {
  opacity: 1;
}

.mobile-view {
  @media (min-width: $breakpoint-md) {
    display: none;
  }

  .q-card {
    padding: 1rem;
    background-color: rgba(black, 0.5);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    h1 {
      font-size: 3rem;
      margin-bottom: 2rem;
    }

    .section-container {
      background-color: var(--q-secondary);
    }

    .section-container:nth-child(1) {
      border: solid 4px var(--q-primary);
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    .section-container:nth-child(2) {
      border-radius: 10px;
    }

    .project-tile {
      @media (max-width: $breakpoint-md) {
        width: 80%;
      }

      a {
        transition: transform 0.3s ease;
        max-width: 350px;

        img {
          width: 100%;
          height: auto;
          display: block;
        }

        &:hover {
          transform: scale(1.1);
        }
      }

      .storytaim {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 350px;

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.2); // Your faded overlay
          z-index: 1;
          pointer-events: none;
          border-radius: 10px;
        }

        .under-construction {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: absolute;
          z-index: 2;
          height: auto;
          max-width: 350px;
          top: 60%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;

          img {
            max-width: 200px;
          }

          .under-construction-text {
            font-size: 1.2rem;
          }
        }

        .storytaim-logo {
          max-width: 350px;
        }
      }
    }
  }
}

.desktop-view {
  display: none;

  @media (min-width: $breakpoint-md) {
    display: flex;
  }

  .q-card {
    display: flex !important;
    flex-direction: column;
    flex: 1 1 0%;
    max-width: 100%;
    box-sizing: border-box;
    border-radius: 10px !important;

    h1 {
      font-size: 3rem;
    }

    .section-container:nth-child(2) {
      border-radius: 10px;
    }

    .project-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;

      @media (max-width: $breakpoint-md) {
        flex-direction: column;
        align-items: center;

        a {
          width: 80%;
        }
      }

      a {
        display: inline-block;
        transition: transform 0.3s ease;
        max-width: 200px;

        img {
          width: 100%;
          height: auto;
          display: block;
        }

        &:hover {
          transform: scale(1.05);
        }
      }

      .storytaim {
        position: relative;

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.6); // Your faded overlay
          z-index: 1;
          pointer-events: none;
          border-radius: 10px;
        }

        .under-construction {
          display: flex;
          flex-direction: column;
          position: absolute;
          z-index: 2;
          height: auto;
          max-width: 150px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;

          .under-construction-text {
            text-shadow: 2px 2px 5px var(--q-dark);
            font-size: 1rem;
          }
        }
      }
    }
  }
}
</style>
