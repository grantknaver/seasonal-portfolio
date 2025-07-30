<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const employers = reactive([
  {
    id: uuidv4(),
    link: 'https://www.amtrak.com/home',
    img: new URL('../assets/amtrak.svg', import.meta.url).href,
    alt: 'Amtrak',
  },
  {
    id: uuidv4(),
    link: 'https://www.lockheedmartin.com/en-us/index.html',
    img: new URL('../assets/lockheed-martin.png', import.meta.url).href,
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

const slide = ref(employers[0]?.id);
</script>

<template>
  <q-carousel
    v-model="slide"
    swipeable
    animated
    infinite
    control-type="regular"
    arrows
    navigation
    height="300px"
    class="bg-grey-1 text-dark"
    dark
    control-color="dark"
  >
    <q-carousel-slide
      v-for="employer in employers"
      :key="employer.id"
      :name="employer.id"
      class="column items-center justify-center"
    >
      <a :href="employer.link" target="_blank" rel="noopener">
        <img :src="employer.img" :alt="employer.alt" style="max-height: 150px; max-width: 100%" />
      </a>
    </q-carousel-slide>
  </q-carousel>
</template>

<style scoped lang="scss">
img {
  max-width: 300px;
}
</style>
