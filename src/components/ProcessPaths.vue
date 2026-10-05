<script lang="ts" setup>
/* The decision tree: everyone starts with a Teardown Review, then takes the path that fits.
   Nobody has to buy a Diagnostic first. */
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false });
</script>

<template>
  <div class="paths" :class="{ 'paths--compact': compact }">
    <div class="paths__start">
      <span class="node node--start">
        <b>Teardown Review</b>
        <small>Free · one screen · 2–3 things I noticed</small>
      </span>
      <i class="stem" aria-hidden="true"></i>
      <span class="question">Do you know what needs to change?</span>
    </div>

    <div class="paths__branches">
      <div class="branch">
        <span class="answer">You know what’s wrong</span>
        <i class="stem" aria-hidden="true"></i>
        <span class="node node--build">
          <b>Fix it</b>
          <small>Clear scope and price, then I build it</small>
        </span>
      </div>

      <div class="branch">
        <span class="answer">Something’s off, but you don’t know why</span>
        <i class="stem" aria-hidden="true"></i>
        <span class="node node--diag">
          <b>Diagnose it</b>
          <small>Find out what to fix before you build</small>
        </span>
        <i class="stem" aria-hidden="true"></i>
        <span class="answer answer--soft">Want me to build it?</span>
        <i class="stem" aria-hidden="true"></i>
        <span class="node node--build">
          <b>Fix it</b>
          <small>Starting with what matters most</small>
        </span>
      </div>
    </div>

    <p class="paths__note q-ma-none">
      You never have to buy a Diagnostic. It’s for when something feels off but you’re not sure
      why, so you don’t pay to build the wrong thing.
    </p>
  </div>
</template>

<style scoped lang="scss">
$ink: #0b1f2e;
$muted: rgba(11, 31, 46, 0.66);
$blue: #1260f0;
$navy: #0a3487;
$soft: #e5ecfd;
$line: rgba(18, 96, 240, 0.18);

.paths {
  display: grid;
  gap: 0.25rem;
  justify-items: center;
  padding: 1.25rem 1rem 1rem;
  border: 1px solid $line;
  border-radius: 0.9rem;
  background: #fff;
}

.paths__start {
  display: grid;
  justify-items: center;
}

.paths__branches {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  width: 100%;
  padding-top: 1rem;

  /* The fork: one line splitting to both branches. */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 25%;
    right: 25%;
    height: 1rem;
    border: 1.5px solid #b9cdf5;
    border-bottom: 0;
    border-radius: 0.5rem 0.5rem 0 0;
  }
}

.branch {
  display: grid;
  justify-items: center;
  align-content: start;
}

.node {
  display: grid;
  gap: 0.1rem;
  min-width: 11rem;
  padding: 0.55rem 0.85rem;
  border-radius: 0.6rem;
  text-align: center;

  b {
    font-size: 0.92rem;
    line-height: 1.2;
  }

  small {
    font-size: 0.72rem;
    line-height: 1.3;
    opacity: 0.8;
  }
}

.node--start {
  background: $blue;
  color: #fff;
  box-shadow: 0 8px 20px rgba(18, 96, 240, 0.25);
}

.node--diag {
  border: 1.5px dashed $blue;
  background: #f3f7ff;
  color: $navy;
}

.node--build {
  border: 1px solid $line;
  background: $soft;
  color: $navy;
}

.question {
  padding: 0.35rem 0.75rem;
  border: 1.5px solid #b9cdf5;
  border-radius: 999px;
  background: #fff;
  color: $ink;
  font-size: 0.84rem;
  font-weight: 700;
}

.answer {
  color: $ink;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;

  &--soft {
    color: $muted;
    font-weight: 600;
  }
}

.stem {
  display: block;
  width: 1.5px;
  height: 0.9rem;
  background: #b9cdf5;
}

.paths__note {
  max-width: 34rem;
  margin-top: 0.75rem;
  color: $muted;
  font-size: 0.82rem;
  line-height: 1.4;
  text-align: center;
}

.paths--compact {
  padding: 1rem 0.75rem 0.85rem;

  .node {
    min-width: 0;
    width: 100%;
    max-width: 13rem;
  }
}

@media (max-width: 599px) {
  .node {
    min-width: 0;
    width: 100%;
  }

  .answer {
    min-height: 2.2em;
  }
}
</style>
