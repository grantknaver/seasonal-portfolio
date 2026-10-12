<script lang="ts" setup>
import DecisionSnapshot from './DecisionSnapshot.vue';

/* The Decision Snapshot chapter: one line on how it works, then the one-page sample itself
   (made-up product). The sample shows the four things you get. */


</script>

<template>
  <div class="teardown">
    <p class="how q-ma-none">
      You send one screen. I review it before we meet, walk you through it on a 20-minute call,
      then send you this:
    </p>
    <DecisionSnapshot />
  </div>
</template>

<style scoped lang="scss">
$ink: #0b1f2e;
$muted: rgba(11, 31, 46, 0.66);
$blue: #1260f0;
$navy: #0a3487;
$soft: #e5ecfd;
$line: rgba(18, 96, 240, 0.18);
$warn: #e8590c;

.how {
  color: rgba(11, 31, 46, 0.72);
  font-size: 0.92rem;
  line-height: 1.5;
}

.teardown {
  display: grid;
  gap: 0.75rem;
}

.td-head {
  display: grid;
  gap: 0.3rem;
  padding: 1rem 1.1rem;
  border: 1px solid $line;
  border-radius: 0.9rem;
  background: #f3f7ff;

  h3 {
    color: $ink;
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.3;
  }

  p {
    color: $muted;
    font-size: 0.88rem;
    line-height: 1.4;
  }
}

.sample-tag {
  color: $muted;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ctx {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.3rem;

  span {
    padding: 0.18rem 0.55rem;
    border: 1px solid $line;
    border-radius: 999px;
    background: #fff;
    color: $navy;
    font-size: 0.72rem;
    font-weight: 700;
  }
}

.obs {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.9rem 1rem;
  border: 1px solid $line;
  border-radius: 0.85rem;
  background: #fff;
}

.obs__n {
  flex: none;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.4rem;
  background: $ink;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
}

.obs__body {
  display: grid;
  gap: 0.35rem;
  min-width: 0;

  > b {
    color: $ink;
    font-size: 0.95rem;
    line-height: 1.3;
  }
}

.obs__text {
  color: $muted;
  font-size: 0.85rem;
  line-height: 1.45;
}

.compare {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 0.6rem;
  align-items: center;
  margin-top: 0.35rem;
  padding: 0.7rem;
  border-radius: 0.6rem;
  background: #f7f9fe;
}

.compare__col {
  display: grid;
  justify-items: start;
  gap: 0.3rem;

  em {
    color: $muted;
    font-size: 0.64rem;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  small {
    color: $muted;
    font-size: 0.72rem;
    line-height: 1.35;
  }
}

.screen {
  display: grid;
  gap: 0.25rem;
  width: 100%;
  padding: 0.4rem 0.55rem;
  border: 1px solid #d5e0f5;
  border-radius: 0.4rem;
  background: #fff;
  color: $ink;
  font-size: 0.74rem;
  font-weight: 600;

  &--lost {
    border-style: dashed;
    color: $warn;
  }

  &--fixed {
    border-color: $blue;
  }
}

.pin-ctx {
  justify-self: start;
  padding: 0.08rem 0.45rem;
  border-radius: 999px;
  background: $soft;
  color: $navy;
  font-size: 0.66rem;
  font-weight: 700;
}

.down {
  padding-left: 0.5rem;
  color: $muted;
  font-style: normal;
  font-size: 0.75rem;
}

.compare__arrow {
  color: $blue;
  font-weight: 700;
}

.rules {
  display: grid;
  overflow: hidden;
  margin-top: 0.35rem;
  border: 1px solid #e6ecf8;
  border-radius: 0.55rem;
}

.rules__row {
  display: grid;
  grid-template-columns: 0.8fr 1fr 1fr;
  gap: 0.5rem;
  padding: 0.38rem 0.65rem;
  border-top: 1px solid #edf1f9;
  color: $ink;
  font-size: 0.8rem;

  &--head {
    border-top: 0;
    background: $ink;
    color: #fff;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
}

.idea {
  padding: 0.8rem 1rem;
  border-radius: 0.8rem;
  background: $ink;
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.45;

  b {
    display: block;
    margin-bottom: 0.15rem;
    color: #9ec0ff;
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
}

.teardown__live {
  display: grid;
  gap: 0.6rem;

  > div {
    padding: 0.8rem 0.9rem;
    border: 1px solid $line;
    border-radius: 0.75rem;
    background: #fff;
  }

  ul {
    display: grid;
    gap: 0.3rem;
    padding-left: 1.1rem;
    color: $ink;
    font-size: 0.85rem;
    line-height: 1.4;
  }
}

.after {
  display: grid;
  margin-top: 0.35rem;
}

.mini-label {
  margin-bottom: 0.4rem !important;
  color: $blue;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.heard {
  display: grid;
  gap: 0.45rem;
  padding: 0.85rem 0.95rem;
  border: 1px solid $line;
  border-radius: 0.8rem;
  background: #f3f7ff;
}

.heard__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;

  span {
    padding: 0.45rem 0.8rem;
    border-radius: 0.6rem;
    background: #fff;
    color: $ink;
    font-size: 0.84rem;
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(10, 52, 135, 0.08);
  }
}

.heard__note {
  color: $muted;
  font-size: 0.72rem;
}

.teardown__foot {
  display: grid;
  gap: 0.4rem;

  p {
    color: $muted;
    font-size: 0.86rem;
    line-height: 1.45;
  }
}

.pdf-link {
  justify-self: start;
  color: $blue;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 599px) {
  .compare {
    grid-template-columns: 1fr;

    .compare__arrow {
      transform: rotate(90deg);
      justify-self: center;
    }
  }

  .rules__row {
    font-size: 0.74rem;
  }
}
</style>
