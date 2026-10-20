<template>
  <footer class="w-full bg-brand-700 text-white">
    <AppContainer>
      <div class="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p class="font-impact text-2xl uppercase leading-none">
            Chapel of praise
          </p>
          <p class="mt-4 max-w-xs text-sm leading-6 text-white/80">
            In Christ, for Christ, with joy.
          </p>
        </div>

        <div v-for="column in columns" :key="column.title">
          <p class="mb-5 text-sm font-semibold text-white">
            {{ column.title }}
          </p>
          <ul class="space-y-3">
            <li v-for="link in column.links" :key="link.label">
              <NuxtLink
                :to="link.external ? link.href : link.to"
                :target="link.external ? '_blank' : undefined"
                :rel="link.external ? 'noopener noreferrer' : undefined"
                class="text-sm text-white/80 transition-colors hover:text-white"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="flex flex-col items-center justify-between gap-6 border-t border-white/20 py-8 sm:flex-row"
      >
        <p class="text-center text-sm text-white/80 sm:text-left">
          &copy; {{ year }} Chapel of Praise. All rights reserved.
        </p>

        <a
          href="https://www.youtube.com/@mcucop"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
        >
          <Icon name="mdi:youtube" class="h-5 w-5" aria-hidden="true" />
          Watch on YouTube
        </a>
      </div>
    </AppContainer>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear();

const columns = [
  {
    title: "Explore",
    links: [
      { label: "About us", to: "/about" },
      { label: "Ministries", to: "/ministries" },
      { label: "Leadership", to: "/leadership" },
      { label: "Events calendar", to: "/events-calendar" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Prayer request", to: "/prayer" },
      { label: "Counselling", to: "/counselling" },
      { label: "Become a worker", to: "/become-a-worker" },
      { label: "Workers biodata", to: "/biodata" },
      { label: "Contact us", to: "/contact" },
    ],
  },
  {
    title: "Watch and give",
    links: [
      { label: "Giving", to: "/giving" },
      {
        label: "Watch on YouTube",
        href: "https://www.youtube.com/@mcucop",
        external: true,
      },
    ],
  },
];
</script>
