<script lang="ts" setup>
/* A small, quiet preview of the sample Decision Snapshot: three pages fanned out, a clear
   "sample · fictional" label, and one link to open the full PDF. */
import cover from '../assets/sample-snapshot/cover.webp';
import finding from '../assets/sample-snapshot/finding.webp';
import decision from '../assets/sample-snapshot/decision.webp';
import { SAMPLE_SNAPSHOT_URL, SAMPLE_SNAPSHOT_PAGES } from 'src/shared/constants/sampleSnapshot';

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false });
</script>

<template>
  <a
    class="sample"
    :class="{ 'sample--compact': compact }"
    :href="SAMPLE_SNAPSHOT_URL"
    target="_blank"
    rel="noopener"
    :aria-label="`Open the sample Decision Snapshot (PDF, ${SAMPLE_SNAPSHOT_PAGES} pages, fictional company)`"
  >
    <span class="sample__pages" aria-hidden="true">
      <img class="sample__page sample__page--back2" :src="decision" alt="" loading="lazy" />
      <img class="sample__page sample__page--back1" :src="finding" alt="" loading="lazy" />
      <img class="sample__page sample__page--front" :src="cover" alt="" loading="lazy" />
      <span class="sample__tag">Sample · fictional</span>
    </span>
    <span v-if="!compact" class="sample__copy">
      <b>A real Decision Snapshot, for a made-up company</b>
      <span
        >Surface reviewed, three findings with annotated evidence, pattern directions, and the one
        decision.</span
      >
      <span class="sample__link"
        >Open the sample (PDF, {{ SAMPLE_SNAPSHOT_PAGES }} pages) &rarr;</span
      >
    </span>
  </a>
</template>

<style scoped lang="scss">
$ink: #0b1f2e;
$muted: rgba(11, 31, 46, 0.66);
$blue: #1260f0;
$line: rgba(18, 96, 240, 0.16);

.sample {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  align-items: center;
  padding: 1rem 1.1rem;
  border: 1px solid $line;
  border-radius: 0.9rem;
  background: #fff;
  color: $ink;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover,
  &:focus-visible {
    border-color: rgba(18, 96, 240, 0.4);
    box-shadow: 0 10px 28px -16px rgba(10, 52, 135, 0.35);

    .sample__page--back1 {
      transform: translate(-14px, 4px) rotate(-6deg);
    }

    .sample__page--back2 {
      transform: translate(14px, 6px) rotate(6deg);
    }
  }

  @media (max-width: 599px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  &--compact {
    display: block;
    padding: 0;
    border: 0;
    background: none;

    &:hover,
    &:focus-visible {
      box-shadow: none;
    }
  }
}

.sample__pages {
  position: relative;
  display: block;
  width: 7.5rem;
  aspect-ratio: 8.5 / 11;
  margin: 0.4rem 1rem;
}

.sample__page {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-shadow:
    0 1px 2px rgba(10, 30, 60, 0.12),
    0 8px 20px -8px rgba(10, 30, 60, 0.3);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  &--back1 {
    transform: translate(-9px, 3px) rotate(-4deg);
  }

  &--back2 {
    transform: translate(9px, 5px) rotate(4deg);
  }
}

.sample__tag {
  position: absolute;
  bottom: -0.55rem;
  left: 50%;
  translate: -50% 0;
  padding: 0.2rem 0.55rem;
  border-radius: 99px;
  background: $ink;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
}

.sample__copy {
  display: grid;
  gap: 0.35rem;

  b {
    font-size: 1rem;
    line-height: 1.3;
  }

  span {
    color: $muted;
    font-size: 0.88rem;
    line-height: 1.45;
  }

  .sample__link {
    margin-top: 0.2rem;
    color: $blue;
    font-weight: 700;
  }
}
</style>
