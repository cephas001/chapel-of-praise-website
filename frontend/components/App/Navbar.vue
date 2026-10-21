<template>
  <header
    class="fixed inset-x-0 top-0 z-40 border-b border-white/10 text-white transition-colors duration-300"
    :class="isScrolled ? 'bg-ink/80 backdrop-blur-md' : 'bg-ink'"
  >
    <AppContainer>
      <div class="flex h-20 items-center justify-between">
        <NuxtLink
          to="/"
          aria-label="Chapel of Praise home"
          class="inline-flex items-center"
        >
          <img
            src="/images/logo-256.webp"
            srcset="/images/logo-128.webp 128w, /images/logo-256.webp 256w"
            sizes="64px"
            width="507"
            height="492"
            alt="Chapel of Praise"
            class="h-12 w-auto object-contain md:h-14"
          />
        </NuxtLink>

        <div class="flex items-center gap-6 md:gap-8">
          <nav
            class="hidden items-center gap-7 text-sm text-white/80 lg:flex"
            aria-label="Primary"
          >
            <NuxtLink
              v-for="item in quickLinks"
              :key="item.label"
              :to="item.to"
              :aria-current="isActive(item.to) ? 'page' : undefined"
              class="transition-colors hover:text-white"
              active-class="text-white"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <button
            type="button"
            class="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            aria-label="Open menu"
            aria-haspopup="dialog"
            :aria-expanded="isMenuOpen"
            @click="openMenu"
          >
            <span class="hidden md:inline">Menu</span>
            <svg
              class="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 8h16M4 16h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </AppContainer>
  </header>

  <Transition name="menu">
    <div
      v-if="isMenuOpen"
      ref="panel"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      class="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col overflow-y-auto bg-ink text-white"
    >
      <div class="w-full shrink-0">
        <AppContainer>
          <div class="flex h-20 items-center justify-between">
            <NuxtLink
              to="/"
              aria-label="Chapel of Praise home"
              class="inline-flex items-center"
              @click="closeMenu"
            >
              <img
                src="/images/combined-logos-241.webp"
                width="241"
                height="72"
                alt="Chapel of Praise and Mountain of the Lord"
                class="h-12 w-auto object-contain md:h-14"
              />
            </NuxtLink>

            <button
              type="button"
              class="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              aria-label="Close menu"
              @click="closeMenu"
            >
              <Icon name="heroicons:x-mark" class="h-8 w-8" aria-hidden="true" />
            </button>
          </div>
        </AppContainer>
      </div>

      <div class="w-full grow">
        <AppContainer>
          <div
            class="grid content-center gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-20"
          >
            <nav
              class="flex flex-col gap-2.5 lg:col-span-5"
              aria-label="Main pages"
            >
              <NuxtLink
                v-for="(link, index) in mainLinks"
                :key="link.label"
                :to="link.to"
                :aria-current="isActive(link.to) ? 'page' : undefined"
                class="menu-stagger group flex w-max items-center gap-4 font-impact text-4xl uppercase leading-none text-white/90 transition-colors hover:text-white sm:text-5xl md:text-[4rem]"
                :class="{ 'text-white': isActive(link.to) }"
                :style="{ animationDelay: `${index * 50 + 60}ms` }"
                @click="closeMenu"
              >
                <span
                  class="h-8 w-1.5 shrink-0 rounded-full bg-brand-600 transition-opacity md:h-10"
                  :class="
                    isActive(link.to)
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-50'
                  "
                  aria-hidden="true"
                />
                {{ link.label }}
              </NuxtLink>
            </nav>

            <div
              class="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-7"
            >
              <div
                v-for="(group, groupIndex) in menuGroups"
                :key="group.title"
                class="menu-fade"
                :style="{ animationDelay: `${groupIndex * 70 + 250}ms` }"
              >
                <p class="mb-4 text-sm font-semibold text-white">
                  {{ group.title }}
                </p>
                <ul class="space-y-3">
                  <li v-for="link in group.links" :key="link.label">
                    <NuxtLink
                      :to="link.external ? link.href : link.to"
                      :target="link.external ? '_blank' : undefined"
                      :rel="link.external ? 'noopener noreferrer' : undefined"
                      :aria-current="
                        !link.external && isActive(link.to)
                          ? 'page'
                          : undefined
                      "
                      class="text-sm transition-colors"
                      :class="
                        !link.external && isActive(link.to)
                          ? 'text-brand-600'
                          : 'text-white/80 hover:text-white'
                      "
                      @click="closeMenu"
                    >
                      {{ link.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AppContainer>
      </div>

      <div class="w-full shrink-0 border-t border-white/10">
        <AppContainer>
          <div
            class="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <p class="text-sm text-white/80">
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
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const panel = ref(null);
const year = new Date().getFullYear();

let lastFocusedElement = null;

const quickLinks = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Events", to: "/events-calendar" },
  { label: "Give", to: "/giving" },
];

const mainLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Ministries", to: "/ministries" },
  { label: "Leadership", to: "/leadership" },
];

const menuGroups = [
  {
    title: "Visit",
    links: [
      { label: "Events calendar", to: "/events-calendar" },
      { label: "Contact us", to: "/contact" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Prayer request", to: "/prayer" },
      { label: "Counselling", to: "/counselling" },
      { label: "Become a worker", to: "/become-a-worker" },
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

const isActive = (path) =>
  path === "/" ? route.path === "/" : route.path.startsWith(path);

const openMenu = async () => {
  lastFocusedElement = document.activeElement;
  isMenuOpen.value = true;
  await nextTick();
  panel.value?.querySelector("a, button")?.focus();
};

const closeMenu = () => {
  if (!isMenuOpen.value) return;
  isMenuOpen.value = false;
  lastFocusedElement?.focus?.();
};

watch(
  () => route.fullPath,
  () => {
    if (isMenuOpen.value) closeMenu();
  },
);

watch(isMenuOpen, (isOpen) => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }
});

const handleKeydown = (event) => {
  if (!isMenuOpen.value) return;

  if (event.key === "Escape") {
    closeMenu();
    return;
  }

  if (event.key !== "Tab") return;

  const focusables = panel.value?.querySelectorAll(
    "a[href], button:not([disabled])",
  );
  if (!focusables?.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleKeydown);
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.menu-stagger,
.menu-fade {
  opacity: 0;
  transform: translateY(16px);
  animation: slide-up-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.menu-fade {
  transform: translateY(10px);
}

@keyframes slide-up-fade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .menu-enter-active,
  .menu-leave-active,
  .menu-stagger,
  .menu-fade {
    transition: none;
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
