<!-- <script setup lang="ts">
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

      <q-btn class="q-ml-none full-width" color="dark" type="submit" size="lg">Submit</q-btn>
    </q-form>
  </div>
  <div class="desktop-view full-width">
    <q-form
      @submit.prevent="sendEmail"
      class="full-width full-height q-gutter-md bg-gr q-pt-md q-pr-xl q-pb-xl q-pl-xl"
    >
      <h2 class="text-primary q-ml-none">Contact Me</h2>

      <q-input color="dark" bg-color="primary" filled v-model="form.name" label="Name">
        <template v-slot:prepend>
          <q-icon name="person" />
        </template>
      </q-input>

      <q-input color="dark" bg-color="primary" filled v-model="form.email" label="Email">
        <template v-slot:prepend>
          <q-icon name="email" />
        </template>
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
      />

      <q-btn class="q-ml-none" color="accent" type="submit" size="lg">Submit</q-btn>

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
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .q-form {
    max-width: 600px;
    h2 {
      font-size: 2rem;
    }

    ::v-deep(.message textarea) {
      min-height: 200px !important;
    }

    .q-input {
      margin-left: 0;
    }
  }
}
</style> -->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMainStore } from '../stores/main';

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

const sending = ref(false);
const success = ref(false);
const error = ref(false);
const errorMsg = ref<string | null>(null);

const contactRef = ref<HTMLElement | null>(null);
const mainStore = useMainStore();

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
  <div id="contact" ref="contactRef" class="mobile-view full-width">
    <q-form
      @submit.prevent="sendEmail"
      class="full-width q-gutter-md bg-accent q-pt-md q-pr-xl q-pb-xl q-pl-xl"
    >
      <h2 class="text-primary q-ml-none">Contact Me</h2>

      <!-- Honeypot (hidden) -->
      <input
        v-model="form._honey"
        type="text"
        autocomplete="off"
        tabindex="-1"
        style="display: none"
      />

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

      <q-btn
        class="q-ml-none full-width"
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
    </q-form>
  </div>

  <div class="desktop-view full-width">
    <q-form
      @submit.prevent="sendEmail"
      class="full-width full-height q-gutter-md bg-gr q-pt-md q-pr-xl q-pb-xl q-pl-xl"
    >
      <h2 class="text-primary q-ml-none">Contact Me</h2>

      <!-- Honeypot (hidden) -->
      <input
        v-model="form._honey"
        type="text"
        autocomplete="off"
        tabindex="-1"
        style="display: none"
      />

      <q-input color="dark" bg-color="primary" filled v-model="form.name" label="Name" required>
        <template #prepend><q-icon name="person" /></template>
      </q-input>

      <q-input
        color="dark"
        bg-color="primary"
        filled
        v-model="form.email"
        label="Email"
        type="email"
        required
      >
        <template #prepend><q-icon name="email" /></template>
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
      />

      <q-btn
        class="q-ml-none"
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
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .q-form {
    max-width: 600px;
    h2 {
      font-size: 2rem;
    }
    ::v-deep(.message textarea) {
      min-height: 200px !important;
    }
    .q-input {
      margin-left: 0;
    }
  }
}
</style>
