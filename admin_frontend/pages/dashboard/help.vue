<template>
  <div class="mx-auto max-w-5xl">
    <AppHeading
      class="mb-8 mt-4"
      title="How to use this app"
      subtitle="A guide for every team member."
    />

    <div class="space-y-6">
      <!-- Start here -->
      <AppCard id="start-here" class="scroll-mt-24">
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-line bg-subtle"
            >
              <Icon name="heroicons:rocket-launch" class="h-4 w-4 text-ink" />
            </div>
            <AppHeading level="2" title="Start here" />
          </div>
        </template>

        <p class="text-xs md:text-sm leading-relaxed text-ink text-justify">
          This is the team's workspace for Chapel of Praise. From here you plan
          services, follow up with people who respond to altar calls, and keep
          the church website up to date.
        </p>

        <div class="mt-5 rounded-control border border-line bg-subtle/60 p-4">
          <h3
            class="flex items-center gap-2 text-xs md:text-sm font-semibold text-ink"
          >
            <Icon name="heroicons:identification" class="h-4 w-4 text-muted" />
            Your access level
          </h3>
          <p class="mt-2 text-xs md:text-sm leading-relaxed text-ink">
            You're signed in as
            <span class="font-medium">{{
              auth.user?.email || "your account"
            }}</span
            >.
            {{ accessDescription }}
          </p>
        </div>

        <div class="mt-6 space-y-5">
          <div>
            <h3 class="text-xs md:text-sm font-semibold text-ink">
              Signing in
            </h3>
            <p
              class="mt-1 text-xs md:text-sm leading-relaxed text-muted text-justify"
            >
              Use the email and password a Super Admin set up for you. If you
              forget it, tap <span class="italic">Forgot password?</span> and a
              reset link goes to your email.
            </p>
          </div>

          <div>
            <h3 class="text-xs md:text-sm font-semibold text-ink">
              Put it on your phone
            </h3>
            <p
              class="mt-1 text-xs md:text-sm leading-relaxed text-muted text-justify"
            >
              The app installs like a normal app and works the same as in the
              browser.
            </p>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-control border border-line bg-subtle/60 p-4">
                <h4
                  class="flex items-center gap-2 text-xs md:text-sm font-semibold text-ink"
                >
                  <Icon
                    name="simple-icons:android"
                    class="h-4 w-4 text-muted"
                  />
                  Android (Chrome)
                </h4>
                <p
                  class="mt-1.5 text-xs leading-relaxed text-muted text-justify"
                >
                  Open the site in Chrome, tap the ⋮ menu, then Add to Home
                  screen.
                </p>
              </div>
              <div class="rounded-control border border-line bg-subtle/60 p-4">
                <h4
                  class="flex items-center gap-2 text-xs md:text-sm font-semibold text-ink"
                >
                  <Icon name="simple-icons:apple" class="h-4 w-4 text-muted" />
                  iPhone (Safari)
                </h4>
                <p
                  class="mt-1.5 text-xs leading-relaxed text-muted text-justify"
                >
                  Open the site in Safari, tap the Share button, then Add to
                  Home Screen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppCard>

      <!-- A service day -->
      <AppCard v-if="canManageOperations" id="service-day" class="scroll-mt-24">
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-line bg-subtle"
            >
              <Icon name="heroicons:calendar-days" class="h-4 w-4 text-ink" />
            </div>
            <AppHeading level="2" title="A service day" />
          </div>
        </template>

        <p class="text-xs md:text-sm leading-relaxed text-ink text-justify">
          Most service days follow the same five steps. You will be playing
          specific roles in the process.
        </p>

        <ol
          class="relative mt-6 space-y-5 before:absolute before:bottom-2 before:left-3 before:top-2 before:w-px before:-translate-x-1/2 before:bg-line"
        >
          <li
            v-for="(step, index) in serviceSteps"
            :key="step.title"
            class="flex gap-4"
          >
            <span
              class="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line bg-subtle text-xs font-semibold text-ink"
            >
              {{ index + 1 }}
            </span>
            <div class="min-w-0">
              <h3 class="text-sm font-semibold text-ink">{{ step.title }}</h3>
              <p
                class="mt-1 text-xs md:text-sm leading-relaxed text-muted text-justify"
              >
                {{ step.text }}
              </p>
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <span class="text-xs font-medium text-muted">Responsible</span>
                <span
                  class="inline-flex items-center rounded-badge border border-line bg-subtle px-2.5 py-0.5 font-mono text-xs font-medium text-ink"
                >
                  {{ step.responsible }}
                </span>
              </div>
            </div>
          </li>
        </ol>

        <div class="mt-6 flex flex-wrap justify-end">
          <AppButton to="/events" variant="secondary" size="xs">
            Open events
          </AppButton>
        </div>
      </AppCard>

      <!-- Your chapel unit -->
      <AppCard v-if="canManageOperations" id="your-unit" class="scroll-mt-24">
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-line bg-subtle"
            >
              <Icon name="heroicons:user-group" class="h-4 w-4 text-ink" />
            </div>
            <AppHeading level="2" title="Your chapel unit" />
          </div>
        </template>

        <p class="text-xs md:text-sm leading-relaxed text-ink text-justify">
          Your unit meetings run separately from events, and they get their own
          attendance records.
        </p>

        <div class="mt-5 space-y-4">
          <div>
            <h3 class="text-xs md:text-sm font-semibold text-ink">
              Taking meeting attendance
            </h3>
            <p
              class="mt-2 text-xs md:text-sm leading-relaxed text-muted text-justify"
            >
              Open
              <span class="italic">Unit meeting attendance,</span> choose your
              unit and the date. Mark each worker
              <span class="italic">Present</span> or
              <span class="italic">Pardoned</span>.
            </p>
          </div>

          <div class="mt-5">
            <h3 class="text-xs md:text-sm font-semibold text-ink">
              What the marks mean
            </h3>
            <dl class="mt-2 divide-y divide-line">
              <div
                v-for="row in unitMarks"
                :key="row.term"
                class="grid gap-1 py-2.5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
              >
                <dt class="text-xs md:text-sm font-semibold text-ink">
                  {{ row.term }}
                </dt>
                <dd class="text-xs md:text-sm leading-relaxed text-muted">
                  {{ row.meaning }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap justify-end">
          <AppButton to="/unit-meetings" variant="secondary" size="xs">
            Open unit meetings
          </AppButton>
        </div>
      </AppCard>

      <!-- The church website -->
      <AppCard v-if="canManageWebsite" id="website" class="scroll-mt-24">
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-line bg-subtle"
            >
              <Icon name="heroicons:globe-alt" class="h-4 w-4 text-ink" />
            </div>
            <AppHeading level="2" title="The church website" />
          </div>
        </template>

        <p class="text-xs md:text-sm leading-relaxed text-ink text-justify">
          The <span class="italic">Media Unit</span> is responsible for managing
          the chapel's public website. They edit the content from here.
        </p>

        <div class="mt-5 space-y-4">
          <div>
            <h3 class="text-xs md:text-sm font-semibold text-ink">
              How saving works
            </h3>
            <p
              class="mt-1.5 text-xs md:text-sm leading-relaxed text-muted text-justify"
            >
              Change what you need, then press
              <span class="italic">Save Changes</span> in the bar at the bottom
              of the page.
            </p>
          </div>

          <div>
            <h3 class="text-xs md:text-sm font-semibold text-ink">Images</h3>
            <p class="mt-1.5 text-xs md:text-sm leading-relaxed text-muted">
              Upload web images in the shared library for pictures across the
              whole site.
            </p>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap justify-end">
          <AppButton to="/website/homepage" variant="secondary" size="xs">
            Open the homepage editor
          </AppButton>
        </div>
      </AppCard>

      <!-- Numbers & reports -->
      <AppCard v-if="canManageOperations" id="reports" class="scroll-mt-24">
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-line bg-subtle"
            >
              <Icon name="heroicons:chart-bar" class="h-4 w-4 text-ink" />
            </div>
            <AppHeading level="2" title="Numbers & reports" />
          </div>
        </template>

        <p class="text-xs md:text-sm leading-relaxed text-ink text-justify">
          There are two places to see how the chapel is doing, both fed by the
          records you keep day to day.
        </p>

        <dl class="mt-4 divide-y divide-line">
          <div
            v-for="row in reportViews"
            :key="row.term"
            class="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
          >
            <dt class="text-xs md:text-sm font-semibold text-ink">
              {{ row.term }}
            </dt>
            <dd class="text-xs md:text-sm leading-relaxed text-muted">
              {{ row.meaning }}
            </dd>
          </div>
        </dl>

        <div class="mt-4 flex flex-wrap justify-end">
          <AppButton to="/analytics/summaries" variant="secondary" size="xs">
            Open data summaries
          </AppButton>
        </div>
      </AppCard>

      <!-- Leading the team -->
      <AppCard v-if="isSuperAdmin" id="leading" class="scroll-mt-24">
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-line bg-subtle"
            >
              <Icon name="heroicons:shield-check" class="h-4 w-4 text-ink" />
            </div>
            <AppHeading level="2" title="Leading the team" />
          </div>
        </template>

        <p class="text-xs md:text-sm leading-relaxed text-ink text-justify">
          This section is relevant to only Super Admins, who comprise members of
          the secretariat.
        </p>

        <div class="mt-6 space-y-4">
          <div>
            <h3 class="text-xs md:text-sm font-semibold text-ink">
              How to regiser a new team member
            </h3>
            <p
              class="mt-1.5 text-xs md:text-sm leading-relaxed text-muted text-justify"
            >
              Open Users and choose Register new user. Set the person's access
              level.
            </p>
          </div>

          <div class="mt-7">
            <h3 class="text-xs md:text-sm font-semibold text-ink">
              What each access level includes
            </h3>
            <dl class="mt-2 divide-y divide-line">
              <div
                v-for="row in accessLevels"
                :key="row.term"
                class="grid gap-1 py-2.5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
              >
                <dt class="text-xs md:text-sm font-semibold text-ink">
                  {{ row.term }}
                </dt>
                <dd class="text-xs md:text-sm leading-relaxed text-muted">
                  {{ row.meaning }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap justify-end">
          <AppButton to="/users" variant="secondary" size="xs">
            Open user management
          </AppButton>
        </div>
      </AppCard>

      <!-- If something's wrong -->
      <AppCard id="troubleshooting" class="scroll-mt-24">
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-line bg-subtle"
            >
              <Icon
                name="heroicons:wrench-screwdriver"
                class="h-4 w-4 text-ink"
              />
            </div>
            <AppHeading level="2" title="If something's wrong" />
          </div>
        </template>

        <div class="divide-y divide-line">
          <div
            v-for="item in troubleshooting"
            :key="item.question"
            class="py-4 first:pt-0 last:pb-0"
          >
            <h3 class="text-xs md:text-sm font-semibold text-ink">
              {{ item.question }}
            </h3>
            <p
              class="mt-1 text-xs md:text-sm leading-relaxed text-muted text-justify"
            >
              {{ item.answer }}
            </p>
          </div>
        </div>
      </AppCard>

      <!-- Still stuck? -->
      <AppCard id="contact" class="scroll-mt-24">
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-line bg-subtle"
            >
              <Icon
                name="heroicons:chat-bubble-left-right"
                class="h-4 w-4 text-ink"
              />
            </div>
            <AppHeading level="2" title="Still stuck?" />
          </div>
        </template>

        <p class="text-xs md:text-sm leading-relaxed text-ink text-justify">
          Bro. Peter, the chapel's Technical Lead, looks after this app. If this
          guide didn't answer your question, WhatsApp him. He'd rather you ask
          than guess.
        </p>

        <div class="mt-5 flex flex-wrap items-center gap-3">
          <AppButton :to="whatsappLink" icon="heroicons:chat-bubble-left-right">
            Message Bro. Peter
          </AppButton>
        </div>
      </AppCard>

      <!-- Words we use -->
      <AppCard id="glossary" class="scroll-mt-24">
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-line bg-subtle"
            >
              <Icon name="heroicons:book-open" class="h-4 w-4 text-ink" />
            </div>
            <AppHeading level="2" title="Words we use" />
          </div>
        </template>

        <dl class="divide-y divide-line">
          <div
            v-for="row in glossary"
            :key="row.term"
            class="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
          >
            <dt class="text-xs md:text-sm font-semibold text-ink">
              {{ row.term }}
            </dt>
            <dd class="text-xs md:text-sm leading-relaxed text-muted">
              {{ row.meaning }}
            </dd>
          </div>
        </dl>
      </AppCard>
    </div>

    <div
      ref="pageControls"
      class="fixed bottom-6 right-6 z-chrome flex flex-col items-center gap-2"
    >
      <Transition
        enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <nav
          v-if="isMenuOpen"
          id="help-section-menu"
          class="scrollbar-thin absolute bottom-full right-0 mb-2 max-h-[70vh] w-56 overflow-y-auto rounded-surface border border-line bg-surface p-2 shadow-overlay"
          aria-label="Page sections"
        >
          <p
            class="px-3 pb-1.5 pt-1 text-xs font-semibold text-black underline"
          >
            On this page
          </p>
          <a
            v-for="section in visibleSections"
            :key="section.id"
            :href="`#${section.id}`"
            class="block rounded-control px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-subtle hover:text-ink"
            @click="goToSection($event, section.id)"
          >
            {{ section.label }}
          </a>
        </nav>
      </Transition>

      <button
        ref="menuButton"
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-control border border-line bg-surface text-ink shadow-overlay transition-colors hover:border-ink hover:bg-subtle"
        aria-label="Open page sections"
        title="Page sections"
        :aria-controls="isMenuOpen ? 'help-section-menu' : undefined"
        :aria-expanded="isMenuOpen"
        @click="toggleMenu"
      >
        <Icon name="heroicons:list-bullet" class="h-5 w-5" />
      </button>

      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-control border border-line bg-surface text-ink shadow-overlay transition-colors hover:border-ink hover:bg-subtle"
        aria-label="Back to top"
        title="Back to top"
        @click="scrollToTop"
      >
        <Icon name="heroicons:arrow-up" class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();

// Mirrors middleware/auth.global.js and layouts/default.vue so the guide only
// shows the sections a person can actually use.
const isSuperAdmin = computed(() => auth.user?.role === "super_admin");
const canManageOperations = computed(
  () =>
    isSuperAdmin.value ||
    auth.user?.type === "all" ||
    auth.user?.type === "executive",
);
const canManageWebsite = computed(
  () =>
    isSuperAdmin.value ||
    auth.user?.type === "all" ||
    auth.user?.type === "website",
);

const accessDescription = computed(() => {
  if (isSuperAdmin.value) {
    return "This is the highest access level, so every part of the app is open to you.";
  }
  const operations = canManageOperations.value;
  const website = canManageWebsite.value;
  if (operations && website) {
    return "You can record services and events, and update the church website.";
  }
  if (operations) {
    return "You can record services and events, mark attendance, capture altar calls and follow up with people.";
  }
  if (website) {
    return "You can update the church website pages and the image library.";
  }
  return "Your account does not have an area assigned yet. Ask a Super Admin to set your access.";
});

const sections = computed(() => [
  { id: "start-here", label: "Start here", visible: true },
  {
    id: "service-day",
    label: "A service day",
    visible: canManageOperations.value,
  },
  {
    id: "your-unit",
    label: "Your chapel unit",
    visible: canManageOperations.value,
  },
  {
    id: "website",
    label: "The church website",
    visible: canManageWebsite.value,
  },
  {
    id: "reports",
    label: "Numbers & reports",
    visible: canManageOperations.value,
  },
  { id: "leading", label: "Leading the team", visible: isSuperAdmin.value },
  { id: "troubleshooting", label: "If something's wrong", visible: true },
  { id: "contact", label: "Still stuck?", visible: true },
  { id: "glossary", label: "Words we use", visible: true },
]);

const visibleSections = computed(() =>
  sections.value.filter((section) => section.visible),
);

const pageControls = ref(null);
const menuButton = ref(null);
const isMenuOpen = ref(false);

function closeMenu(restoreFocus = false) {
  isMenuOpen.value = false;
  if (restoreFocus) menuButton.value?.focus({ preventScroll: true });
}

function focusFirstSection() {
  nextTick(() => {
    document
      .getElementById("help-section-menu")
      ?.querySelector("a")
      ?.focus({ preventScroll: true });
  });
}

function toggleMenu(event) {
  isMenuOpen.value = !isMenuOpen.value;
  // Keyboard activation reports detail 0; only then move focus into the menu
  // so Tab order continues through the sections instead of the buttons below.
  if (isMenuOpen.value && event.detail === 0) focusFirstSection();
}

function scrollToTop() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
}

function goToSection(event, id) {
  const target = document.getElementById(id);
  if (!target) return;

  event.preventDefault();
  closeMenu();

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  target.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });

  history.replaceState(null, "", `#${id}`);

  if (event.detail === 0) {
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.removeAttribute("tabindex");
  }
}

function onPointerDown(event) {
  if (!isMenuOpen.value) return;
  if (!pageControls.value?.contains(event.target)) closeMenu();
}

function onKeydown(event) {
  if (event.key === "Escape" && isMenuOpen.value) closeMenu(true);
}

onMounted(() => {
  document.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onPointerDown);
  window.removeEventListener("keydown", onKeydown);
});

const serviceSteps = [
  {
    title: "Pick the service",
    text: "Open Events and select the day's service, or add a new one.",
    responsible: "General Secretary",
  },
  {
    title: "Record the attendance totals",
    text: "In Head count, enter the accurate numbers.",
    responsible: "Ushering Head",
  },
  {
    title: "Mark who served",
    text: "To mark who officiated in a service, open Unit Attendance. Mark each worker Present or Pardoned.",
    responsible: "All Unit Heads",
  },
  {
    title: "Record the altar calls",
    text: "Open the service and add each call and the number of responders. Then add their details.",
    responsible: "Evangelism Coord",
  },
  {
    title: "Follow up with them",
    text: "Follow-up records keeps every responders in one place. Set a status and leave a note after each call or message.",
    responsible: "All Unit Heads",
  },
];

const unitMarks = [
  {
    term: "Officiating",
    meaning: "On duty for that service or meeting.",
  },
  {
    term: "Present",
    meaning: "Attended the meeting.",
  },
  {
    term: "Pardoned",
    meaning: "Excused. The worker has your permission to be absent.",
  },
  {
    term: "Absent",
    meaning: "Counted automatically for anyone you don't mark.",
  },
];

const reportViews = [
  {
    term: "Data visualization",
    meaning: "Shows charts and trends.",
  },
  {
    term: "Data summaries",
    meaning: "Shows totals and snapshots.",
  },
];

const accessLevels = [
  {
    term: "Website",
    meaning: "The church website pages and the image library.",
  },
  {
    term: "Operations",
    meaning:
      "Services and events, attendance, altar calls, follow-ups and reports.",
  },
  {
    term: "All",
    meaning: "Both of the above.",
  },
  {
    term: "Super Admin",
    meaning:
      "Everything, including managing users and executives. Give it only to someone who truly needs full control.",
  },
];

const troubleshooting = [
  {
    question: "I was signed out on my own",
    answer:
      "Sign-ins expire after a while to keep chapel data safe. Sign in again with your email and password. Nothing you saved is lost.",
  },
  {
    question: "Access denied showed when I opened a page",
    answer:
      "That page belongs to another team's area and stays hidden until a Super Admin gives you that access level.",
  },
  {
    question: "I forgot my password",
    answer:
      "On the sign-in screen, tap Forgot password? and a reset link goes to your registered email. If it never arrives, ask a Super Admin to check the email on your account.",
  },
  {
    question: "I can't install the app",
    answer:
      "Installing works in Chrome on Android and Safari on iPhone, opened from the real site address. If the option doesn't appear, the app still works normally in the browser.",
  },
  {
    question: "Something was deleted by mistake",
    answer:
      "Deleting events, users and records is permanent. There is no recycle bin, so pause before confirming a delete. One more thing: deleting an event does not remove its attendance totals or altar call records; they stay on their own pages.",
  },
  {
    question: "The page won't load or looks wrong",
    answer:
      "Refresh once. If it keeps happening, note which page and tell Bro. Peter; his details are just below.",
  },
];

const glossary = [
  {
    term: "Event",
    meaning:
      "A service, meeting or program the chapel is running, such as a Sunday service, Bible study or workers retreat.",
  },
  {
    term: "Unit",
    meaning:
      "One of the chapel's serving teams, such as Choir, Ushering, Media or Protocol.",
  },
  {
    term: "Head count",
    meaning:
      "The day's attendance totals, split into students and visitors, male and female.",
  },
  {
    term: "Altar call",
    meaning:
      "The invitation during a service for people to respond. Each one is recorded by type, such as salvation, rededication, Holy Ghost baptism or healing.",
  },
  {
    term: "Responder",
    meaning: "Someone who answered an altar call.",
  },
  {
    term: "First timer",
    meaning: "Someone visiting Chapel of Praise for the first time.",
  },
  {
    term: "New convert",
    meaning: "Someone who gave their life to Christ at an altar call.",
  },
  {
    term: "Follow-up",
    meaning:
      "Checking in on a first-timer or new convert, usually with a call, a WhatsApp message or a note.",
  },
  {
    term: "Quick links",
    meaning:
      "The team's shared list of tools and useful links, managed by Super Admins.",
  },
  {
    term: "Super Admin",
    meaning:
      "The access level that can see and do everything, including managing users and executives.",
  },
];

const whatsappLink = "https://wa.me/2348112985079";
</script>
