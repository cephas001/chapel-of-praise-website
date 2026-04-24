<template>
  <!-- Standard Top Navbar -->
  <header
    class="fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b text-white"
    :class="[
      isScrollingDown 
        ? 'bg-black/50 backdrop-blur-md border-white/10 shadow-lg' 
        : 'bg-black border-[var(--navbar-border)]'
    ]"
  >
    <div class="max-w-6xl mx-auto px-4 md:px-8">
      <div class="h-20 flex items-center justify-between">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <img src="~/assets/images/Chapel Of Praise Logo.png" class="w-16 md:w-24 object-contain"/>
        </NuxtLink>

        <!-- Combined Desktop Nav + Universal Mega Menu Trigger -->
        <div class="flex items-center gap-6 md:gap-8">
          <nav class="hidden lg:flex items-center gap-7 text-[11px] uppercase tracking-widest text-white/85">
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
            class="inline-flex items-center justify-center w-10 h-10 group"
            aria-label="Open full-screen menu"
            @click="isMenuOpen = true"
          >
            <!-- Clean double-bar icon for a premium look, scales up slightly on hover -->
            <svg class="w-8 h-8 group-hover:text-[#e94e4e] group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 8h16M4 16h16"></path></svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Premium Full-Screen Overlay Menu -->
  <transition name="mega-menu">
    <div v-if="isMenuOpen" class="fixed inset-0 z-[100] bg-black text-white w-full h-[100dvh] overflow-y-auto flex flex-col flex-nowrap">
      
      <!-- Overlay Header -->
      <div class="w-full shrink-0 transition-opacity duration-500 delay-100" :class="{'opacity-100': isMenuOpen, 'opacity-0': !isMenuOpen}">
        <div class="max-w-6xl mx-auto px-4 md:px-8">
          <div class="h-20 flex items-center justify-between">
            <NuxtLink to="/" @click="isMenuOpen = false" class="inline-flex items-center">
              <img src="~/assets/images/Combined Logos.png" class="w-24 md:w-32 object-contain opacity-90 hover:opacity-100 transition-opacity"/>
            </NuxtLink>
            
            <button
              class="inline-flex items-center justify-center w-10 h-10 group"
              aria-label="Close menu"
              @click="isMenuOpen = false"
            >
              <Icon name="heroicons:x-mark" class="w-10 h-10 group-hover:rotate-90 group-hover:text-[#e94e4e] transition-all duration-500" />
            </button>
          </div>
        </div>
      </div>

      <!-- Main Directory Grid -->
      <div class="flex-grow max-w-6xl w-full mx-auto px-4 md:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 content-center">
        
        <!-- Left Axis: Big Impact Links -->
        <div class="lg:col-span-5 flex flex-col gap-1.5 md:gap-2">
          <NuxtLink
            v-for="(link, index) in mainLinks"
            :key="link.label"
            :to="link.to"
            class="staggered-link font-impact uppercase text-4xl sm:text-5xl md:text-[4.5rem] tracking-normal leading-none text-white/90 hover:text-[#e94e4e] hover:translate-x-2 transition-all duration-300 w-max"
            :style="{ animationDelay: `${index * 50 + 100}ms` }"
            :class="{'active-red': index === 0}"
            @click="isMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Right Axis: Categorized Structure & Footer -->
        <div class="lg:col-span-7 flex flex-col justify-between mt-4 lg:mt-2">
          <!-- Categories Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-y-12 md:gap-x-12">
            <div 
              v-for="(cat, catIndex) in categoryLinks" 
              :key="cat.title" 
              class="flex flex-col gap-4 staggered-fade"
              :style="{ animationDelay: `${catIndex * 75 + 400}ms` }"
            >
              <p class="text-[10px] md:text-xs font-bold uppercase tracking-wider text-white/40 mb-1">
                {{ cat.title }}
              </p>
              <div class="flex flex-col gap-3">
                <NuxtLink
                  v-for="link in cat.links"
                  :key="link.label"
                  :to="link.to"
                  class="text-sm md:text-[15px] font-medium tracking-wide text-white/80 hover:text-white transition-colors flex items-center group/link"
                  @click="isMenuOpen = false"
                >
                  <span class="w-0 overflow-hidden group-hover/link:w-4 transition-all duration-300 ease-out text-[#e94e4e]">&rarr;</span>
                  {{ link.label }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Bottom Footer Group (Aligned perfectly under the categories) -->
          <div class="mt-16 md:mt-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 staggered-fade" style="animation-delay: 800ms;">
            <p class="text-[11px] text-white/50 leading-snug max-w-[260px]">
              &copy; Copyright {{ new Date().getFullYear() }} Chapel of Praise. All<br class="hidden md:block" /> Rights Reserved.
            </p>
            <div class="flex items-center gap-3">
              <NuxtLink to="/" class="w-10 h-10 rounded-full bg-[#1c1c1c] text-white flex items-center justify-center hover:bg-white hover:text-black hover:scale-105 transition-all outline-none"><Icon name="mdi:instagram" class="w-4 h-4" /></NuxtLink>
              <NuxtLink to="/" class="w-10 h-10 rounded-full bg-[#1c1c1c] text-white flex items-center justify-center hover:bg-white hover:text-black hover:scale-105 transition-all outline-none"><Icon name="mdi:twitter" class="w-4 h-4" /></NuxtLink>
              <NuxtLink to="https://www.youtube.com/@mcucop" class="w-10 h-10 rounded-full bg-[#1c1c1c] text-white flex items-center justify-center hover:bg-white hover:text-black hover:scale-105 transition-all outline-none"><Icon name="mdi:youtube" class="w-4 h-4" /></NuxtLink>
              <NuxtLink to="/" class="w-10 h-10 rounded-full bg-[#1c1c1c] text-white flex items-center justify-center hover:bg-white hover:text-black hover:scale-105 transition-all outline-none"><Icon name="mdi:linkedin" class="w-4 h-4" /></NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";

const isMenuOpen = ref(false);
const isScrollingDown = ref(false);
let lastScrollPosition = 0;

const route = useRoute();

// --- Professional Practice 1: Route-change cleanup ---
watch(() => route.fullPath, () => {
  isMenuOpen.value = false;
});

// --- Professional Practice 2: Body Scroll Lock ---
watch(isMenuOpen, (isOpen) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
});

// --- Professional Practice 3: Keyboard Accessibility (Close on Esc) ---
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isMenuOpen.value) {
    isMenuOpen.value = false;
  }
};

const handleScroll = () => {
  const currentScrollPosition = window.scrollY;
  // Show glassmorphism effect when scrolling DOWN and past 50px threshold
  if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 50) {
    isScrollingDown.value = true;
  } else {
    isScrollingDown.value = false;
  }
  lastScrollPosition = currentScrollPosition;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("keydown", handleKeydown, { passive: true });
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("keydown", handleKeydown);
  }
});

// Standard Desktop Items (Kept for quick access toolbar)
const menuItems = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Events", to: "/events-calendar" },
  { label: "Give", to: "/giving" },
];

// Mega Menu Left Axis (Giant Impact typography)
const mainLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Ministries", to: "/ministries" },
  { label: "Leadership", to: "/leadership" },
  { label: "Events", to: "/events-calendar" },
  { label: "Give", to: "/giving" },
];

// Mega Menu Right Axis (Structured directories)
const categoryLinks = [
  {
    title: "Quick Links",
    links: [
      { label: "All Ministries", to: "/ministries" },
      { label: "Our Leadership", to: "/leadership" },
      { label: "Give Online", to: "/giving" },
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Counselling", to: "/counseling" },
      { label: "Prayer Request", to: "/prayer" },
      { label: "Our History", to: "/about" },
    ]
  },
  {
    title: "Connect",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "Events Calendar", to: "/events-calendar" },
      { label: "Join a Cell", to: "/" },
    ]
  },
  {
    title: "Media",
    links: [
      { label: "Watch Online", to: "https://www.youtube.com/@mcucop" },
      { label: "Testimonies", to: "/" },
      { label: "Vineyard's Voice", to: "/" },
    ]
  },
];
</script>

<style scoped>
/* Mega Menu Main Container Animation */
.mega-menu-enter-active,
.mega-menu-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.mega-menu-enter-from,
.mega-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  backdrop-filter: blur(0px);
}
.mega-menu-enter-to,
.mega-menu-leave-from {
  backdrop-filter: blur(10px);
}

/* Staggered Entry Animation for Giant Links */
.staggered-link {
  opacity: 0;
  transform: translateY(20px);
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Staggered Entry Animation for Sub-Categories */
.staggered-fade {
  opacity: 0;
  transform: translateY(10px);
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUpFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.active-red {
  color: #e94e4e !important;
}
</style>
