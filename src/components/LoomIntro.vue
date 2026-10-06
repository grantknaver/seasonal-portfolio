<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { INTRO_LOOM_DURATION, INTRO_LOOM_URL, loomEmbedUrl } from '../shared/constants/loom';

/* The glue between the hero ("what I do") and the trust section ("why people hesitate"):
   the business cost of friction, in Grant's own voice. */
const embedUrl = computed(() => loomEmbedUrl(INTRO_LOOM_URL));
const hasVideo = computed(() => !!embedUrl.value);
const playing = ref(false);

const costs = ['Signups that stall', 'Demos spent explaining', 'Support tickets that shouldn’t exist'];

/* One gentle reveal as the section scrolls in, like the panels. */
const rootRef = ref<HTMLElement | null>(null);
const isIn = ref(false);
let io: IntersectionObserver | null = null;

onMounted(() => {
  if (!rootRef.value || !('IntersectionObserver' in window)) {
    isIn.value = true;
    return;
  }
  io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        isIn.value = true;
        io?.disconnect();
      }
    },
    { threshold: 0.25 },
  );
  io.observe(rootRef.value);
});

onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <section
    ref="rootRef"
    class="loom-intro"
    :class="{ 'is-in': isIn }"
    aria-labelledby="loom-intro-title"
  >
    <div class="loom-intro__inner">
      <div class="loom-intro__copy">
        <p class="loom-intro__eyebrow q-ma-none" style="--i: 0">60 seconds with Grant</p>
        <h2 id="loom-intro-title" class="loom-intro__title q-ma-none" style="--i: 1">
          Friction rarely announces itself. It shows up as people leaving.
        </h2>
        <p class="loom-intro__lead q-ma-none" style="--i: 2">
          What it looks like, what it costs you, and how I find it.
        </p>
        <div class="loom-intro__costs" style="--i: 3">
          <span class="loom-intro__costs-label">Where you notice it</span>
          <ul class="q-ma-none">
            <li v-for="c in costs" :key="c">{{ c }}</li>
          </ul>
        </div>
      </div>

      <div class="loom-intro__media" style="--i: 2">
        <div class="video">
          <iframe
            v-if="playing && hasVideo"
            class="video__frame"
            :src="embedUrl"
            title="60 seconds with Grant"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
          ></iframe>

          <button
            v-else
            type="button"
            class="video__poster"
            :disabled="!hasVideo"
            :aria-label="hasVideo ? 'Play: 60 seconds with Grant' : 'Video coming soon'"
            @click="playing = true"
          >
            <span class="video__grid" aria-hidden="true"></span>
            <span class="video__brand" aria-hidden="true">
              <i>glk</i><span>Freelance</span>
            </span>
            <span class="video__play" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
            </span>
            <span class="video__caption">
              <b>Why friction costs more than it looks</b>
              <small>{{ hasVideo ? INTRO_LOOM_DURATION || 'Watch' : 'Video coming soon' }}</small>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../css/tokens' as tokens;

$ink: #0b1f2e;
$muted: rgba(11, 31, 46, 0.66);
$blue: #1260f0;
$navy: #0a3487;
$line: rgba(18, 96, 240, 0.18);
$ease: cubic-bezier(0.22, 1, 0.36, 1);

/* Its own opaque layer: it scrolls over the hero's fixed background as a calm breather
   before the cinematic trust section. */
.loom-intro {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: clamp(3.5rem, 9vh, 7rem) 1rem;
  background: linear-gradient(180deg, #f7f9fe 0%, #eef3fd 100%);
  color: $ink;
  font-family: tokens.$primary-font;
}

.loom-intro__inner {
  display: grid;
  gap: clamp(1.75rem, 4vw, 3.5rem);
  align-items: center;
  width: 100%;
  max-width: 1180px;
  margin-inline: auto;

  @media (min-width: tokens.$breakpoint-md) {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }
}

.loom-intro__copy {
  display: grid;
  gap: 0.9rem;
}

.loom-intro__eyebrow {
  color: $blue;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.loom-intro__title {
  max-width: 18ch;
  font-size: clamp(1.75rem, 3.2vw, 2.75rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.12;
}

.loom-intro__lead {
  max-width: 34ch;
  color: $muted;
  font-size: clamp(1rem, 1.2vw, 1.12rem);
  line-height: 1.5;
}

.loom-intro__costs {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.4rem;

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0;
    list-style: none;
  }

  li {
    padding: 0.35rem 0.75rem;
    border: 1px solid $line;
    border-radius: 999px;
    background: #fff;
    color: $navy;
    font-size: 0.82rem;
    font-weight: 600;
  }
}

.loom-intro__costs-label {
  color: $muted;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ---------- Video ---------- */

.video {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border-radius: 1rem;
  background: $ink;
  box-shadow:
    0 24px 60px rgba(6, 17, 31, 0.28),
    0 0 0 1px rgba(18, 96, 240, 0.12);
}

.video__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.video__poster {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  width: 100%;
  padding: 0;
  border: 0;
  background:
    radial-gradient(120% 90% at 20% 0%, rgba(18, 96, 240, 0.45) 0%, transparent 60%),
    radial-gradient(90% 80% at 100% 100%, rgba(216, 189, 122, 0.18) 0%, transparent 55%),
    linear-gradient(160deg, #0b1f2e 0%, #06111f 100%);
  color: #fff;
  font: inherit;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  &:focus-visible {
    outline: 3px solid #9ec0ff;
    outline-offset: -3px;
  }
}

.video__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 100%);
}

.video__brand {
  position: absolute;
  top: 1rem;
  left: 1.1rem;
  font-size: 0.95rem;

  i {
    color: #9ec0ff;
    font-style: italic;
    font-weight: 700;
  }

  span {
    color: rgba(255, 255, 255, 0.85);
  }
}

.video__play {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(3.5rem, 6vw, 4.75rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background: $blue;
  box-shadow: 0 10px 30px rgba(18, 96, 240, 0.45);
  transition: transform 0.4s $ease;

  svg {
    width: 42%;
    margin-left: 6%;
    fill: #fff;
  }

  /* One soft ring, breathing slowly: present, not pushy. */
  &::after {
    content: '';
    position: absolute;
    inset: -8px;
    border: 1px solid rgba(158, 192, 255, 0.5);
    border-radius: 50%;
    animation: ring 2.8s ease-in-out infinite;
  }
}

.video__poster:disabled .video__play {
  background: rgba(255, 255, 255, 0.14);
  box-shadow: none;

  &::after {
    animation: none;
    opacity: 0.3;
  }
}

.video__poster:not(:disabled):hover .video__play,
.video__poster:not(:disabled):focus-visible .video__play {
  transform: scale(1.06);
}

.video__caption {
  position: absolute;
  left: 1.1rem;
  right: 1.1rem;
  bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
  align-items: baseline;
  justify-content: space-between;
  text-align: left;

  b {
    font-size: clamp(0.9rem, 1.2vw, 1.05rem);
    font-weight: 600;
  }

  small {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.8rem;
    font-weight: 600;
  }
}

@keyframes ring {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.96);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.06);
  }
}

/* ---------- Reveal ---------- */

.loom-intro__copy > *,
.loom-intro__media {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.8s $ease,
    transform 0.8s $ease;
  transition-delay: calc(var(--i, 0) * 0.1s);
}

.loom-intro__media {
  transform: translateY(16px) scale(0.98);
}

.loom-intro.is-in {
  .loom-intro__copy > *,
  .loom-intro__media {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loom-intro__copy > *,
  .loom-intro__media {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .video__play::after {
    animation: none;
  }
}
</style>
