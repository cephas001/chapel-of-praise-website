<template>
  <div class="relative flex min-h-screen flex-col overflow-x-clip">
    <AppNavbar />

    <main class="grow">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup></script>
