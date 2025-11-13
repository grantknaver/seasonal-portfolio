<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, computed, reactive } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { mdiAccount, mdiEmailOutline } from '@quasar/extras/mdi-v7';
import { useViewport } from 'src/shared/utils/viewWidth';
import { Package } from 'src/shared/constants/packages';
import { setSeasonClasses } from 'src/shared/utils/setSeasonColors';

// const FORMSPREE_ENDPOINT = 'https://formspree.io/f/your_form_id'; // <-- replace with your actual Formspree endpoint (e.g., https://formspree.io/f/abcd1234)
// If you're actually using Formsubmit instead, use:
const FORMSPREE_ENDPOINT = 'https://formsubmit.co/glkfreelance@gmail.com';
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  // simple honeypot field
  _honey: '',
});
const RecaptchaWidget = defineAsyncComponent(() => import('./RecaptchaWidget.vue'));
const sending = ref(false);
const success = ref(false);
const error = ref(false);
const errorMsg = ref<string | null>(null);
const contactRef = ref<HTMLElement | null>(null);
const mainStore = useMainStore();
const { isHuman, packageOfInterest, activeTheme } = storeToRefs(mainStore);
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

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
  if (form._honey) return; // bot trap
  sending.value = true;
  success.value = false;
  error.value = false;
  errorMsg.value = null;

  try {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('message', form.message);

    // Optional extras supported by many form backends:
    // Subject for the email:
    fd.append('_subject', `New portfolio message from ${form.name}`);
    // Where to redirect after success (comment out if you don't want redirect behavior):
    // fd.append('_next', 'https://yourdomain.com/thank-you');

    const res = await fetch(FORMSPREE_ENDPOINT, {
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
      // Try to parse Formspree JSON error for details
      try {
        const data = await res.json();
        errorMsg.value = data?.errors?.[0]?.message || `Request failed (${res.status})`;
      } catch {
        errorMsg.value = `Request failed (${res.status})`;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    error.value = true;
    errorMsg.value = e?.message || 'Network error';
  } finally {
    sending.value = false;
  }
};
</script>

<template>
  <section v-if="isResponsive" id="contact" ref="contactRef" class="responsive-view full-width">
    <q-form
      @submit.prevent="sendEmail"
      class="column full-width bg-accent q-gutter-y-sm q-pt-md q-pr-xl q-pb-xl q-pl-xl"
      :style="{ 'border-top': isHuman ? 'solid 2px white' : 'none' }"
    >
      <h1 class="text-h1 text-white text-center">Contact Me</h1>
      <q-separator color="primary" />
      <p class="q-mt-md text-white text-center">
        Want something interactive, fast, and intelligent? Let’s talk about what we can build.
      </p>

      <!-- Honeypot (hidden) -->
      <input
        v-model="form._honey"
        type="text"
        autocomplete="off"
        tabindex="-1"
        style="display: none"
        :disable="!isHuman"
        class="q-mb-sm"
      />

      <q-input
        v-model="form.name"
        label="Your Name"
        bg-color="primary"
        outlined
        required
        :disable="!isHuman"
      />
      <q-input
        v-model="form.email"
        type="email"
        label="Your Email"
        bg-color="primary"
        outlined
        required
        :disable="!isHuman"
      />
      <q-separator color="primary" class="separator"></q-separator>
      <q-input
        v-model="form.subject"
        type="text"
        label="Subject"
        bg-color="primary"
        outlined
        required
        :disable="!isHuman"
      />
      <q-input
        v-model="form.message"
        type="textarea"
        label="Your Message"
        class="message"
        bg-color="primary"
        outlined
        required
        autogrow
        :disable="!isHuman"
      />

      <RecaptchaWidget v-show="!isHuman" class="full-width q-mt-md"></RecaptchaWidget>
      <q-btn
        v-show="isHuman"
        class="full-width"
        color="dark"
        type="submit"
        size="lg"
        :loading="sending"
        :disable="sending"
      >
        {{ sending ? 'Sending…' : 'Submit' }}
      </q-btn>

      <q-banner v-if="success" class="bg-green-2 text-black q-mt-sm">
        ✅ Message sent successfully!
      </q-banner>
      <q-banner v-if="error" class="bg-red-2 text-black q-mt-sm">
        ❌ Failed to send. {{ errorMsg || 'Please try again.' }}
      </q-banner>
      <p class="q-mb-none text-white text-center">Phone: (541) 288-3502</p>
      <p class="q-mt-none q-mb-sm text-white text-center">Address: OR United States</p>
    </q-form>
  </section>

  <section v-if="!isResponsive" class="desktop-view full-width column">
    <q-card class="flex column full-width q-pa-none">
      <q-card-section>
        <h1
          class="full-width text-h1 q-mt-none q-mb-md q-pt-md q-pb-md text-center border-black font-secondary"
          :class="
            setSeasonClasses(
              {
                Fall: 'bg-dark text-secondary',
                Winter: 'bg-dark text-secondary',
                Spring: 'bg-dark text-secondary',
                Summer: 'bg-dark text-white',
              },
              activeTheme,
            )
          "
        >
          Contact Me
        </h1>
        <p class="text-center text-white text-body-2">
          Want something interactive, fast, and intelligent? Let’s talk about what we can build.
        </p>
        <q-separator color="primary" />
        <div class="form-container column items-center q-pl-lg q-pr-lg q-pb-lg">
          <q-form @submit.prevent="sendEmail" class="column full-width q-gutter-y-sm">
            <!-- <p class="text-white text-body-2 q-mt-md">
              Want something interactive, fast, and intelligent? Let’s talk about what we can build.
            </p> -->
            <!-- Honeypot (hidden) -->
            <input
              v-model="form._honey"
              type="text"
              autocomplete="off"
              tabindex="-1"
              style="display: none"
            />
            <q-input
              color="dark"
              bg-color="primary"
              filled
              v-model="form.name"
              label="Name"
              required
              :disable="!isHuman"
            >
              <template #prepend><q-icon :name="mdiAccount" /></template>
            </q-input>

            <q-input
              class="q-mb-md"
              color="dark"
              bg-color="primary"
              filled
              v-model="form.email"
              label="Email"
              type="email"
              required
              :disable="!isHuman"
            >
              <template #prepend><q-icon :name="mdiEmailOutline" /></template>
            </q-input>
            <q-separator color="primary" class="separator"></q-separator>
            <q-input
              class="q-mt-lg"
              color="dark"
              bg-color="primary"
              filled
              v-model="form.subject"
              label="Subject"
              type="text"
              required
              :disable="!isHuman"
            >
            </q-input>

            <q-input
              v-model="form.message"
              type="textarea"
              label="Your Message"
              class="message"
              bg-color="primary"
              outlined
              required
              autogrow
              :disable="!isHuman"
            />

            <RecaptchaWidget v-show="!isHuman" class="q-mt-md"></RecaptchaWidget>
            <q-btn
              v-show="isHuman"
              class="q-mt-md"
              color="accent"
              type="submit"
              size="lg"
              :loading="sending"
              :disable="sending"
            >
              {{ sending ? 'Sending…' : 'Submit' }}
            </q-btn>

            <q-banner v-if="success" class="bg-green-2 text-black q-mt-sm">
              ✅ Message sent successfully!
            </q-banner>
            <q-banner v-if="error" class="bg-red-2 text-black q-mt-sm">
              ❌ Failed to send. {{ errorMsg || 'Please try again.' }}
            </q-banner>
          </q-form>
          <p class="q-mt-md q-mb-none text-white text-center">Phone: (541) 288-3502</p>
          <p class="q-mt-none q-mb-sm text-white text-center">Address: OR United States</p>
        </div>
      </q-card-section>
    </q-card>
  </section>
</template>

<style scoped lang="scss">
@use '/src/css/_tokens.scss' as tokens;

.contactSection {
  content-visibility: auto;
  contain-intrinsic-size: 800px 1000px;
}

.desktop-view {
  @media (min-width: $breakpoint-lg) {
    display: flex;
    flex-direction: column;
  }

  .q-card {
    background-color: transparent;

    .form-container {
      margin-top: 32px;
      .q-form {
        max-width: 500px;
      }
    }
  }
}

.separator {
  width: 50%;
  align-self: center;
}
</style>
