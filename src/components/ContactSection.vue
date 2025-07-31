<script setup lang="ts">
import { ref, onMounted } from 'vue';
import emailjs from 'emailjs-com';
import { useMainStore } from '../stores/main';

const form = ref({
  name: '',
  email: '',
  message: '',
});

const sending = ref(false);
const success = ref(false);
const error = ref(false);

const contactRef = ref<HTMLElement | null>(null);
const mainStore = useMainStore();

onMounted(() => {
  mainStore.SET_CONTACT_SECTION_REF(contactRef.value);
});

const sendEmail = () => {
  sending.value = true;
  success.value = false;
  error.value = false;

  emailjs
    .send(
      'your_service_id', // e.g., 'gmail'
      'your_template_id', // e.g., 'template_xxx123'
      {
        from_name: form.value.name,
        reply_to: form.value.email,
        message: form.value.message,
      },
      'your_public_key', // e.g., 'U9kxxXXXXYYYYZ'
    )
    .then(() => {
      sending.value = false;
      success.value = true;
      form.value = { name: '', email: '', message: '' };
    })
    .catch(() => {
      sending.value = false;
      error.value = true;
    });
};
</script>

<template>
  <div id="contact" ref="contactRef" class="mobile-view full-width">
    <q-form
      @submit.prevent="sendEmail"
      class="full-width q-gutter-md bg-accent q-pt-md q-pr-xl q-pb-xl q-pl-xl"
    >
      <h2 class="text-primary q-ml-none">Contact Me</h2>
      <q-input
        v-model="form.name"
        label="Your Name"
        bg-color="primary"
        class="q-ml-none"
        outlined
        required
      />
      <q-input
        v-model="form.email"
        type="email"
        label="Your Email"
        bg-color="primary"
        class="q-ml-none"
        outlined
        required
      />

      <q-input
        v-model="form.message"
        type="textarea"
        label="Your Message"
        class="q-ml-none message"
        bg-color="primary"
        outlined
        required
        autogrow
      />

      <q-banner v-if="success" class="bg-green-2 text-black q-mt-sm">
        ✅ Message sent successfully!
      </q-banner>

      <q-banner v-if="error" class="bg-red-2 text-black q-mt-sm">
        ❌ Failed to send. Please try again.
      </q-banner>
    </q-form>
  </div>

  <div class="desktop-view full-width">
    <q-form
      @submit.prevent="sendEmail"
      class="full-width q-gutter-md bg-accent q-pt-md q-pr-xl q-pb-xl q-pl-xl"
    >
      <h2 class="text-primary q-ml-none">Contact Me</h2>
      <q-input
        v-model="form.name"
        label="Your Name"
        bg-color="primary"
        class="q-ml-none"
        outlined
        required
      />
      <q-input
        v-model="form.email"
        type="email"
        label="Your Email"
        bg-color="primary"
        class="q-ml-none"
        outlined
        required
      />

      <q-input
        v-model="form.message"
        type="textarea"
        label="Your Message"
        class="q-ml-none message"
        bg-color="primary"
        outlined
        required
        autogrow
      />

      <q-banner v-if="success" class="bg-green-2 text-black q-mt-sm">
        ✅ Message sent successfully!
      </q-banner>

      <q-banner v-if="error" class="bg-red-2 text-black q-mt-sm">
        ❌ Failed to send. Please try again.
      </q-banner>
    </q-form>
  </div>
</template>

<style lang="scss" scoped>
@import '../css/main.scss';
.mobile-view {
  @media (min-width: $breakpoint-md) {
    display: none;
  }
  .q-form {
    h2 {
      font-size: 2rem;
    }

    ::v-deep(.message textarea) {
      min-height: 200px !important;
    }
  }
}

.desktop-view {
  display: none;

  @media (min-width: $breakpoint-md) {
    display: initial;
  }
}
</style>
