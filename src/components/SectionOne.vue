<script lang="ts" setup>
// import ClientTestimonals from './ClientTestimonals.vue';
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const selectedSeason = ref('Fall');

const seasons = [
  { name: 'Winter', icon: 'ac_unit', color: 'blue-4' },
  { name: 'Spring', icon: 'spa', color: 'green-5' },
  { name: 'Summer', icon: 'wb_sunny', color: 'amber-5' },
  { name: 'Fall', icon: 'park', color: 'orange-6' },
];

const buttonSize = computed(() => ($q.screen.gt.xs ? 'md' : 'lg'));
</script>

<template>
  <div class="container column justify-start items-center full-width">
    <h1 class="text-primary text-center q-mt-md q-mb-md">Grant Knaver</h1>
    <p class="text-secondary q-mb-md">Fullstack Developer</p>
    <hr />
    <a flat size="lg">Resume</a>

    <!-- <div class="testimonals">
      <ClientTestimonals></ClientTestimonals>
    </div> -->

    <div class="seasons q-gutter-md row items-center justify-center q-mt-lg">
      <q-btn
        v-for="season in seasons"
        :key="season.name"
        round
        dense
        :icon="season.icon"
        :color="selectedSeason === season.name ? season.color : 'grey-5'"
        :text-color="selectedSeason === season.name ? 'white' : 'dark'"
        @click="selectedSeason = season.name"
        :aria-label="season.name"
        :size="buttonSize"
      >
        <q-tooltip anchor="bottom middle" self="top middle">
          {{ season.name }}
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.container {
  background-image: url('../assets/autumn-forestry.jpg');
  background-size: cover;
  background-position: center;
  border-bottom: 4px solid var(--q-primary);
  padding-top: 5rem;
  min-height: calc(100vh - 94px);

  @media (min-width: $breakpoint-sm) {
    border-bottom: 2px solid var(--q-primary);
  }

  @media (min-width: $breakpoint-md) {
    min-height: 100vh; /* or whatever size you want */
    padding: initial;
    justify-content: center;
  }

  h1 {
    font-size: 4.5rem;
    text-shadow: 2px 2px 5px var(--q-dark);

    @media (min-width: $breakpoint-md) {
      font-size: 6rem;
    }
  }

  p {
    font-size: 1.25rem;
    text-shadow: 2px 2px 2px var(--q-dark);
    @media (min-width: $breakpoint-md) {
      font-size: 1.5rem;
    }
    span {
      color: var(--q-secondary);
      font-size: 1.5rem;
    }
  }

  a {
    color: var(--q-primary);
    text-shadow: 2px 2px 5px var(--q-dark);
    font-size: 2rem;
    cursor: pointer;
  }

  a:hover {
    text-shadow: 2px 2px 5px var(--q-accent);
  }

  hr {
    background-color: var(--q-primary);
    width: 100px;
  }

  .testimonals {
    max-width: 90%;
  }

  .q-select {
    max-width: 90%;
  }

  .seasons {
    @media (min-width: $breakpoint-md) {
      margin-bottom: 10%;
    }
  }
}
</style>
