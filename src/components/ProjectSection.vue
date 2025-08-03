<script lang="ts" setup>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { type ProjectDetails } from '../shared/models/projectDetails';

const projects = ref<ProjectDetails[]>([
  {
    id: uuidv4(),
    url: 'https://rxjs-wkwd2p.stackblitz.io/',
    src: new URL('../assets/rxjs.svg', import.meta.url).href,
    alt: 'RxJS catalog',
  },
  {
    id: uuidv4(),
    url: 'https://rock-watch-frontend.vercel.app/landing',
    src: new URL('../assets/rock-watch.svg', import.meta.url).href,
    alt: 'Rock Watch',
  },
  {
    id: uuidv4(),
    url: '',
    src: new URL('../assets/storytaim.svg', import.meta.url).href,
    alt: 'StorytAIm',
  },
  {
    id: uuidv4(),
    url: 'https://www.draindata.org/',
    src: new URL('../assets/drainData-noSlogan.svg', import.meta.url).href,
    alt: 'DrainData',
  },
]);
</script>

<template>
  <section>
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

        <q-card-section class="section-container q-mt-md q-pa-sm bg-primary">
          <div class="project-container full-width q-pa-lg">
            <a
              v-for="project in projects"
              :key="project.id"
              :href="project.url"
              class="project-tile"
            >
              <img :src="project.src" :alt="project.alt" />
              <div class="project-overlay text-primary">
                {{ project.alt }}
              </div>
            </a>
          </div>
        </q-card-section>
      </q-card>
    </div>

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

        <q-card-section class="section-container q-pa-sm">
          <div class="project-container full-width q-pa-lg">
            <a
              v-for="project in projects"
              :key="project.id"
              :href="project.url"
              class="project-tile"
            >
              <img :src="project.src" :alt="project.alt" />
              <div class="project-overlay text-primary">
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
$projects-section-background-color: map-get($spring-theme, secondary);
$project-overlay-background-color: map-get($spring-theme, dark);

.project-container {
  // ... existing styles

  .project-tile {
    position: relative;
    max-width: 200px;
    display: inline-block;
    overflow: hidden;

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
      background-color: rgba($project-overlay-background-color, $alpha: 1);
      color: var(--q-accent);
      text-align: center;
      padding: 0.5rem;
      opacity: 0;
      transition: opacity 1s ease;
    }

    &:hover .project-overlay {
      opacity: 1;
    }
  }
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
      background-color: rgba($color: $projects-section-background-color, $alpha: 1);
    }

    .project-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;

      a {
        display: inline-block;
        transition: transform 0.3s ease;
        max-width: 350px;

        img {
          width: 100%;
          height: auto;
          display: block;
        }

        &:hover {
          transform: scale(1.05);
        }
      }

      @media (max-width: $breakpoint-md) {
        flex-direction: column;
        align-items: center;

        a {
          width: 80%;
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
      background-color: rgba($color: $projects-section-background-color, $alpha: 1);
    }

    .project-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;

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

      @media (max-width: $breakpoint-md) {
        flex-direction: column;
        align-items: center;

        a {
          width: 80%;
        }
      }
    }
  }
}
</style>
