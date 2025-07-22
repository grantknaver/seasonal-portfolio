<template>
  <q-header class="bg-transparent text-black">
    <q-toolbar class="bg-transparent q-pa-lg">
      <!-- Logo / Title -->
      <q-toolbar-title> My Portfolio </q-toolbar-title>

      <!-- Desktop Tabs -->
      <div class="tabs">
        <q-tabs
          v-model="tab"
          dense
          class="text-body1 text-primary"
          align="right"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab
            v-for="item in tabs"
            class="text-primary"
            :key="item.name"
            :name="item.name"
            :label="item.label"
            @click="goTo(item.href)"
          />
        </q-tabs>
      </div>

      <!-- Mobile Menu Button -->
      <q-btn class="menu-button" flat dense round icon="menu" @click="mobileMenu = !mobileMenu" />

      <!-- Mobile Drawer Menu -->
      <q-drawer v-model="mobileMenu" side="right" overlay behavior="mobile" bordered>
        <q-list>
          <q-item
            v-for="item in tabs"
            :key="item.name"
            clickable
            @click="
              () => {
                goTo(item.href);
                mobileMenu = false;
              }
            "
          >
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const tab = ref('');
const mobileMenu = ref(false);

const tabs = [
  { name: 'home', label: 'Home', href: '#home' },
  { name: 'about', label: 'About', href: '#about' },
  { name: 'projects', label: 'Projects', href: '#projects' },
  { name: 'contact', label: 'Contact', href: '#contact' },
];

function goTo(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
</script>

<style scoped lang="scss">
@import '../css/main.scss';

.q-header {
  border-bottom: 5px solid var(--q-primary);
}

.menu-button {
  @media (min-width: $breakpoint-md) {
    display: none;
  }
}

.tabs {
  display: none;
  @media (min-width: $breakpoint-md) {
    display: initial;
  }
}
</style>
