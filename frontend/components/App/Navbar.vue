<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[var(--navbar-border)] bg-black text-white"
  >
    <div class="max-w-6xl mx-auto px-4 md:px-8">
      <div class="h-20 flex items-center justify-between">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <span class="font-black tracking-tight text-2xl leading-none">MCP</span>
          <span class="text-[11px] md:text-xs uppercase tracking-[0.18em] text-white/70">
            McPherson Chapel of Praise
          </span>
        </NuxtLink>

        <nav class="hidden lg:flex items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-white/85">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.label"
            :to="item.to"
            class="hover:text-white transition-colors"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <button
          class="lg:hidden inline-flex items-center justify-center w-10 h-10"
          aria-label="Toggle navigation menu"
          @click="isMobileOpen = !isMobileOpen"
        >
          <Icon v-if="!isMobileOpen" name="heroicons:bars-3-bottom-right" class="w-7 h-7" />
          <Icon v-else name="heroicons:x-mark" class="w-7 h-7" />
        </button>
      </div>
    </div>

    <transition name="mobile-menu">
      <div
        v-if="isMobileOpen"
        class="lg:hidden border-t border-[var(--navbar-border)] bg-black/95 backdrop-blur-sm"
      >
        <nav class="px-6 py-4 flex flex-col gap-4 text-xs uppercase tracking-[0.18em]">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.label"
            :to="item.to"
            class="text-white/85 hover:text-white transition-colors"
            @click="isMobileOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from "vue";

const isMobileOpen = ref(false);

const menuItems = [
  { label: "About", to: "/" },
  { label: "Quick Links", to: "/" },
  { label: "Campuses", to: "/" },
  { label: "Cell Church", to: "/" },
  { label: "Sermons", to: "/" },
  { label: "Map", to: "/" },
  { label: "Give", to: "/" },
];
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.25s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
