<template>
    <LoadingScreen :isLoading="pending" />
    <div class="bg-white text-black w-full font-sans">
        <!-- Static Hero Banner -->
        <section class="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-black text-white">
            <div class="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
            <img src="~/assets/images/about.webp" alt="Counseling Hero" class="absolute inset-0 w-full h-full object-cover z-0 opacity-40 grayscale" />
            <div class="relative z-20 text-center px-4 mt-16">
                <p class="text-xs md:text-sm font-bold uppercase tracking-widest mb-3 text-[#e94e4e]">Guidance & Support</p>
                <h1 class="text-5xl sm:text-6xl md:text-7xl font-impact uppercase leading-none text-white drop-shadow-lg">
                    >{{ page?.heroHeadline || 'Counseling' }}</h1>
            </div>
        </section>

        <!-- Main Content Form Container -->
        <main class="max-w-3xl mx-auto px-4 md:px-8 py-20 md:py-28">
            <div class="text-center mb-12">
                <Icon name="heroicons:users" class="w-12 h-12 mx-auto text-[#e94e4e] mb-6" />
                <h2 class="text-3xl md:text-4xl font-impact uppercase mb-4 leading-none text-black">A Safe Place To Talk</h2>
                <p class="text-base md:text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                    Life can be challenging, but you don't have to navigate it alone. Our pastoral care and counseling team is here to provide biblical guidance, emotional support, and a listening ear in a completely confidential environment.
                </p>
            </div>

            <div class="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-10 lg:p-12 text-left">
                <form class="space-y-8" @submit.prevent>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-8">
                        <div class="space-y-2">
                            <label for="firstName" class="block text-xs font-bold uppercase tracking-wider text-black/70">First Name <span class="text-[#e94e4e]">*</span></label>
                            <input type="text" id="firstName" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all" required />
                        </div>
                        <div class="space-y-2">
                            <label for="lastName" class="block text-xs font-bold uppercase tracking-wider text-black/70">Last Name <span class="text-[#e94e4e]">*</span></label>
                            <input type="text" id="lastName" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all" required />
                        </div>
                        <div class="space-y-2">
                            <label for="email" class="block text-xs font-bold uppercase tracking-wider text-black/70">Email Address <span class="text-[#e94e4e]">*</span></label>
                            <input type="email" id="email" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all" required />
                        </div>
                        <div class="space-y-2">
                            <label for="phone" class="block text-xs font-bold uppercase tracking-wider text-black/70">Phone Number <span class="text-[#e94e4e]">*</span></label>
                            <input type="tel" id="phone" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all" placeholder="+234 XXX XXX XXXX" required />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label for="contactMethod" class="block text-xs font-bold uppercase tracking-wider text-black/70">Preferred Contact Method</label>
                            <select id="contactMethod" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all appearance-none">
                                <option value="" disabled selected>Select an option</option>
                                <option value="phone">Phone Call</option>
                                <option value="email">Email</option>
                                <option value="text">Text Message</option>
                            </select>
                        </div>

                        <div class="space-y-2">
                            <label for="counselingArea" class="block text-xs font-bold uppercase tracking-wider text-black/70">Area of >{{ page?.heroHeadline || 'Counseling' }}</label>
                            <select id="counselingArea" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all appearance-none">
                                <option value="" disabled selected>Select an area</option>
                                <option value="marriage">Marriage / Relationship</option>
                                <option value="premarital">Pre-Marital Course</option>
                                <option value="spiritual">Spiritual Growth</option>
                                <option value="grief">Grief & Loss</option>
                                <option value="addiction">Habits & Addiction</option>
                                <option value="general">General Guidance</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label for="details" class="block text-xs font-bold uppercase tracking-wider text-black/70">Additional Information <span class="text-gray-400 font-normal lowercase tracking-normal">(Optional)</span></label>
                        <textarea id="details" rows="5" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all resize-y" placeholder="Briefly describe what you would like to discuss (this is strictly confidential)"></textarea>
                    </div>

                    <div class="pt-6">
                        <button type="submit" class="bg-black hover:bg-[#e94e4e] text-white font-bold py-4 px-10 rounded-full transition-colors uppercase tracking-wider text-sm w-full">
                            Request Counseling Session
                        </button>
                        <p class="text-center text-xs text-gray-500 mt-4 leading-relaxed">
                            Your privacy is extremely important to us. Information submitted here is securely routed directly to our certified pastoral care team only.
                        </p>
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
const { data: pageData, pending } = useFetch(`${config.public.apiBaseUrl}/public/counseling`);
const page = computed(() => pageData.value?.data || {});

useHead({
  title: 'Counseling | Chapel of Praise'
})
</script>