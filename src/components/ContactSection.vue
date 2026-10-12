<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, computed, reactive } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import {
  mdiAccount,
  mdiEmailOutline,
  mdiMapMarkerOutline,
  mdiPhoneOutline,
  mdiTextBoxOutline,
} from '@quasar/extras/mdi-v7';
import { useViewport } from 'src/shared/utils/viewWidth';
import { TEARDOWN_BOOKING_URL } from 'src/shared/constants/booking';
import PatternIndexLink from './PatternIndexLink.vue';
import ClientResultsStrip from './ClientResultsStrip.vue';
import DecisionSnapshot from './DecisionSnapshot.vue';

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  _honey: '',
});

const RecaptchaWidget = defineAsyncComponent(() => import('./RecaptchaWidget.vue'));

const sending = ref(false);
const success = ref(false);
const error = ref(false);
const errorMsg = ref<string | null>(null);
const contactRef = ref<HTMLElement | null>(null);

const mainStore = useMainStore();
const { isHuman, packageInterestText } = storeToRefs(mainStore);

const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

/* One way to start: a free Decision Snapshot. Scope (Diagnostic or build) gets discussed there.
   Anyone who already knows what they want can send a message instead. */
const BOOKING_URL = TEARDOWN_BOOKING_URL;
const formRef = ref<HTMLElement | null>(null);
const bookTeardown = () => {
  if (BOOKING_URL) {
    window.open(BOOKING_URL, '_blank', 'noopener');
    return;
  }
  /* No booking link configured yet: fall back to the message form. */
  formRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const contactDetails = [
  {
    id: 'phone',
    icon: mdiPhoneOutline,
    label: 'Phone',
    value: '(541) 288-3502',
  },
  {
    id: 'location',
    icon: mdiMapMarkerOutline,
    label: 'Location',
    value: 'Oregon, United States',
  },
];

onMounted(() => {
  mainStore.SET_CONTACT_SECTION_REF(contactRef.value);
  form.subject = packageInterestText.value;
});

const sendEmail = async () => {
  if (form._honey) return;

  sending.value = true;
  success.value = false;
  error.value = false;
  errorMsg.value = null;

  try {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('message', form.message);
    fd.append('subject', form.subject);

    const res = await fetch(import.meta.env.VITE_FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: fd,
    });

    if (res.ok) {
      success.value = true;
      form.name = '';
      form.email = '';
      form.subject = '';
      form.message = '';
      form._honey = '';
    } else {
      error.value = true;

      try {
        const data = await res.json();
        errorMsg.value = data?.errors?.[0]?.message || `Request failed (${res.status})`;
      } catch {
        errorMsg.value = `Request failed (${res.status})`;
      }
    }
  } catch (err) {
    error.value = true;
    console.log('Form error', err);
    errorMsg.value = 'Network error';
  } finally {
    sending.value = false;
  }
};
</script>

<template>
  <section
    id="contact"
    ref="contactRef"
    class="contactSection full-width"
    :class="isResponsive ? 'responsive-view q-pa-xs' : 'desktop-view q-pa-md'"
  >
    <div class="contact-sheet">
      <header class="contact-intro">
        <p class="kicker q-mt-none q-mb-sm">I find where people get stuck in your product, and fix it.</p>
        <h1 class="q-mt-none q-mb-md">Start with a free Decision Snapshot.</h1>
        <p class="lead q-ma-none">
          A free, focused review of one screen of your product. I study it before we meet, walk you
          through what matters most on a 20-minute call, and send you one page afterward.
        </p>
      </header>

      <div class="book">
        <q-btn class="book__btn" color="accent" size="lg" glossy @click="bookTeardown">
          <span class="text-body-2">Get my free Decision Snapshot</span>
        </q-btn>
        <div class="book__info">
          <span class="book__meta">Free · 20 minutes · just send one link</span>
          <span class="book__note">
            When you book, add the page, screen, or URL you’d like me to focus on.
          </span>
        </div>
      </div>

      <!-- What every attendee leaves with. -->
      <div class="takeaway">
        <div class="takeaway__copy">
          <p class="takeaway__title q-ma-none">After the call: one page your team can use</p>
          <ul class="takeaway__list q-ma-none">
            <li><b>2–3 highest-leverage issues</b> on the surface you sent</li>
            <li><b>One annotated screenshot</b> showing where the friction appears</li>
            <li>
              <b>1–3 pattern directions</b> from my Pattern Index, a library of interaction
              patterns (a direction, not a finished design)
            </li>
            <li><b>The next decision</b> that matters most</li>
          </ul>
          <p class="takeaway__own q-ma-none">Yours to keep, whether or not we work together.</p>
          <PatternIndexLink class="takeaway__link" text="Browse the Pattern Index" />
        </div>
        <!-- A small, inert preview of the real one-pager (the full sample lives in Lens). -->
        <div class="takeaway__thumb" aria-hidden="true" inert>
          <DecisionSnapshot />
        </div>
      </div>

      <ClientResultsStrip variant="compact" title="What clients have reported" />

      <div ref="formRef" class="or-write">
        <span class="or-write__line" aria-hidden="true"></span>
        <p class="q-ma-none">
          <b>Already know you want a Diagnostic or a build?</b> Book the same call to scope it, or
          send me a message.
        </p>
        <span class="or-write__line" aria-hidden="true"></span>
      </div>

      <q-form @submit.prevent="sendEmail" class="contact-form column q-gutter-y-sm">
        <input
          v-model="form._honey"
          type="text"
          autocomplete="off"
          tabindex="-1"
          style="display: none"
          :disabled="!isHuman"
        />

        <div class="field-grid">
          <q-input
            v-model="form.name"
            label="Name"
            color="accent"
            bg-color="white"
            outlined
            required
            :disable="!isHuman"
          >
            <template #prepend><q-icon :name="mdiAccount" /></template>
          </q-input>

          <q-input
            v-model="form.email"
            type="email"
            label="Email"
            color="accent"
            bg-color="white"
            outlined
            required
            :disable="!isHuman"
          >
            <template #prepend><q-icon :name="mdiEmailOutline" /></template>
          </q-input>
        </div>

        <q-input
          v-model="form.subject"
          type="text"
          :label="'Link to your product or site'"
          color="accent"
          bg-color="white"
          outlined
          required
          :disable="!isHuman"
        >
          <template #prepend><q-icon :name="mdiTextBoxOutline" /></template>
        </q-input>

        <q-input
          v-model="form.message"
          type="textarea"
          :label="'What do you need help with?'"
          class="message"
          color="accent"
          bg-color="white"
          outlined
          required
          autogrow
          :disable="!isHuman"
          :input-style="{ minHeight: isResponsive ? '7rem' : '8rem' }"
        />

        <p class="form-hint q-ma-none">A link and a few sentences are enough.</p>

        <RecaptchaWidget v-show="!isHuman" class="q-mt-md" />

        <q-btn
          v-show="isHuman"
          class="submit-btn q-mt-sm full-width"
          color="accent"
          type="submit"
          size="lg"
          glossy
          :loading="sending"
          :disable="sending"
        >
          <span class="text-body-2">{{ sending ? 'Sending…' : 'Send message' }}</span>
        </q-btn>

        <q-banner v-if="success" class="status-banner success q-mt-sm">
          Got it. I’ll be in touch soon.
        </q-banner>

        <q-banner v-if="error" class="status-banner error q-mt-sm">
          Failed to send. {{ errorMsg || 'Please try again.' }}
        </q-banner>
      </q-form>

      <div class="contact-details">
        <div v-for="detail in contactDetails" :key="detail.id" class="contact-detail">
          <q-icon :name="detail.icon" size="1.1rem" />
          <span>{{ detail.value }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
$ink: #0b1f2e;
$muted: rgba(11, 31, 46, 0.66);
$blue: #1260f0;
$navy: #0a3487;
$soft: #e5ecfd;
$line: rgba(18, 96, 240, 0.18);

.contact-sheet {
  display: grid;
  gap: 1.25rem;
  width: 100%;
  padding: clamp(1.25rem, 2.6vw, 2.5rem);
  border-radius: 1rem;
  background: #f7f9fe;
  box-shadow: 0 18px 50px rgba(6, 17, 31, 0.28);
  color: $ink;
}

.kicker {
  color: $blue;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.contact-intro {
  h1 {
    color: $ink;
    font-size: clamp(1.75rem, 2.4vw, 2.4rem);
    font-weight: 400;
    line-height: 1.12;
    letter-spacing: -0.025em;
    text-wrap: balance;
  }

  .lead {
    color: $muted;
    font-size: 1.02rem;
    font-weight: 600;
    line-height: 1.45;
  }
}

.takeaway {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.1rem;
  align-items: center;
  padding: 0.8rem 0.95rem;
  border: 1px solid rgba(18, 96, 240, 0.22);
  border-left: 3px solid $blue;
  border-radius: 0.7rem;
  background: #fff;
  color: rgba(11, 31, 46, 0.78);
  font-size: 0.9rem;
  line-height: 1.45;
}

.takeaway__copy {
  display: grid;
  gap: 0.35rem;
}

/* The full Snapshot, rendered at 640px and scaled to a thumbnail, tilted slightly like a page
   on a desk. */
.takeaway__thumb {
  position: relative;
  width: 166px;
  height: 186px;
  overflow: hidden;
  border-radius: 0.35rem;
  transform: rotate(1.5deg);
  box-shadow: 0 10px 24px rgba(10, 52, 135, 0.16);
  pointer-events: none;

  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 640px;
    transform: scale(0.26);
    transform-origin: top left;
  }

  @media (max-width: 599px) {
    display: none;
  }
}

@media (max-width: 599px) {
  .takeaway {
    grid-template-columns: 1fr;
  }
}

.takeaway__list {
  display: grid;
  gap: 0.3rem;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 1.3rem;
    font-size: 0.88rem;
    line-height: 1.4;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: $blue;
      font-weight: 700;
    }
  }

  b {
    color: $ink;
  }
}

.takeaway__own {
  color: rgba(11, 31, 46, 0.6);
  font-size: 0.82rem;
}

.takeaway__title {
  color: $ink;
  font-size: 0.98rem;
  font-weight: 700;
}

.takeaway__link {
  margin-top: 0.15rem;
}

/* Book */
.book {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1rem;
  align-items: center;
}

.book__btn {
  border-radius: 0.75rem;
}

.book__info {
  display: grid;
  gap: 0.15rem;
}

.book__note {
  color: $muted;
  font-size: 0.82rem;
  line-height: 1.35;
}

.book__meta {
  color: $muted;
  font-size: 0.86rem;
  font-weight: 600;
}

.or-write {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.25rem;

  p {
    flex: none;
    max-width: 75%;
    color: $muted;
    font-size: 0.88rem;
    line-height: 1.4;
    text-align: center;
  }

  b {
    color: $ink;
  }
}

.or-write__line {
  flex: 1;
  height: 1px;
  background: $line;
}

/* Form */
.contact-form {
  padding: 1.1rem;
  border: 1px solid $line;
  border-radius: 0.9rem;
  background: #fff;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.form-hint {
  color: $muted;
  font-size: 0.8rem;
}

.submit-btn {
  border-radius: 0.75rem;
}

.status-banner {
  border-radius: 0.75rem;
  font-weight: 700;

  &.success {
    color: #052e16;
    background: #bbf7d0;
  }

  &.error {
    color: #450a0a;
    background: #fecaca;
  }
}

/* Details */
.contact-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  justify-content: center;
}

.contact-detail {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
  color: $muted;
  font-size: 0.86rem;
  font-weight: 600;

  .q-icon {
    color: $blue;
  }
}

/* Layout variants */
.desktop-view .contact-sheet {
  max-width: 960px;
  margin-inline: auto;
}

.responsive-view {
  .field-grid {
    grid-template-columns: 1fr;
  }

  .book__btn {
    width: 100%;
  }

  .or-write p {
    max-width: 85%;
  }

  .contact-form {
    padding: 0.85rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .submit-btn {
    transition: none;
  }
}
</style>
