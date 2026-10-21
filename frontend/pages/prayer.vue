<template>
  <div class="w-full bg-paper text-ink">
    <AppPageHero
      :kicker="pageData.hero.kicker"
      :title="pageData.hero.headline"
      :image="pageData.hero.image"
      :fallback="heroImages.celebrations"
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
                Send another request
              </AppButton>
            </div>

            <form v-else class="space-y-6" @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <AppField
                  id="fullName"
                  v-model="form.fullName"
                  label="Full name"
                  autocomplete="name"
                  maxlength="150"
                  placeholder="Enter your name"
                  required
                />
                <AppField
                  id="email"
                  v-model="form.email"
                  type="email"
                  label="Email address"
                  optional
                  autocomplete="email"
                  maxlength="254"
                  placeholder="For follow-up"
                />
              </div>

              <AppField
                id="prayerRequest"
                v-model="form.request"
                as="textarea"
                label="Your prayer request"
                :rows="6"
                maxlength="5000"
                placeholder="Please share how we can pray for you..."
                required
              />

              <div class="flex items-start gap-3">
                <input
                  id="privacy"
                  v-model="form.confidential"
                  type="checkbox"
                  name="confidential"
                  class="mt-1 h-4 w-4 rounded border-line accent-ink"
                />
                <div>
                  <label for="privacy" class="text-sm font-medium text-gray-700">
                    Keep this request confidential
                  </label>
                  <p class="mt-1 text-sm leading-6 text-gray-500">
                    If checked, this request will only be seen by our pastoral
                    staff and will not be shared with the general prayer team.
                  </p>
                </div>
              </div>

              <div class="form-honeypot" aria-hidden="true">
                <label for="prayer-website">Leave this field empty</label>
                <input
                  id="prayer-website"
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

              <AppButton type="submit" :loading="loading" class="w-full">
                {{ loading ? "Submitting..." : "Send prayer request" }}
              </AppButton>
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

const defaultHeroImage = heroImages.celebrations.src;

useHead({
  title: "Prayer Request | Chapel of Praise",
});

useSeoMeta({
  description:
    "Submit a prayer request and stand in faith with the Chapel of Praise prayer team.",
  ogTitle: "Prayer Request | Chapel of Praise",
  ogDescription:
    "Submit a prayer request and stand in faith with our prayer team.",
});

const {
  loading,
  errorMessage,
  success,
  website,
  submit,
  reset,
} = usePublicForm({
  path: "/public/prayer/submit",
  successMessage:
    "Our prayer team will be standing with you in faith.",
  fallbackError:
    "We could not submit your prayer request right now. Please try again in a moment.",
});

const form = ref({
  fullName: "",
  email: "",
  request: "",
  confidential: false,
});

const handleSubmit = () => submit(form.value);

const resetForm = () => {
  form.value = { fullName: "", email: "", request: "", confidential: false };
  reset();
};

const config = useRuntimeConfig();

const { data: fetchedData } = await useFetch(
  `${config.public.apiBaseUrl}/public/prayer`,
);

const pageData = computed(() => {
  const apiData = fetchedData.value?.data || fetchedData.value || {};

  const hero = apiData.heroSection || {};
  const form = apiData.formSection || {};

  return {
    hero: {
      image: hero.heroImage || defaultHeroImage,
      kicker: hero.heroKicker || "Stand with us",
      headline: hero.heroHeadline || "Prayer Request",
    },
    form: {
      heading: form.formHeading || "We want to pray with you",
      description:
        form.formDescription ||
        "No matter what you're facing, you don't have to carry it alone. Our prayer team considers it an honor to stand with you in faith and believe God for a breakthrough in your life.",
    },
  };
});
</script>
