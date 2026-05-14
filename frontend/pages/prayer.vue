<template>
    <LoadingScreen :isLoading="pending" />
    <div class="bg-white text-black w-full font-sans">
        <!-- Static Hero Banner -->
        <section class="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-black text-white">
            <div class="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
            <img src="~/assets/images/celebrations.webp" alt="Prayer Request Hero" class="absolute inset-0 w-full h-full object-cover z-0 opacity-40 grayscale" />
            <div class="relative z-20 text-center px-4 mt-16">
                <p class="text-xs md:text-sm font-bold uppercase tracking-widest mb-3 text-[#e94e4e]">Stand With Us</p>
                <h1 class="text-5xl sm:text-6xl md:text-7xl font-impact uppercase leading-none text-white drop-shadow-lg">
                    >{{ page?.heroHeadline || 'Prayer Request' }}</h1>
            </div>
        </section>

        <!-- Main Content Form Container -->
        <main class="max-w-3xl mx-auto px-4 md:px-8 py-20 md:py-28">
            <div class="text-center mb-12">
                <Icon name="heroicons:sparkles" class="w-12 h-12 mx-auto text-[#e94e4e] mb-6" />
                <h2 class="text-3xl md:text-4xl font-impact uppercase mb-4 leading-none text-black">We Want To Pray With You</h2>
                <p class="text-base md:text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                    No matter what you're facing, you don't have to carry it alone. Our prayer team considers it an honor to stand with you in faith and believe God for a breakthrough in your life.
                </p>
            </div>

            <div class="bg-white border text-left border-gray-200 shadow-sm rounded-2xl p-6 md:p-10 lg:p-12">
                <form class="space-y-8" @submit.prevent>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label for="fullName" class="block text-xs font-bold uppercase tracking-wider text-black/70">Full Name <span class="text-[#e94e4e]">*</span></label>
                            <input type="text" id="fullName" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all" placeholder="Enter your name" required />
                        </div>
                        <div class="space-y-2">
                            <label for="email" class="block text-xs font-bold uppercase tracking-wider text-black/70">Email Address <span class="text-gray-400 font-normal lowercase tracking-normal">(Optional)</span></label>
                            <input type="email" id="email" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all" placeholder="For follow-up" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label for="prayerRequest" class="block text-xs font-bold uppercase tracking-wider text-black/70">Your >{{ page?.heroHeadline || 'Prayer Request' }}<span class="text-[#e94e4e]">*</span></label>
                        <textarea id="prayerRequest" rows="6" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all resize-y" placeholder="Please share how we can pray for you..." required></textarea>
                    </div>

                    <!-- Privacy Consent Checkbox -->
                    <div class="flex items-start gap-4">
                        <div class="flex items-center h-6">
                            <input id="privacy" type="checkbox" class="w-5 h-5 text-black border-gray-300 rounded focus:ring-black focus:ring-2 accent-black" required>
                        </div>
                        <div class="text-sm">
                            <label for="privacy" class="font-medium text-gray-700">Keep this request confidential</label>
                            <p class="text-gray-500 font-light mt-1">If checked, this request will only be seen by our pastoral staff and will not be shared openly with the general prayer team.</p>
                        </div>
                    </div>

                    <div class="pt-4">
                        <button type="submit" class="bg-black hover:bg-[#e94e4e] text-white font-bold py-4 px-10 rounded-full transition-colors uppercase tracking-wider text-sm w-full">
                            Submit >{{ page?.heroHeadline || 'Prayer Request' }}</button>
                    </div>
                </form>
            </div>
        </main>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRuntimeConfig, useFetch } from '#app';
const config = useRuntimeConfig();
const { data: pageData, pending } = useFetch(`${config.public.apiBaseUrl}/public/prayer`);
const page = computed(() => pageData.value?.data || {});

useHead({
  title: 'Prayer Request | Chapel of Praise'
})
</script>