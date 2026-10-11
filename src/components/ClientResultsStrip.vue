<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { CLIENT_RESULTS, CLIENT_RESULTS_NOTE } from '../shared/constants/clientResults';

/* A compact row of client-reported results.
   "band" sits on the main page (Loom section); "compact" sits by the booking button.
   With animate, the row plays once it's on screen: each result slides in from the right, one
   after another, then the disclaimer. Without it (Contact), everything is simply visible. */
const props = withDefaults(
  defineProps<{ variant?: 'band' | 'compact'; title?: string; animate?: boolean }>(),
  { variant: 'band', title: 'What clients reported after fixing it', animate: false },
);
const emit = defineEmits<{ shown: [] }>();

const rootRef = ref<HTMLElement | null>(null);
const playing = ref(false);
let io: IntersectionObserver | null = null;

const show = () => {
  playing.value = true;
  emit('shown');
};

onMounted(() => {
  if (!props.animate) return;
  if (!rootRef.value || !('IntersectionObserver' in window)) return show();
  io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io?.disconnect();
        show();
      }
    },
    { threshold: 0.5 },
  );
  io.observe(rootRef.value);
});

onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <section
    ref="rootRef"
    class="results"
    :class="[`results--${variant}`, { 'results--animate': animate, 'is-playing': playing }]"
    :aria-label="title"
  >
    <p class="results__title q-ma-none">{{ title }}</p>
    <ul class="results__list q-ma-none">
      <li v-for="(r, i) in CLIENT_RESULTS" :key="r.label" :style="{ '--i': i }">
        <span class="results__lens">{{ r.label }}</span>
        <b class="results__stat">{{ r.stat }}</b>
        <span class="results__what">{{ r.short }}</span>
      </li>
    </ul>
    <p class="results__note q-ma-none">{{ CLIENT_RESULTS_NOTE }}</p>
  </section>
</template>

<style scoped lang="scss">
@use '../css/tokens' as tokens;

$ink: #0b1f2e;
$muted: rgba(11, 31, 46, 0.62);
$blue: #1260f0;
$line: rgba(18, 96, 240, 0.16);

.results {
  display: grid;
  gap: 0.6rem;
  font-family: tokens.$primary-font;
  color: $ink;
}

.results__title {
  color: $blue;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.results__list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.6rem;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    gap: 0.15rem;
    align-content: start;
    min-width: 0;
  }
}

.results__lens {
  color: $muted;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.results__stat {
  font-size: clamp(1.4rem, 1.9vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.results__what {
  color: $muted;
  font-size: 0.86rem;
  line-height: 1.3;
}

.results__note {
  max-width: 62rem;
  color: $muted;
  font-size: 0.74rem;
  line-height: 1.45;
}

/* Band: a quiet row with hairline dividers between results. */
.results--band {
  padding-top: clamp(1rem, 2.5vh, 1.5rem);
  border-top: 1px solid $line;

  .results__list li + li {
    padding-left: 0.9rem;
    border-left: 1px solid $line;
  }
}

/* Compact: smaller figures, framed, for the booking area. */
.results--compact {
  gap: 0.6rem;
  padding: 0.85rem 0.95rem;
  border: 1px solid $line;
  border-radius: 0.7rem;
  background: #fff;

  .results__stat {
    font-size: 1.3rem;
  }

  .results__what {
    font-size: 0.78rem;
  }
}

/* Sequenced reveal: title, then each result from the right, then the disclaimer. */
$ease: cubic-bezier(0.22, 1, 0.36, 1);

.results--animate {
  .results__title,
  .results__list li,
  .results__note {
    opacity: 0;
    transition:
      opacity 0.7s $ease,
      transform 0.7s $ease;
  }

  .results__title {
    transform: translateY(8px);
    transition-delay: 0.05s;
  }

  .results__list li {
    transform: translateX(28px);
    transition-delay: calc(0.2s + var(--i) * 0.16s);
  }

  .results__note {
    transform: translateY(6px);
    transition-delay: 0.95s;
  }

  &.is-playing {
    .results__title,
    .results__list li,
    .results__note {
      opacity: 1;
      transform: none;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .results--animate {
    .results__title,
    .results__list li,
    .results__note {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
}

@media (max-width: 760px) {
  .results__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 0.9rem;
  }

  .results--band .results__list li + li {
    padding-left: 0;
    border-left: 0;
  }
}
</style>
