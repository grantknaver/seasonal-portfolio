<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { mdiAccount, mdiEmailOutline } from '@quasar/extras/mdi-v7';

// const FORMSPREE_ENDPOINT = 'https://formspree.io/f/your_form_id'; // <-- replace with your actual Formspree endpoint (e.g., https://formspree.io/f/abcd1234)
// If you're actually using Formsubmit instead, use:
const FORMSPREE_ENDPOINT = 'https://formsubmit.co/glkfreelance@gmail.com';
const form = ref({
  name: '',
  email: '',
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

const { isHuman } = storeToRefs(mainStore);

onMounted(() => {
  mainStore.SET_CONTACT_SECTION_REF(contactRef.value);
});

const sendEmail = async () => {
  if (form.value._honey) return; // bot trap
  sending.value = true;
  success.value = false;
  error.value = false;
  errorMsg.value = null;

  try {
    const fd = new FormData();
    fd.append('name', form.value.name);
    fd.append('email', form.value.email);
    fd.append('message', form.value.message);

    // Optional extras supported by many form backends:
    // Subject for the email:
    fd.append('_subject', `New portfolio message from ${form.value.name}`);
    // Where to redirect after success (comment out if you don't want redirect behavior):
    // fd.append('_next', 'https://yourdomain.com/thank-you');

    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: fd,
    });

    if (res.ok) {
      success.value = true;
      form.value = { name: '', email: '', message: '', _honey: '' };
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
  <section id="contact" ref="contactRef" class="contactSection responsive-view full-width">
    <q-form
      @submit.prevent="sendEmail"
      class="full-width bg-accent q-pt-md q-pr-xl q-pb-xl q-pl-xl"
      :style="{ 'border-top': isHuman ? 'solid 2px white' : 'none' }"
    >
      <h1 class="text-h1 text-white q-mt-md q-ml-none text-center">Contact Me</h1>
      <q-separator class="q-mb-md" color="primary" />
      <p class="text-white text-center">
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
        class="q-mb-sm"
        outlined
        required
        :disable="!isHuman"
      />
      <q-input
        v-model="form.email"
        type="email"
        label="Your Email"
        bg-color="primary"
        class="q-mb-sm"
        outlined
        required
        :disable="!isHuman"
      />
      <q-input
        v-model="form.message"
        type="textarea"
        label="Your Message"
        class="q-mb-sm message"
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

  <section
    class="contactSection desktop-view full-width full-height column justify-center items-center"
  >
    <q-form
      @submit.prevent="sendEmail"
      class="full-width q-gutter-y-sm q-pt-md q-pr-xl q-pb-lg q-pl-xl"
    >
      <h1 class="text-h1 text-white q-ml-none">Contact Me</h1>
      <q-separator color="primary" />
      <p class="text-white text-body-2 q-mt-md">
        Want something interactive, fast, and intelligent? Let’s talk about what we can build.
      </p>

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

      <q-input
        v-model="form.message"
        type="textarea"
        label="Your Message"
        class="q-ml-none message"
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
    <p class="q-mb-none text-white">Phone: (541) 288-3502</p>
    <p class="q-mt-none q-mb-sm text-white">Address: OR United States</p>
  </section>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.responsive-view {
  @media (min-width: $breakpoint-lg) {
    display: none;
  }
}

.desktop-view {
  display: none;

  @media (min-width: $breakpoint-lg) {
    display: flex;
    flex-direction: column;
  }

  .q-form {
    max-width: 550px;
  }
}
</style>
