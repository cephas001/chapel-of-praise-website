<template>
  <div class="relative min-h-screen flex flex-col overflow-x-clip">
    <div class="sticky top-0 z-60 w-full flex flex-col">
      <AppNavbar />
    </div>

    <main class="grow">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup></script>
