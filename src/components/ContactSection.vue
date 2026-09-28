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

const steps = [
  { label: 'Teardown Review', text: 'I walk you through the 1–2 moments costing you most.' },
  { label: 'Diagnostic, if needed', text: 'When you know something’s off but not what.' },
  { label: 'Implementation', text: 'Clear scope and price, then I build it.' },
];

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
        <p class="kicker q-mt-none q-mb-sm">Contact</p>
        <h1 class="q-mt-none q-mb-md">Start with a Teardown Review.</h1>
        <p class="lead q-ma-none">
          Send a link to your site, product, or AI feature. I’ll find where it’s losing clarity,
          trust, or momentum, then we walk through it together.
        </p>
      </header>

      <ol class="contact-steps q-ma-none">
        <li v-for="(st, i) in steps" :key="st.label" class="contact-step">
          <span class="contact-step__num">{{ i + 1 }}</span>
          <div>
            <b>{{ st.label }}</b>
            <span>{{ st.text }}</span>
          </div>
        </li>
      </ol>

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
          label="Link to your product or site"
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
          label="What feels unclear or stuck?"
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
          <span class="text-body-2">{{ sending ? 'Sending…' : 'Request a Teardown Review' }}</span>
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

/* Process: three steps, left to right */
.contact-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  padding: 0;
  list-style: none;
}

.contact-step {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  padding: 0.75rem 0.85rem;
  border: 1px solid $line;
  border-radius: 0.8rem;
  background: #fff;

  b {
    display: block;
    color: $ink;
    font-size: 0.88rem;
    line-height: 1.25;
  }

  span:not(.contact-step__num) {
    display: block;
    margin-top: 0.15rem;
    color: $muted;
    font-size: 0.8rem;
    line-height: 1.35;
  }

  &:first-child {
    border-color: $blue;
    box-shadow: 0 0 0 3px rgba(18, 96, 240, 0.1);
  }
}

.contact-step__num {
  flex: none;
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: $blue;
  color: #fff;
  font-size: 0.74rem;
  font-weight: 700;
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
  .contact-steps,
  .field-grid {
    grid-template-columns: 1fr;
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
