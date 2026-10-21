<template>
  <div class="w-full bg-paper text-ink">
    <AppPageHero
      priority
      kicker="Join the team"
      title="Become a Worker"
      :image="heroImage"
      :fallback="heroImages.celebrations"
    />

    <section class="py-16 md:py-24">
      <AppContainer>
        <div class="mx-auto max-w-2xl">
          <h2 class="font-impact text-3xl uppercase leading-none md:text-4xl">
            Instructions are coming soon
          </h2>
          <p class="mt-5 text-base font-light leading-7 text-gray-600">
            We are putting together the registration instructions for Chapel of
            Praise workers: the units you can join, what each unit does, and the
            steps to register.
          </p>
          <p class="mt-4 text-base font-light leading-7 text-gray-600">
            Check back here soon. In the meantime, if you would like to start
            serving or have any questions, reach out to us.
          </p>
          <AppButton variant="ghost" class="mt-8" to="/contact">
            Contact us
          </AppButton>
        </div>
      </AppContainer>
    </section>
  </div>
</template>

<script setup>
import { useSeoMeta } from "#app";
import { heroImages } from "~/utils/staticImages";

const heroImage = heroImages.celebrations.src;

useSeoMeta({
  title: "Become a Worker | Chapel of Praise",
  description:
    "Join a Chapel of Praise unit. Registration instructions are coming soon — check back for details.",
});
</script>
