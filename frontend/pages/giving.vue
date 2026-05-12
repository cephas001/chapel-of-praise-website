<template>
    <div class="bg-white text-black w-full font-sans">
        <!-- Static Hero Banner -->
        <section class="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-black text-white">
            <div class="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
            <img src="~/assets/images/celebrations.webp" alt="Giving Hero" class="absolute inset-0 w-full h-full object-cover z-0 opacity-40 grayscale" />
            <div class="relative z-20 text-center px-4 mt-16">
                <p class="text-xs md:text-sm font-bold uppercase tracking-widest mb-3 text-[#e94e4e]">Partner with us</p>
                <h1 class="text-5xl sm:text-6xl md:text-7xl font-impact uppercase leading-none text-white drop-shadow-lg">
                    >{{ page?.heroHeadline || 'Giving' }}</h1>
            </div>
        </section>

        <!-- Main Content -->
        <main class="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
            <h2 class="text-3xl md:text-4xl font-impact uppercase mb-6 text-black">Worship Through >{{ page?.heroHeadline || 'Giving' }}</h2>
            <p class="text-base md:text-lg text-gray-600 font-light leading-relaxed mb-12">
                Your generosity helps us continue our mission to shine the gospel light globally and raise the next generation of champions. Thank you for partnering with Chapel of Praise.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <!-- Direct Transfer Card -->
                <div class="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                    <Icon name="heroicons:building-library" class="w-10 h-10 text-[#e94e4e] mb-4" />
                    <h3 class="text-2xl font-impact uppercase text-black mb-4">Bank Transfer</h3>
                    <div class="space-y-4 text-gray-700 font-light">
                        <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Bank Name</p>
                            <p class="text-lg font-medium text-black">Guaranty Trust Bank (GTB)</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Account Name</p>
                            <p class="text-lg font-medium text-black">Chapel of Praise</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Account Number</p>
                            <p class="text-2xl font-medium tracking-widest text-[#e25858]">0123456789</p>
                        </div>
                    </div>
                </div>

                <!-- Online Payment Card -->
                <div class="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 flex flex-col justify-between">
                    <div>
                        <Icon name="heroicons:credit-card" class="w-10 h-10 text-[#e94e4e] mb-4" />
                        <h3 class="text-2xl font-impact uppercase text-black mb-4">Give Online</h3>
                        <p class="text-gray-600 font-light mb-8">
                            Make a secure online donation via our payment gateway using your debit or credit card.
                        </p>
                    </div>
                    <button class="w-full bg-black hover:bg-[#e94e4e] text-white font-bold py-4 rounded-xl transition-colors uppercase tracking-wider text-sm">
                        Give Now
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { useRuntimeConfig, useFetch } from '#app';
const config = useRuntimeConfig();
const { data: pageData } = await useFetch(`${config.public.apiBaseUrl}/public/giving`);
const page = pageData.value?.data || {};

useHead({ title: 'Giving | Chapel of Praise' })
</script>