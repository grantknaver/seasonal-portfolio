<script lang="ts" setup>
import { ref } from 'vue';
const slide = ref(0);

const testimonials = [
  {
    text: 'This service was exactly what I needed. Fast, professional, and effective.',
    author: 'Lisa Copeland',
    picUrl: new URL('../assets/lisa.png', import.meta.url).href,
  },
  {
    text: 'Excellent support and quick turnaround. Highly recommended!',
    author: 'Bryce Morrison',
    picUrl: new URL('../assets/bryce.png', import.meta.url).href,
  },
];
</script>

<template>
  <q-carousel
    v-model="slide"
    arrows
    prev-icon="chevron_left"
    next-icon="chevron_right"
    animated
    control-type="flat"
    control-color="primary"
    height="250px"
    class="bg-grey-1 text-dark rounded-borders"
    control-text-color="accent"
  >
    <q-carousel-slide
      v-for="(testimonial, index) in testimonials"
      :key="index"
      :name="index"
      class="row items-center justify-center q-pa-md"
    >
      <div class="column items-center q-pa-md">
        <div class="text-subtitle1 text-center q-mb-sm">“{{ testimonial.text }}”</div>
        <div class="text-bold text-secondary text-center">— {{ testimonial.author }}</div>
        <img class="q-mt-md" :src="testimonial.picUrl" alt="testimonal reference image" />
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<style lang="scss" scoped>
.q-carousel {
  max-width: 600px;
  box-shadow: 5px 10px 20px var(--q-dark);

  img {
    width: 50px;
    border-radius: 100px;
  }
}
</style>
