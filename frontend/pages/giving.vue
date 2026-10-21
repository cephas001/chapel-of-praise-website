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
        <h2
          class="font-impact max-w-3xl text-3xl uppercase leading-none md:text-4xl"
        >
          {{ pageData.headline.title }}
        </h2>
        <p class="mt-5 max-w-2xl text-lg font-light leading-relaxed text-gray-600">
          {{ pageData.headline.description }}
        </p>

        <div
          class="mt-12 grid grid-cols-1 gap-6"
          :class="{ 'lg:grid-cols-2': hasBankDetails && hasOnlineGiving }"
        >
          <div
            v-if="hasBankDetails"
            class="rounded-2xl border border-line bg-surface p-8"
          >
            <Icon
              name="heroicons:building-library"
              class="h-8 w-8 text-brand-600"
              aria-hidden="true"
            />
            <h3 class="mt-5 text-xl font-semibold">Bank transfer</h3>

            <dl class="mt-6 space-y-5">
              <div v-if="pageData.bank.name">
                <dt class="text-sm text-muted">Bank name</dt>
                <dd class="mt-1 text-lg font-medium">
                  {{ pageData.bank.name }}
                </dd>
              </div>
              <div v-if="pageData.bank.accountName">
                <dt class="text-sm text-muted">Account name</dt>
                <dd class="mt-1 text-lg font-medium">
                  {{ pageData.bank.accountName }}
                </dd>
              </div>
              <div v-if="pageData.bank.accountNumber">
                <dt class="text-sm text-muted">Account number</dt>
                <dd
                  class="mt-1 text-2xl font-semibold tracking-widest text-brand-700 tabular-nums"
                >
                  {{ pageData.bank.accountNumber }}
                </dd>
              </div>
            </dl>
          </div>

          <div
            v-if="hasOnlineGiving"
            class="flex flex-col justify-between rounded-2xl border border-line bg-paper p-8"
          >
            <div>
              <Icon
                name="heroicons:credit-card"
                class="h-8 w-8 text-brand-600"
                aria-hidden="true"
              />
              <h3 class="mt-5 text-xl font-semibold">Give online</h3>
              <p class="mt-4 text-base font-light leading-7 text-gray-600">
                {{ pageData.online.description }}
              </p>
            </div>
            <AppButton
              variant="primary"
              class="mt-8 w-full"
              :href="pageData.online.buttonUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Give now
            </AppButton>
          </div>

          <div
            v-if="!hasBankDetails && !hasOnlineGiving"
            class="rounded-2xl border border-line bg-surface p-10 text-center"
          >
            <h3 class="text-xl font-semibold">
              Giving details are temporarily unavailable
            </h3>
            <p class="mt-3 text-base font-light leading-7 text-gray-600">
              Please contact the chapel office for assistance with your giving.
            </p>
            <AppButton variant="ghost" class="mt-6" to="/contact">
              Contact us
            </AppButton>
          </div>
        </div>
      </AppContainer>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRuntimeConfig, useFetch, useHead, useSeoMeta } from "#app";
import { heroImages } from "~/utils/staticImages";

const defaultHeroImage = heroImages.celebrations.src;

useHead({
  title: "Giving | Chapel of Praise",
});

useSeoMeta({
  description:
    "Partner with Chapel of Praise through giving. Find our bank transfer details and secure online giving options.",
  ogTitle: "Giving | Chapel of Praise",
  ogDescription:
    "Partner with Chapel of Praise through giving. Find our bank transfer and online giving options.",
});

const config = useRuntimeConfig();

const { data: fetchedData } = await useFetch(
  `${config.public.apiBaseUrl}/public/giving`,
);

const pageData = computed(() => {
  const apiData = fetchedData.value || {};

  const hero = apiData.heroSection || {};
  const headline = apiData.headlineSection || {};
  const bank = apiData.bankDetailsSection || {};
  const online = apiData.onlinePaymentSection || {};

  return {
    hero: {
      image: hero.heroImage || defaultHeroImage,
      kicker: hero.heroKicker || "Partner with us",
      headline: hero.heroHeadline || "Giving",
    },
    headline: {
      title: headline.sectionHeadline || "Worship through giving",
      description:
        headline.sectionDescription ||
        "Your generosity helps us continue our mission to shine the gospel light globally and raise the next generation of champions. Thank you for partnering with Chapel of Praise.",
    },
    bank: {
      name: bank.bankName || "",
      accountName: bank.accountName || "",
      accountNumber: bank.accountNumber || "",
    },
    online: {
      description:
        online.onlinePaymentDescription ||
        "Make a secure online donation via our payment gateway using your debit or credit card.",
      buttonUrl: online.onlinePaymentButtonUrl || "",
    },
  };
});

const hasBankDetails = computed(() =>
  Boolean(pageData.value.bank.accountNumber),
);

const hasOnlineGiving = computed(() => Boolean(pageData.value.online.buttonUrl));
</script>
