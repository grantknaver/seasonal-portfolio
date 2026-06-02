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
import { Package } from 'src/shared/constants/packages';

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
const { isHuman, packageOfInterest } = storeToRefs(mainStore);
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

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
  if (!packageOfInterest.value) return;
  setSubject(packageOfInterest.value);
});

const setSubject = (packageName: Package) => {
  switch (packageName) {
    case Package.StarterPackage:
      form.subject = 'Interested in Starter Package';
      break;
    case Package.GrowthPackage:
      form.subject = 'Interested in Growth Package';
      break;
    case Package.PremiumPackage:
      form.subject = 'Interested in Premium Package';
      break;
    default:
      form.subject = '';
  }
};

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
    class="contactSection full-width q-pa-md"
    :class="isResponsive ? 'responsive-view' : 'desktop-view'"
  >
    <div class="contact-shell">
      <div class="contact-intro">
        <p class="text-caption kicker q-mt-none q-mb-sm">Start a project</p>

        <h1 class="text-h1 q-mt-none q-mb-md">Let’s make the next interaction clearer.</h1>

        <p class="intro-copy text-body-2 q-mt-none q-mb-lg">
          Send the surface, flow, or idea you want sharpened. I’ll help shape the cleanest next
          step, whether that is motion polish, an AI interaction, or a focused implementation block.
        </p>

        <div class="contact-proof-grid q-mb-lg">
          <div class="contact-proof-card">
            <span>Best for</span>
            <strong>AI UI, motion, and user-flow polish</strong>
          </div>

          <div class="contact-proof-card">
            <span>Next step</span>
            <strong>Clear scope before build</strong>
          </div>
        </div>

        <div class="contact-detail-grid">
          <div v-for="detail in contactDetails" :key="detail.id" class="contact-detail-card">
            <q-icon :name="detail.icon" size="1.25rem" />
            <div>
              <span>{{ detail.label }}</span>
              <strong>{{ detail.value }}</strong>
            </div>
          </div>
        </div>
      </div>

      <q-form @submit.prevent="sendEmail" class="contact-form column q-gutter-y-sm">
        <div class="form-heading q-mb-sm">
          <p class="text-caption kicker q-mt-none q-mb-xs">Project details</p>
          <h2 class="text-h2 q-mt-none q-mb-xs">Send a quick note.</h2>
          <p class="text-body-2 q-ma-none">
            A few sentences are enough. I can ask focused follow-up questions from there.
          </p>
        </div>

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
            bg-color="primary"
            filled
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
            bg-color="primary"
            filled
            required
            :disable="!isHuman"
          >
            <template #prepend><q-icon :name="mdiEmailOutline" /></template>
          </q-input>
        </div>

        <q-input
          v-model="form.subject"
          type="text"
          label="Subject"
          color="accent"
          bg-color="primary"
          filled
          required
          :disable="!isHuman"
        >
          <template #prepend><q-icon :name="mdiTextBoxOutline" /></template>
        </q-input>

        <q-input
          v-model="form.message"
          type="textarea"
          label="Your message"
          class="message"
          color="accent"
          bg-color="primary"
          filled
          required
          autogrow
          :disable="!isHuman"
          :input-style="{ minHeight: isResponsive ? '8rem' : '9rem' }"
        />

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
          Message sent successfully.
        </q-banner>

        <q-banner v-if="error" class="status-banner error q-mt-sm">
          Failed to send. {{ errorMsg || 'Please try again.' }}
        </q-banner>
      </q-form>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '/src/css/_tokens.scss' as tokens;

.contactSection {
  color: tokens.$text;
  overflow-y: hidden;

  &.desktop-view {
    overflow-y: hidden;

    .contact-shell {
      margin-top: 0.25rem;
      margin-bottom: 1rem;
    }
  }

  &.responsive-view {
    .contact-shell {
      grid-template-columns: 1fr;
      max-width: 600px;
      padding: 1.25rem;
    }

    .contact-intro {
      text-align: center;
    }

    .field-grid {
      grid-template-columns: 1fr;
    }
  }
}

.contact-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;
  width: 100%;
  max-width: none;
  margin-inline: 0;
  padding: clamp(1.25rem, 2vw, 2rem);
  border: 1px solid var(--q-accent);
  border-radius: 1rem;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, tokens.$ink-soft 90%, tokens.$ivory 10%),
    tokens.$ink
  );
  box-shadow:
    0 0 56px color-mix(in srgb, var(--q-accent) 30%, transparent),
    0 24px 72px color-mix(in srgb, tokens.$ink 88%, transparent);
}
.kicker {
  color: tokens.$champagne;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.contact-intro {
  min-width: 0;

  h1 {
    color: tokens.$text;
    line-height: 1.08;
    letter-spacing: -0.025em;
    font-weight: 400;
    text-wrap: balance;
  }

  .intro-copy {
    color: tokens.$text-muted;
    line-height: 1.55;
  }
}

.contact-proof-grid,
.contact-detail-grid {
  display: grid;
  gap: 0.75rem;
}

.contact-proof-card,
.contact-detail-card,
.contact-form {
  border: 1px solid color-mix(in srgb, var(--q-accent) 28%, transparent);
  border-radius: 0.85rem;
  background: color-mix(in srgb, tokens.$ink-soft 82%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent);
}

.contact-proof-card {
  padding: 0.85rem 1rem;

  span {
    display: block;
    margin-bottom: 0.25rem;
    color: tokens.$champagne;
    font-size: 0.72rem;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 700;
  }

  strong {
    display: block;
    color: tokens.$text-muted;
    font-size: 0.9rem;
    line-height: 1.3;
    font-weight: 600;
  }
}

.contact-detail-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  color: tokens.$text-muted;

  .q-icon {
    color: var(--q-accent);
  }

  span {
    display: block;
    color: tokens.$text-soft;
    font-size: 0.72rem;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 700;
  }

  strong {
    display: block;
    margin-top: 0.2rem;
    color: tokens.$text-muted;
    font-size: 0.9rem;
    line-height: 1.3;
    font-weight: 600;
  }
}

.contact-form {
  padding: 1rem;

  .form-heading {
    h2 {
      color: tokens.$text;
      line-height: 1.12;
      letter-spacing: -0.02em;
      font-weight: 400;
    }

    p:not(.kicker) {
      color: tokens.$text-muted;
      line-height: 1.45;
    }
  }
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
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

@media (prefers-reduced-motion: reduce) {
  .submit-btn {
    transition: none;
  }
}
</style>
