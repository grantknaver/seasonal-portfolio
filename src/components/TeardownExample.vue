<script lang="ts" setup>
/* Mirrors the sample Teardown PDF (Cairnwell Atlas): one screen,
   two things I noticed, one simple idea, then what we talk about on the call. */
const PDF = '/samples/sample-teardown-cairnwell-atlas.pdf';

const context = ['Canada', 'Healthcare', 'Ontario', 'Moderate AI usage'];

const rules = [
  { source: 'Canada', what: 'Federal law', why: 'Main location' },
  { source: 'Ontario', what: 'Health privacy law', why: 'Main operating region' },
  { source: 'EU', what: 'Regulation', why: 'May also apply' },
  { source: 'Global', what: 'Standard', why: 'Chosen standard' },
];
</script>

<template>
  <div class="teardown">
    <div class="td-head">
      <span class="sample-tag">Sample Teardown · made-up product</span>
      <h3 class="q-my-none">Cairnwell Atlas: keep the user’s main details in view.</h3>
      <p class="q-ma-none">
        A compliance app that asks for the right details at setup, then hides them on every screen
        after.
      </p>
      <div class="ctx">
        <span v-for="c in context" :key="c">{{ c }}</span>
      </div>
    </div>

    <!-- Observation 1 -->
    <div class="obs">
      <span class="obs__n">01</span>
      <div class="obs__body">
        <b>The setup details disappear.</b>
        <span class="obs__text">
          Your location, industry, and AI use decide which rules you see. But after setup, they’re
          gone. People have to remember what each page is based on.
        </span>
        <div class="compare" aria-hidden="true">
          <div class="compare__col">
            <em>Now</em>
            <span class="screen">Setup: Canada · Healthcare · Ontario</span>
            <i class="down">&darr;</i>
            <span class="screen screen--lost">Requirements page: details gone</span>
          </div>
          <span class="compare__arrow">&rarr;</span>
          <div class="compare__col">
            <em>Simple fix</em>
            <span class="screen screen--fixed">
              <span class="pin-ctx">Canada · Healthcare · Ontario</span>
              Requirements page
            </span>
            <small>A small label that stays on screen.</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Observation 2 -->
    <div class="obs">
      <span class="obs__n">02</span>
      <div class="obs__body">
        <b>Every rule looks equally important.</b>
        <span class="obs__text">
          Laws, standards, and extra guidance all use the same cards, so people can’t tell which one
          actually applies to them.
        </span>
        <div class="rules" role="table" aria-label="Simple fix: say what each rule is and why it's shown">
          <div class="rules__row rules__row--head" role="row">
            <span role="columnheader">Rule from</span>
            <span role="columnheader">What it is</span>
            <span role="columnheader">Why you see it</span>
          </div>
          <div v-for="r in rules" :key="r.source" class="rules__row" role="row">
            <span role="cell"><b>{{ r.source }}</b></span>
            <span role="cell">{{ r.what }}</span>
            <span role="cell">{{ r.why }}</span>
          </div>
        </div>
      </div>
    </div>

    <p class="idea q-ma-none">
      <b>The simple idea</b>Keep the main details on screen, and say why each extra rule shows up.
      The app already has this information. It just isn’t showing it.
    </p>

    <div class="teardown__live">
      <div>
        <p class="mini-label q-ma-none">On the call, we talk about</p>
        <ul class="q-ma-none">
          <li>Does this match what you’re seeing?</li>
          <li>Which one is hurting you most?</li>
          <li>Do you already know the fix, or do we need a closer look?</li>
        </ul>
      </div>
      <div class="bring">
        <p class="mini-label q-ma-none">Bonus</p>
        <p class="q-ma-none">
          Bring one current product or AI decision you’re wrestling with. We’ll spend a few minutes
          pressure-testing it during the same review.
        </p>
      </div>
    </div>

    <div class="heard">
      <p class="mini-label q-ma-none">What founders usually tell me afterward</p>
      <div class="heard__list">
        <span>“You put your finger on exactly what’s been holding us back.”</span>
        <span>“We’re already implementing your recommendations.”</span>
        <span>“This showed us where we’ve been losing users.”</span>
        <span>“It gave us a clear, practical way to reduce friction.”</span>
      </div>
      <p class="heard__note q-ma-none">Common reactions from 150 Teardowns, paraphrased.</p>
    </div>

    <div class="teardown__foot">
      <a class="pdf-link" :href="PDF" target="_blank" rel="noopener">
        See the full sample Teardown (PDF, 3 pages) &rarr;
      </a>
    </div>
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
  grid-template-columns: 1.4fr 1fr;
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

  .bring {
    border-style: dashed;
    border-color: rgba(18, 96, 240, 0.45);

    p:not(.mini-label) {
      color: $ink;
      font-size: 0.85rem;
      line-height: 1.4;
    }
  }
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
  .teardown__live {
    grid-template-columns: 1fr;
  }

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
