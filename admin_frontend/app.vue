<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>

  <LazyConfirmModal />
  <LazyForbiddenModal />
  <LazyAlertModal />
  <ToastContainer />
  <PwaInstallPrompt />
</template>
