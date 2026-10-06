<script lang="ts" setup>
import { useMainStore } from '../stores/main';
import { TopicName } from '../shared/constants/topicName';
import PatternIndexLink from './PatternIndexLink.vue';

/* Mirrors the sample Diagnostic PDF (AegisFlow). The full 8-page version is linked below.
   Each problem links to a real build that fixes the same kind of thing. */
const PDF = '/samples/sample-diagnostic-aegisflow.pdf';
const mainStore = useMainStore();
const toExamples = () => mainStore.SET_ACTIVE_TOPIC(TopicName.Examples);

const scores = [
  { lens: 'Clarity', score: 2.7, note: 'The info is there, but split across tabs' },
  { lens: 'Trust', score: 3.1, note: 'The proof is hidden one click too deep' },
  { lens: 'Momentum', score: 2.4, note: 'Hard to see the one next step' },
  { lens: 'AI legibility', score: 2.2, note: 'AI calls look certain, with no “why”' },
];

const findings = [
  {
    n: 1,
    level: 'Critical',
    lenses: ['Clarity', 'Trust'],
    title: '“Ready” shows before the review is actually done.',
    text: 'All 12 checks passed, so it says Ready. But a person still has to sign off.',
    fix: 'Show each stage: checks done → waiting on a person → approved.',
    build: 'AgentGate',
  },
  {
    n: 2,
    level: 'Critical',
    lenses: ['AI legibility', 'Trust'],
    title: 'The AI says “High risk,” but not why.',
    text: 'It looks like a final answer, with nothing to check it against.',
    fix: 'Put the reasons, the evidence, and how sure the AI is right next to the label.',
    build: 'Futureframe',
  },
  {
    n: 3,
    level: 'High',
    lenses: ['Momentum', 'Clarity'],
    title: 'System steps and people steps are mixed together.',
    text: '“2 of 3” doesn’t say who the last step is waiting on.',
    fix: 'Show what the system finished, who’s up next, and the one thing to do now.',
    build: 'Readbot',
  },
];

const chain = [
  'What’s being decided?',
  'What did the AI find?',
  'What has a person confirmed?',
  'What’s still open?',
  'What happens next?',
];

const firstSteps = [
  { n: 1, what: 'Replace “Ready” with clear stages', lens: 'Clarity + Trust' },
  { n: 2, what: 'Show why the AI made each call', lens: 'AI legibility + Trust' },
  { n: 3, what: 'Separate system steps from people steps', lens: 'Momentum + Clarity' },
  { n: 4, what: 'Turn every failed check into a task with an owner', lens: 'Momentum' },
  { n: 5, what: 'Record why decisions were made, not just that they happened', lens: 'Trust + AI legibility' },
];
</script>

<template>
  <div class="diag">
    <div class="diag__head">
      <span class="sample-tag">Sample Diagnostic · made-up product</span>
      <h3 class="q-my-none">AegisFlow: making AI decisions easy to follow.</h3>
      <p class="q-ma-none">
        An AI tool that helps banks review AI models. It has all the right pieces, but people have
        to piece the meaning together themselves.
      </p>
    </div>

    <!-- 1. The quick read -->
    <section class="part">
      <span class="part__n">1</span>
      <div class="part__body">
        <p class="part__label q-ma-none">The quick read</p>
        <div class="scores">
          <div v-for="s in scores" :key="s.lens" class="score">
            <span class="score__lens">{{ s.lens }}</span>
            <span class="score__num">{{ s.score }}<small>/5</small></span>
            <span class="score__bar"><i :style="{ width: `${(s.score / 5) * 100}%` }"></i></span>
            <span class="score__note">{{ s.note }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. What users see now -->
    <section class="part">
      <span class="part__n">2</span>
      <div class="part__body">
        <p class="part__label q-ma-none">What people see today</p>
        <div class="console" aria-label="Sample review screen with three problem spots">
          <div class="console__top">
            <b>Credit Assist v3</b><span>Review AG-2937</span>
          </div>
          <div class="console__grid">
            <div class="tile">
              <em>Readiness</em><b class="ok">READY</b><small>12 / 12 checks passed</small>
              <i class="mark">1</i>
            </div>
            <div class="tile">
              <em>AI risk rating</em><b class="hot">HIGH</b><small>AI-generated</small>
              <i class="mark">2</i>
            </div>
            <div class="tile">
              <em>Approvals</em><b>2 of 3</b><small>Legal review pending</small>
              <i class="mark">3</i>
            </div>
            <div class="tile">
              <em>Evidence</em><b>18 files</b><small>Updated today</small>
            </div>
          </div>
        </div>
        <div class="questions">
          <span><i>1</i>What does “Ready” actually mean?</span>
          <span><i>2</i>Why is it “High” risk?</span>
          <span><i>3</i>What should I do next?</span>
        </div>
      </div>
    </section>

    <!-- 3. Top problems -->
    <section class="part">
      <span class="part__n">3</span>
      <div class="part__body">
        <p class="part__label q-ma-none">The biggest problems, in order</p>
        <ol class="findings q-ma-none">
          <li v-for="f in findings" :key="f.n">
            <div class="findings__top">
              <span class="level" :class="`level--${f.level.toLowerCase()}`">{{ f.level }}</span>
              <span v-for="l in f.lenses" :key="l" class="lens-tag">{{ l }}</span>
            </div>
            <b>{{ f.title }}</b>
            <span class="ftext">{{ f.text }}</span>
            <span class="ffix"><em>Fix:</em> {{ f.fix }}</span>
            <button type="button" class="fix-link" @click="toExamples">
              See this kind of fix in <u>{{ f.build }}</u> &rarr;
            </button>
          </li>
        </ol>
        <p class="more q-ma-none">Plus three more in the full report.</p>
      </div>
    </section>

    <!-- 4. Where it should go -->
    <section class="part">
      <span class="part__n">4</span>
      <div class="part__body">
        <p class="part__label q-ma-none">Where it should go</p>
        <p class="direction q-ma-none">Make every review read as one clear decision.</p>
        <div class="chain">
          <template v-for="(c, i) in chain" :key="c">
            <span>{{ c }}</span>
            <i v-if="i < chain.length - 1" aria-hidden="true">&rarr;</i>
          </template>
        </div>
        <p class="rule q-ma-none">
          Whenever the AI makes a call, people should see what it decided, what it used, how sure it
          is, and where a person takes over.
        </p>
        <!-- The direction step: related interaction directions, not a one-to-one fix. -->
        <PatternIndexLink
          kicker="Pattern Index"
          path="/lenses/ai-legibility"
          text="Explore directions like this one"
        />
      </div>
    </section>

    <!-- 5. What to fix first -->
    <section class="part">
      <span class="part__n">5</span>
      <div class="part__body">
        <p class="part__label q-ma-none">What to fix first</p>
        <ol class="steps q-ma-none">
          <li v-for="s in firstSteps" :key="s.n">
            <span class="steps__n">{{ s.n }}</span>
            <span class="steps__what">{{ s.what }}</span>
            <span class="steps__lens">{{ s.lens }}</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- 6. What happens next -->
    <section class="part">
      <span class="part__n">6</span>
      <div class="part__body">
        <p class="part__label q-ma-none">What happens next</p>
        <div class="path">
          <span>Diagnostic</span><i>&rarr;</i><span>Clear plan</span><i>&rarr;</i>
          <span>Scope</span><i>&rarr;</i><span class="is-end">Build</span>
        </div>
        <p class="skip q-ma-none">Already know what to fix? Skip the Diagnostic and start at Scope.</p>
      </div>
    </section>

    <div class="diag__foot">
      <p class="q-ma-none">
        This is a made-up product, but it’s the same format I use for real client Diagnostics. It
        tells you what to build and in what order. Building it is a separate step, by your team or
        by me.
      </p>
      <a class="pdf-link" :href="PDF" target="_blank" rel="noopener">
        See the full sample Diagnostic (PDF, 8 pages) &rarr;
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

.diag {
  display: grid;
  overflow: hidden;
  border: 1px solid $line;
  border-radius: 0.9rem;
  background: #fff;
}

.diag__head {
  display: grid;
  gap: 0.3rem;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid $line;
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

.part {
  display: grid;
  grid-template-columns: 1.6rem minmax(0, 1fr);
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid #edf1f9;
}

.part__n {
  display: grid;
  place-items: center;
  width: 1.6rem;
  height: 1.6rem;
  border: 1.5px solid $blue;
  border-radius: 50%;
  color: $blue;
  font-size: 0.75rem;
  font-weight: 700;
}

.part__body {
  display: grid;
  gap: 0.6rem;
  min-width: 0;
}

.part__label {
  color: $blue;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.6rem;
  text-transform: uppercase;
}

/* 1 */
.scores {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
}

.score {
  display: grid;
  gap: 0.25rem;
  align-content: start;
  padding: 0.6rem 0.65rem;
  border: 1px solid #e6ecf8;
  border-radius: 0.6rem;
}

.score__lens {
  color: $muted;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.score__num {
  color: $ink;
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1;

  small {
    color: $muted;
    font-size: 0.7rem;
    font-weight: 600;
  }
}

.score__bar {
  height: 4px;
  border-radius: 2px;
  background: #e6ecf8;

  i {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: $warn;
  }
}

.score__note {
  color: $muted;
  font-size: 0.74rem;
  line-height: 1.35;
}

/* 2 */
.console {
  overflow: hidden;
  border-radius: 0.6rem;
  background: #111a24;
  color: #dfe7f2;
}

.console__top {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.8rem;
  border-bottom: 1px solid #243244;
  font-size: 0.8rem;

  span {
    color: #8696aa;
    font-size: 0.7rem;
  }
}

.console__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  padding: 0.7rem;
}

.tile {
  position: relative;
  display: grid;
  gap: 0.15rem;
  padding: 0.55rem 0.6rem;
  border: 1px solid #243244;
  border-radius: 0.45rem;
  background: #172230;

  em {
    color: #8696aa;
    font-size: 0.6rem;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  b {
    font-size: 0.95rem;
  }

  .ok {
    color: #5fd39a;
  }

  .hot {
    color: #ff9a5c;
  }

  small {
    color: #8696aa;
    font-size: 0.66rem;
  }
}

.mark,
.questions i {
  display: grid;
  place-items: center;
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  background: $warn;
  color: #fff;
  font-size: 0.62rem;
  font-style: normal;
  font-weight: 700;
}

.mark {
  position: absolute;
  top: -0.45rem;
  right: -0.45rem;
  border: 2px solid #111a24;
}

.questions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.4rem;

  span {
    display: flex;
    gap: 0.4rem;
    align-items: flex-start;
    padding: 0.5rem 0.6rem;
    border: 1px solid #e6ecf8;
    border-radius: 0.55rem;
    color: $ink;
    font-size: 0.8rem;
    font-weight: 700;
    line-height: 1.3;
  }

  i {
    flex: none;
  }
}

/* 3 */
.findings {
  display: grid;
  gap: 0.5rem;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    gap: 0.25rem;
    padding: 0.75rem 0.85rem;
    border: 1px solid #e6ecf8;
    border-radius: 0.7rem;
  }

  b {
    color: $ink;
    font-size: 0.92rem;
    line-height: 1.3;
  }
}

.findings__top {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.level {
  padding: 0.08rem 0.45rem;
  border-radius: 0.3rem;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  &--critical {
    background: $warn;
    color: #fff;
  }

  &--high {
    background: #fff1e6;
    color: $warn;
  }
}

.lens-tag {
  padding: 0.08rem 0.45rem;
  border-radius: 999px;
  background: $soft;
  color: $navy;
  font-size: 0.66rem;
  font-weight: 700;
}

.ftext {
  color: $muted;
  font-size: 0.84rem;
  line-height: 1.4;
}

.ffix {
  color: $ink;
  font-size: 0.84rem;
  line-height: 1.4;

  em {
    color: $blue;
    font-style: normal;
    font-weight: 700;
  }
}

.fix-link {
  justify-self: start;
  margin-top: 0.15rem;
  padding: 0;
  border: 0;
  background: none;
  color: $blue;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;

  u {
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }

  &:hover u {
    text-decoration-thickness: 2px;
  }
}

.more {
  color: $muted;
  font-size: 0.8rem;
}

/* 4 */
.direction {
  color: $ink;
  font-size: 1.02rem;
  font-weight: 700;
  line-height: 1.35;
}

.chain,
.path {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;

  span {
    padding: 0.3rem 0.6rem;
    border-radius: 999px;
    background: $soft;
    color: $navy;
    font-size: 0.76rem;
    font-weight: 700;
  }

  i {
    color: $blue;
    font-style: normal;
  }
}

.path .is-end {
  background: $blue;
  color: #fff;
}

.rule {
  padding: 0.6rem 0.8rem;
  border-left: 3px solid $warn;
  border-radius: 0.3rem;
  background: #fff7f0;
  color: $ink;
  font-size: 0.84rem;
  line-height: 1.45;
}

/* 5 */
.steps {
  display: grid;
  overflow: hidden;
  padding: 0;
  border: 1px solid #e6ecf8;
  border-radius: 0.6rem;
  list-style: none;

  li {
    display: grid;
    grid-template-columns: 1.4rem minmax(0, 1fr) auto;
    gap: 0.6rem;
    align-items: center;
    padding: 0.5rem 0.7rem;
    border-top: 1px solid #edf1f9;

    &:first-child {
      border-top: 0;
    }
  }
}

.steps__n {
  color: $blue;
  font-size: 0.85rem;
  font-weight: 700;
}

.steps__what {
  color: $ink;
  font-size: 0.86rem;
  line-height: 1.35;
}

.steps__lens {
  color: $muted;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
}

/* 6 */
.skip {
  color: $muted;
  font-size: 0.84rem;
}

.diag__foot {
  display: grid;
  gap: 0.4rem;
  padding: 0.9rem 1.1rem;
  background: #f7f9fe;

  p {
    color: $muted;
    font-size: 0.84rem;
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
  .part {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }

  .scores,
  .console__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .questions {
    grid-template-columns: 1fr;
  }

  .steps li {
    grid-template-columns: 1.2rem minmax(0, 1fr);

    .steps__lens {
      grid-column: 2;
    }
  }
}
</style>
