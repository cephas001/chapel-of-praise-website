<template>
  <div class="w-full bg-paper text-ink">
    <AppPageHero
      priority
      :kicker="pageData.hero.kicker"
      :title="pageData.hero.headline"
      :image="pageData.hero.image"
      :fallback="heroImages.about"
    />

    <section class="py-16 md:py-24">
      <AppContainer>
        <div class="mx-auto max-w-2xl">
          <h2 class="font-impact text-3xl uppercase leading-none md:text-4xl">
            {{ pageData.form.heading }}
          </h2>
          <p class="mt-5 text-base font-light leading-7 text-gray-600">
            {{ pageData.form.description }}
          </p>

          <div class="mt-10 rounded-2xl border border-line bg-paper p-6 md:p-10">
            <div v-if="success">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700"
              >
                <Icon
                  name="heroicons:check"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </div>
              <h3 class="mt-5 text-xl font-semibold">Request received</h3>
              <p class="mt-3 text-base font-light leading-7 text-gray-600">
                {{ success }}
              </p>
              <AppButton variant="ghost" class="mt-6" @click="resetForm">
                Submit another request
              </AppButton>
            </div>

            <form v-else class="space-y-6" @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <AppField
                  id="firstName"
                  v-model="form.firstName"
                  label="First name"
                  autocomplete="given-name"
                  maxlength="100"
                  required
                />
                <AppField
                  id="lastName"
                  v-model="form.lastName"
                  label="Last name"
                  autocomplete="family-name"
                  maxlength="100"
                  required
                />
                <AppField
                  id="email"
                  v-model="form.email"
                  type="email"
                  label="Email address"
                  autocomplete="email"
                  maxlength="254"
                  required
                />
                <AppField
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  label="Phone number"
                  autocomplete="tel"
                  maxlength="32"
                  placeholder="+234 XXX XXX XXXX"
                  required
                />
              </div>

              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <AppField
                  id="contactMethod"
                  v-model="form.preferredContactMethod"
                  as="select"
                  label="Preferred contact method"
                >
                  <option value="" disabled>Select an option</option>
                  <option value="phone">Phone call</option>
                  <option value="email">Email</option>
                  <option value="text">Text message</option>
                </AppField>

                <AppField
                  id="counsellingArea"
                  v-model="form.counsellingArea"
                  as="select"
                  label="Area of counselling"
                >
                  <option value="" disabled>Select an area</option>
                  <option value="marriage">Marriage / relationship</option>
                  <option value="premarital">Pre-marital course</option>
                  <option value="spiritual">Spiritual growth</option>
                  <option value="grief">Grief and loss</option>
                  <option value="addiction">Habits and addiction</option>
                  <option value="general">General guidance</option>
                </AppField>
              </div>

              <AppField
                id="details"
                v-model="form.details"
                as="textarea"
                label="Additional information"
                optional
                :rows="5"
                maxlength="5000"
                placeholder="Briefly describe what you would like to discuss (this is strictly confidential)"
              />

              <div class="form-honeypot" aria-hidden="true">
                <label for="counselling-website">Leave this field empty</label>
                <input
                  id="counselling-website"
                  v-model="website"
                  type="text"
                  name="website"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>

              <div
                v-if="errorMessage"
                role="alert"
                class="flex gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4"
              >
                <Icon
                  name="heroicons:x-circle"
                  class="h-5 w-5 shrink-0 text-brand-600"
                  aria-hidden="true"
                />
                <p class="text-sm font-medium text-brand-700">
                  {{ errorMessage }}
                </p>
              </div>

              <div>
                <AppButton type="submit" :loading="loading" class="w-full">
                  {{ loading ? "Submitting..." : "Request counselling session" }}
                </AppButton>
                <p class="mt-6 text-sm leading-6 text-gray-500">
                  {{ pageData.form.footerNote }}
                </p>
              </div>
            </form>
          </div>
        </div>
      </AppContainer>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRuntimeConfig, useFetch, useHead, useSeoMeta } from "#app";
import { heroImages } from "~/utils/staticImages";

const defaultHeroImage = heroImages.about.src;

useHead({
  title: "Counselling | Chapel of Praise",
});

useSeoMeta({
  description:
    "Request a confidential pastoral counselling session with the Chapel of Praise care team.",
  ogTitle: "Counselling | Chapel of Praise",
  ogDescription:
    "Request a confidential pastoral counselling session with our care team.",
});

const {
  loading,
  errorMessage,
  success,
  website,
  submit,
  reset,
} = usePublicForm({
  path: "/public/counselling/submit",
  successMessage:
    "A member of our pastoral care team will reach out using your preferred contact method.",
  fallbackError:
    "We could not submit your request right now. Please try again in a moment.",
});

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredContactMethod: "",
  counsellingArea: "",
  details: "",
});

const handleSubmit = () => submit(form.value);

const resetForm = () => {
  form.value = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContactMethod: "",
    counsellingArea: "",
    details: "",
  };
  reset();
};

const config = useRuntimeConfig();

const { data: fetchedData } = await useFetch(
  `${config.public.apiBaseUrl}/public/counselling`,
  { lazy: import.meta.client },
);

const pageData = computed(() => {
  const apiData = fetchedData.value || {};

  const hero = apiData.heroSection || {};
  const form = apiData.formSection || {};

  return {
    hero: {
      image: hero.heroImage || defaultHeroImage,
      kicker: hero.heroKicker || "Guidance and support",
      headline: hero.heroHeadline || "Counselling",
    },
    form: {
      heading: form.formHeading || "A safe place to talk",
      description:
        form.formDescription ||
        "Life can be challenging, but you don't have to navigate it alone. Our pastoral care and counselling team is here to provide biblical guidance, emotional support, and a listening ear in a completely confidential environment.",
      footerNote:
        form.formFooterNote ||
        "Your privacy is extremely important to us. Information submitted here is securely routed directly to our certified pastoral care team only.",
    },
  };
});
</script>
