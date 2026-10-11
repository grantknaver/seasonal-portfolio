<script lang="ts" setup>
import { patternIndexUrl } from '../shared/constants/patternIndex';

/* The one-page leave-behind every Teardown attendee gets. Same made-up product as the sample
   Teardown above it (Cairnwell Atlas), packaged the way a real Snapshot is: one annotated view,
   the key issues, a couple of Pattern Index directions, and the next decision. It stays at
   Teardown depth on purpose: no redesigns, mockups, or specs. */
const rules = ['PIPEDA', 'PHIPA', 'GDPR', 'ISO 27001'];

const issues = [
  {
    n: 1,
    lens: 'Clarity',
    title: 'The setup details disappear.',
    text: 'Location, industry, and AI use decide every rule shown, but vanish after onboarding.',
  },
  {
    n: 2,
    lens: 'Trust',
    title: 'Every rule looks equally important.',
    text: 'Laws, standards, and optional guidance share one card, so nobody knows what applies.',
  },
];

const directions = [
  { kind: 'pin', lens: 'Clarity', text: 'Context that stays in view', path: '/lenses/clarity' },
  { kind: 'why', lens: 'Trust', text: 'Say why something is shown', path: '/lenses/trust' },
] as const;
</script>

<template>
  <figure class="snap q-ma-none" aria-label="Sample Decision Snapshot">
    <header class="snap__head">
      <div class="snap__titles">
        <span class="snap__brand"><i>glk</i>Freelance</span>
        <b>Decision Snapshot</b>
      </div>
      <span class="snap__tag">Sample · made-up product</span>
      <dl class="snap__meta q-ma-none">
        <div><dt>Product</dt><dd>Cairnwell Atlas</dd></div>
        <div><dt>Surface</dt><dd>Requirements page</dd></div>
        <div><dt>Lenses</dt><dd>Clarity · Trust</dd></div>
      </dl>
    </header>

    <div class="snap__body">
      <!-- The annotated view: where the friction shows up on the reviewed screen. -->
      <div class="shot" aria-hidden="true">
        <div class="shot__bar">
          <span class="shot__logo">Cairnwell Atlas</span>
          <span class="shot__crumb">Requirements</span>
        </div>
        <div class="shot__page">
          <div class="shot__titlerow">
            <span class="shot__title">Requirements</span>
            <span class="shot__count">24 rules</span>
          </div>

          <div class="mark mark--ctx">
            <span class="pin">1</span>
            <span class="mark__note">Setup details not shown</span>
          </div>

          <div class="mark mark--rules">
            <span class="pin pin--corner">2</span>
            <span v-for="r in rules" :key="r" class="rule">
              <b>{{ r }}</b><i>Requirement</i>
            </span>
            <span class="mark__note mark__note--below">All look equally important</span>
          </div>
        </div>
      </div>

      <div class="snap__notes">
        <p class="snap__label q-ma-none">What I see</p>
        <ol class="issues q-ma-none">
          <li v-for="i in issues" :key="i.n">
            <span class="pin pin--inline">{{ i.n }}</span>
            <div>
              <b>{{ i.title }}</b>
              <span>{{ i.text }}</span>
              <em>{{ i.lens }}</em>
            </div>
          </li>
        </ol>
      </div>
    </div>

    <div class="dirs">
      <p class="snap__label q-ma-none">Directions to explore <small>from the Pattern Index</small></p>
      <div class="dirs__row">
        <a
          v-for="d in directions"
          :key="d.text"
          class="dir"
          :href="patternIndexUrl(d.path)"
          target="_blank"
          rel="noopener"
        >
          <span class="dir__thumb" :class="`dir__thumb--${d.kind}`" aria-hidden="true">
            <template v-if="d.kind === 'pin'">
              <span class="t-pill">CA · Health · ON</span>
              <span class="t-line"></span><span class="t-line t-line--s"></span>
            </template>
            <template v-else>
              <span class="t-row"><span class="t-line"></span><span class="t-why">Why: Ontario</span></span>
              <span class="t-row"><span class="t-line"></span><span class="t-why t-why--soft">Optional</span></span>
            </template>
          </span>
          <span class="dir__text">
            <em>{{ d.lens }}</em>
            <b>{{ d.text }}&nbsp;<span aria-hidden="true">&#8599;</span></b>
          </span>
          <span class="sr">(opens the Pattern Index in a new tab)</span>
        </a>
      </div>
    </div>

    <div class="next">
      <span class="next__label">The next decision that matters most</span>
      <p class="q-ma-none">
        Should the setup details stay visible on every requirements page? Settle that first. It
        changes how every other page reads.
      </p>
    </div>

    <figcaption class="snap__foot">
      <span>One page, sent after the call. Yours to share with your team, whether or not we work together.</span>
      <span class="snap__page">1 / 1</span>
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">
$ink: #0b1f2e;
$muted: rgba(11, 31, 46, 0.66);
$blue: #1260f0;
$navy: #0a3487;
$soft: #e5ecfd;
$line: rgba(18, 96, 240, 0.18);
$warn: #e8590c;

/* A sheet of paper: white, hairline frame, a second sheet peeking behind. Reads as a document
   someone handed you, not another card on the page. */
.snap {
  position: relative;
  display: grid;
  gap: 0.95rem;
  padding: 1.1rem 1.2rem 0.85rem;
  border: 1px solid #dfe6f3;
  border-radius: 0.55rem;
  background: #fff;
  box-shadow:
    0 1px 0 rgba(10, 52, 135, 0.04),
    0 18px 40px rgba(10, 52, 135, 0.12);

  &::before {
    content: '';
    position: absolute;
    inset: 6px -6px -6px 6px;
    z-index: -1;
    border: 1px solid #e6ecf8;
    border-radius: 0.55rem;
    background: #f7f9fe;
  }
}

/* ---------- Header ---------- */

.snap__head {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.55rem 1rem;
  align-items: start;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #edf1f9;
}

.snap__titles {
  display: grid;
  gap: 0.1rem;

  b {
    color: $ink;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.015em;
  }
}

.snap__brand {
  color: $muted;
  font-size: 0.72rem;
  font-weight: 600;

  i {
    color: $blue;
    font-weight: 700;
  }
}

.snap__tag {
  padding: 0.2rem 0.5rem;
  border: 1px solid #e3e9f6;
  border-radius: 999px;
  color: $muted;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.snap__meta {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 1.4rem;

  div {
    display: grid;
    gap: 0.05rem;
  }

  dt {
    color: $muted;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    color: $ink;
    font-size: 0.8rem;
    font-weight: 600;
  }
}

.snap__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.1rem;
  align-items: start;
}

/* ---------- Annotated view ---------- */

.shot {
  overflow: hidden;
  border: 1px solid #d5e0f5;
  border-radius: 0.5rem;
  background: #fbfcff;
  box-shadow: 0 6px 16px rgba(10, 52, 135, 0.08);
}

.shot__bar {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
  padding: 0.38rem 0.6rem;
  border-bottom: 1px solid #e3e9f6;
  background: #fff;
}

.shot__logo {
  color: $ink;
  font-size: 0.62rem;
  font-weight: 700;
}

.shot__crumb {
  color: $muted;
  font-size: 0.6rem;

  &::before {
    content: '/ ';
  }
}

.shot__page {
  display: grid;
  gap: 0.5rem;
  padding: 0.6rem 0.7rem 0.75rem;
}

.shot__titlerow {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.shot__title {
  color: $ink;
  font-size: 0.78rem;
  font-weight: 700;
}

.shot__count {
  color: $muted;
  font-size: 0.6rem;
  font-weight: 600;
}

/* Annotation marks: dashed orange outline + numbered pin + a short note, like a marked-up
   screenshot. */
.mark {
  position: relative;
  border: 1.5px dashed $warn;
  border-radius: 0.4rem;
  background: rgba(232, 89, 12, 0.04);
}

.mark--ctx {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  padding: 0.25rem 0.4rem;
}

.mark--rules {
  display: grid;
  gap: 0.25rem;
  padding: 0.35rem;
}

.mark__note {
  color: $warn;
  font-size: 0.62rem;
  font-weight: 700;

  &--below {
    padding: 0.1rem 0.1rem 0;
  }
}

.rule {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.28rem 0.45rem;
  border: 1px solid #e3e9f6;
  border-radius: 0.3rem;
  background: #fff;

  b {
    color: $ink;
    font-size: 0.62rem;
    font-weight: 700;
  }

  i {
    padding: 0.05rem 0.35rem;
    border-radius: 999px;
    background: #eef2f9;
    color: $muted;
    font-size: 0.54rem;
    font-style: normal;
    font-weight: 600;
  }
}

.pin {
  flex: none;
  display: inline-grid;
  place-items: center;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: $warn;
  color: #fff;
  font-size: 0.64rem;
  font-weight: 700;
  font-style: normal;

  &--corner {
    position: absolute;
    top: -0.55rem;
    right: -0.55rem;
    box-shadow: 0 0 0 2px #fff;
  }

  &--inline {
    margin-top: 0.1rem;
  }
}

/* ---------- Findings ---------- */

.snap__label {
  color: $blue;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  small {
    margin-left: 0.35rem;
    color: $muted;
    font-size: inherit;
    letter-spacing: inherit;
  }
}

.snap__notes {
  display: grid;
  gap: 0.55rem;
  align-content: start;
}

.issues {
  display: grid;
  gap: 0.7rem;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    gap: 0.55rem;
  }

  div {
    display: grid;
    gap: 0.15rem;
  }

  b {
    color: $ink;
    font-size: 0.86rem;
    line-height: 1.3;
  }

  span:not(.pin) {
    color: $muted;
    font-size: 0.78rem;
    line-height: 1.4;
  }

  em {
    justify-self: start;
    margin-top: 0.1rem;
    padding: 0.05rem 0.45rem;
    border-radius: 999px;
    background: $soft;
    color: $navy;
    font-size: 0.6rem;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
}

/* ---------- Pattern Index directions ---------- */

.dirs {
  display: grid;
  gap: 0.5rem;
}

.dirs__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
}

.dir {
  display: flex;
  gap: 0.65rem;
  align-items: center;
  padding: 0.45rem;
  border: 1px solid $line;
  border-radius: 0.55rem;
  background: #fff;
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.25s ease,
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover,
  &:focus-visible {
    border-color: $blue;
    box-shadow: 0 8px 18px rgba(18, 96, 240, 0.12);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid $blue;
    outline-offset: 2px;
  }
}

.dir__thumb {
  flex: none;
  display: grid;
  gap: 0.22rem;
  align-content: center;
  width: 6rem;
  height: 3rem;
  padding: 0.35rem 0.4rem;
  border-radius: 0.35rem;
  background: #f3f7ff;
}

.t-pill {
  justify-self: start;
  padding: 0.04rem 0.35rem;
  border-radius: 999px;
  background: $blue;
  color: #fff;
  font-size: 0.48rem;
  font-weight: 700;
  white-space: nowrap;
}

.t-line {
  display: block;
  height: 0.26rem;
  border-radius: 999px;
  background: #cfdaf0;

  &--s {
    width: 60%;
    background: #e0e7f5;
  }
}

.t-row {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  padding: 0.14rem 0.2rem;
  border-radius: 0.2rem;
  background: #fff;

  .t-line {
    flex: 1;
    min-width: 1.2rem;
  }
}

.t-why {
  padding: 0.02rem 0.25rem;
  border-radius: 999px;
  background: $soft;
  color: $navy;
  font-size: 0.44rem;
  font-weight: 700;
  white-space: nowrap;

  &--soft {
    background: #eef2f9;
    color: $muted;
  }
}

.dir__text {
  display: grid;
  gap: 0.1rem;
  min-width: 0;

  em {
    color: $muted;
    font-size: 0.58rem;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  b {
    color: $navy;
    font-size: 0.8rem;
    line-height: 1.3;
  }
}

.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ---------- Next decision ---------- */

.next {
  display: grid;
  gap: 0.2rem;
  padding: 0.8rem 0.95rem;
  border-radius: 0.5rem;
  background:
    radial-gradient(120% 140% at 0% 0%, rgba(18, 96, 240, 0.35) 0%, transparent 55%),
    $ink;
  color: #fff;

  p {
    font-size: 0.9rem;
    font-weight: 500;
    line-height: 1.45;
  }
}

.next__label {
  color: #9ec0ff;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.snap__foot {
  display: flex;
  gap: 1rem;
  align-items: baseline;
  justify-content: space-between;
  padding-top: 0.6rem;
  border-top: 1px solid #edf1f9;
  color: $muted;
  font-size: 0.72rem;
  line-height: 1.4;
}

.snap__page {
  flex: none;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

@media (max-width: 599px) {
  .snap {
    padding: 0.9rem 0.85rem 0.75rem;

    &::before {
      inset: 5px -4px -5px 4px;
    }
  }

  .snap__body,
  .dirs__row {
    grid-template-columns: 1fr;
  }
}
</style>
