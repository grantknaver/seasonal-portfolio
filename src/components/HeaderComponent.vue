<script lang="ts" setup>
import { ref } from 'vue';
const mobileMenu = ref(false);

const tabs = [
  { name: 'home', label: 'Home', href: '#home' },
  { name: 'about', label: 'About', href: '#about' },
  { name: 'projects', label: 'Projects', href: '#projects' },
  { name: 'contact', label: 'Contact', href: '#contact' },
];

// function goTo(href: string) {
//   const el = document.querySelector(href);
//   if (el) el.scrollIntoView({ behavior: 'smooth' });
// }
</script>

<template>
  <q-toolbar class="bg-transparent q-pa-lg">
    <!-- Logo / Title -->
    <q-toolbar-title>
      <img
        class="q-pt-sm"
        style="max-width: 200px"
        src="../assets/logo.png"
        alt="glkFreelance logo"
      />
    </q-toolbar-title>
    <!-- Mobile Menu Button -->
    <q-btn
      color="primary"
      class="menu-button"
      flat
      dense
      round
      icon="menu"
      @click="mobileMenu = !mobileMenu"
    />

    <!-- Mobile Drawer Menu -->
    <q-drawer v-model="mobileMenu" side="right" overlay behavior="mobile" bordered>
      <q-list>
        <q-item
          v-for="item in tabs"
          :key="item.name"
          clickable
          @click="
            () => {
              mobileMenu = false;
            }
          "
        >
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </q-toolbar>
</template>

<style scoped lang="scss">
@import '../css/main.scss';
</style>
