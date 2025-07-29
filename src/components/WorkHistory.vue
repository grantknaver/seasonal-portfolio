<script lang="ts" setup>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const employers = ref([
  {
    id: uuidv4(),
    link: 'https://www.amtrak.com/home',
    img: new URL('../assets/amtrak.svg', import.meta.url).href,
    alt: 'Amtrak',
  },
  {
    id: uuidv4(),
    link: 'https://www.lockheedmartin.com/en-us/index.html',
    img: new URL('../assets/lockheed-martin.svg', import.meta.url).href,
    alt: 'Lockheed Martin',
  },
  {
    id: uuidv4(),
    link: 'https://www.labcorp.com/',
    img: new URL('../assets/labcorp.png', import.meta.url).href,
    alt: 'Labcorp',
  },
  {
    id: uuidv4(),
    link: 'https://www.ornl.gov/',
    img: new URL('../assets/ornl.png', import.meta.url).href,
    alt: 'ORNL',
  },
  {
    id: uuidv4(),
    link: 'https://gametimehero-coming-soon.web.app/',
    img: new URL('../assets/gametime-hero.png', import.meta.url).href,
    alt: 'Gametime Hero',
  },
]);
</script>

<template>
  <!-- Start Works Area -->

  <section class="mobile-view"></section>
  <section class="desktop-view column col items-center bg-primary">
    <div>
      <div v-for="employer in employers" :key="employer.id" class="q-pa-md">
        <div>
          <a :href="employer.link">
            <img :src="employer.img" :alt="employer.alt" />
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- <div class="desktop-view">
    <section class="container column col justify-center items-center bg-primary">
      <div class="container">
        <div v-for="employer in employers" :key="employer.id">
          <div class="">
            <div class="">
              <a :href="employer.link">
                <img :src="employer.img" :alt="employer.alt" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div> -->
</template>

<style scoped lang="scss">
img {
  max-width: 300px;
}
</style>
