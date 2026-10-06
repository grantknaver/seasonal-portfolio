<script setup lang="ts">
import { computed } from 'vue';
import { patternIndexUrl } from '../shared/constants/patternIndex';

/* A quiet doorway into the Pattern Index: small label, one line, an arrow that leans out on hover.
   Inherits the panel it sits in (light or dark) instead of looking like an outbound ad. */
const props = withDefaults(
  defineProps<{ path?: string; text: string; kicker?: string; tone?: 'light' | 'dark' }>(),
  { path: '/', kicker: '', tone: 'light' },
);
const href = computed(() => patternIndexUrl(props.path));
</script>

<template>
  <a class="pi-link" :class="`pi-link--${tone}`" :href="href" target="_blank" rel="noopener">
    <span v-if="kicker" class="pi-link__kicker">{{ kicker }}</span>
    <span class="pi-link__text">{{ text }}</span>
    <span class="pi-link__arrow" aria-hidden="true">&#8599;</span>
    <span class="pi-link__sr">(opens the Pattern Index in a new tab)</span>
  </a>
</template>

<style scoped lang="scss">
$blue: #1260f0;
$navy: #0a3487;
$ease: cubic-bezier(0.22, 1, 0.36, 1);

.pi-link {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.15rem 0.5rem;
  align-items: baseline;
  justify-self: start;
  color: $navy;
  font-size: 0.86rem;
  font-weight: 700;
  line-height: 1.35;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid $blue;
    outline-offset: 3px;
    border-radius: 4px;
  }
}

.pi-link__kicker {
  color: $blue;
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Underline draws in from the left on hover, like the rest of the site's reveals. */
.pi-link__text {
  background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
  transition: background-size 0.35s $ease;
}

.pi-link__arrow {
  display: inline-block;
  color: $blue;
  transition: transform 0.35s $ease;
}

.pi-link:hover,
.pi-link:focus-visible {
  .pi-link__text {
    background-size: 100% 1px;
  }

  .pi-link__arrow {
    transform: translate(2px, -2px);
  }
}

.pi-link--dark {
  color: #fff;

  .pi-link__kicker,
  .pi-link__arrow {
    color: #9ec0ff;
  }
}

.pi-link__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .pi-link__text,
  .pi-link__arrow {
    transition: none;
  }
}
</style>
