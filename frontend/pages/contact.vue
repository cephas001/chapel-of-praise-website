<template>
  <div class="w-full bg-paper text-ink">
    <AppPageHero
      :kicker="pageData.hero.kicker"
      :title="pageData.hero.headline"
      :image="pageData.hero.image"
    />

    <section class="py-16 md:py-24">
      <AppContainer>
        <div class="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 class="font-impact text-3xl uppercase leading-none md:text-4xl">
              {{ pageData.form.heading }}
            </h2>
            <p class="mt-5 text-base font-light leading-7 text-gray-600">
              {{ pageData.form.description }}
            </p>

            <div
              v-if="success"
              class="mt-10 rounded-2xl border border-line bg-surface p-8"
            >
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700"
              >
                <Icon
                  name="heroicons:check"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </div>
              <h3 class="mt-5 text-xl font-semibold">Message sent</h3>
              <p class="mt-3 text-base font-light leading-7 text-gray-600">
                {{ success }}
              </p>
              <AppButton variant="ghost" class="mt-6" @click="resetForm">
                Send another message
              </AppButton>
            </div>

            <form v-else class="mt-10 space-y-6" @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <AppField
                  id="firstName"
                  v-model="form.firstName"
                  label="First name"
                  autocomplete="given-name"
                  maxlength="100"
                  placeholder="John"
                  required
                />
                <AppField
                  id="lastName"
                  v-model="form.lastName"
                  label="Last name"
                  autocomplete="family-name"
                  maxlength="100"
                  placeholder="Doe"
                  required
                />
              </div>

              <AppField
                id="email"
                v-model="form.email"
                type="email"
                label="Email address"
                autocomplete="email"
                maxlength="254"
                placeholder="john@example.com"
                required
              />

              <AppField
                id="message"
                v-model="form.message"
                as="textarea"
                label="Message"
                :rows="5"
                maxlength="5000"
                placeholder="How can we help you?"
                required
              />

              <div class="form-honeypot" aria-hidden="true">
                <label for="contact-website">Leave this field empty</label>
                <input
                  id="contact-website"
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

              <AppButton
                type="submit"
                :loading="loading"
                class="w-full md:w-auto"
              >
                {{ loading ? "Sending..." : "Send message" }}
              </AppButton>
            </form>
          </div>

          <div>
            <div class="rounded-2xl border border-line bg-surface p-8 md:p-12">
              <h2 class="text-2xl font-semibold">Visit us</h2>

              <div class="mt-8 space-y-8">
                <div
                  v-if="pageData.campus.address"
                  class="flex items-start gap-4"
                >
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper"
                  >
                    <Icon
                      name="heroicons:map-pin"
                      class="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-semibold">
                      {{ pageData.campus.name }}
                    </p>
                    <p
                      class="mt-1 whitespace-pre-line text-base font-light leading-7 text-gray-600"
                    >
                      {{ pageData.campus.address }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="pageData.campus.serviceTimesDetails"
                  class="flex items-start gap-4"
                >
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper"
                  >
                    <Icon
                      name="heroicons:clock"
                      class="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-semibold">
                      {{ pageData.campus.serviceTimesTitle }}
                    </p>
                    <p
                      class="mt-1 whitespace-pre-line text-base font-light leading-7 text-gray-600"
                    >
                      {{ pageData.campus.serviceTimesDetails }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="pageData.contact.email || pageData.contact.phone"
                  class="flex items-start gap-4"
                >
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper"
                  >
                    <Icon
                      name="heroicons:envelope"
                      class="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold">Contact details</p>
                    <p
                      class="mt-1 text-base font-light leading-7 text-gray-600"
                    >
                      <span
                        v-if="pageData.contact.email"
                        class="block break-words"
                      >
                        Email: {{ pageData.contact.email }}
                      </span>
                      <span v-if="pageData.contact.phone" class="block">
                        Phone: {{ pageData.contact.phone }}
                      </span>
                    </p>
                  </div>
                </div>

                <p
                  v-if="!hasContactDetails"
                  class="text-base font-light leading-7 text-gray-600"
                >
                  Contact details are temporarily unavailable. Send us a message
                  and our team will respond.
                </p>
              </div>

              <div
                v-if="hasSocialLinks"
                class="mt-10 border-t border-line pt-8"
              >
                <p class="text-sm font-semibold">Follow our journey</p>
                <div class="mt-4 flex gap-3">
                  <a
                    v-if="pageData.contact.instagramUrl"
                    :href="pageData.contact.instagramUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chapel of Praise on Instagram"
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-brand-600"
                  >
                    <Icon name="mdi:instagram" class="h-5 w-5" />
                  </a>
                  <a
                    v-if="pageData.contact.twitterUrl"
                    :href="pageData.contact.twitterUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chapel of Praise on X"
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-brand-600"
                  >
                    <Icon name="mdi:twitter" class="h-5 w-5" />
                  </a>
                  <a
                    v-if="pageData.contact.youtubeUrl"
                    :href="pageData.contact.youtubeUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chapel of Praise on YouTube"
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-brand-600"
                  >
                    <Icon name="mdi:youtube" class="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRuntimeConfig, useFetch, useHead, useSeoMeta } from "#app";
import defaultHeroImage from "~/assets/images/connect.webp";

useHead({
  title: "Contact Us | Chapel of Praise",
});

useSeoMeta({
  description:
    "Get in touch with Chapel of Praise. Find our campus address, service times, phone number, and send us a message.",
  ogTitle: "Contact Us | Chapel of Praise",
  ogDescription:
    "Find our campus address, service times, phone number, and send us a message.",
});

const { loading, errorMessage, success, website, submit, reset } =
  usePublicForm({
    path: "/public/contact/submit",
    successMessage:
      "Your message has been received and our team will get back to you soon.",
    fallbackError:
      "We could not send your message right now. Please try again in a moment.",
  });

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  message: "",
});

const handleSubmit = () => submit(form.value);

const resetForm = () => {
  form.value = { firstName: "", lastName: "", email: "", message: "" };
  reset();
};

const config = useRuntimeConfig();

const { data: fetchedData } = await useFetch(
  `${config.public.apiBaseUrl}/public/contact`,
);

const pageData = computed(() => {
  const apiData = fetchedData.value || {};

  const hero = apiData.heroSection || {};
  const form = apiData.formSection || {};
  const campus = apiData.campusSection || {};
  const contact = apiData.contactSection || {};

  return {
    hero: {
      image: hero.heroImage || defaultHeroImage,
      kicker: hero.heroKicker || "Reach out",
      headline: hero.heroHeadline || "Contact Us",
    },
    form: {
      heading: form.formHeading || "Send a message",
      description:
        form.formDescription ||
        "Have questions about our ministries, services, or events? Send us a message, and our team will get back to you as soon as possible.",
    },
    campus: {
      name: campus.campusName || "Main Campus",
      address: campus.campusAddress || "",
      serviceTimesTitle: campus.serviceTimesTitle || "Service times",
      serviceTimesDetails: campus.serviceTimesDetails || "",
    },
    contact: {
      email: contact.email || "",
      phone: contact.phone || "",
      instagramUrl: contact.instagramUrl || "",
      twitterUrl: contact.twitterUrl || "",
      youtubeUrl: contact.youtubeUrl || "",
    },
  };
});

const hasContactDetails = computed(() =>
  Boolean(
    pageData.value.campus.address ||
    pageData.value.campus.serviceTimesDetails ||
    pageData.value.contact.email ||
    pageData.value.contact.phone,
  ),
);

const hasSocialLinks = computed(() =>
  Boolean(
    pageData.value.contact.instagramUrl ||
    pageData.value.contact.twitterUrl ||
    pageData.value.contact.youtubeUrl,
  ),
);
</script>
