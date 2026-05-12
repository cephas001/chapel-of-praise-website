<template>
    <div class="bg-white text-black w-full font-sans">
        <!-- Static Hero Banner -->
        <section class="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-black text-white">
            <div class="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
            <img src="~/assets/images/pastor.webp" alt="Leadership Hero" class="absolute inset-0 w-full h-full object-cover z-0 opacity-40 grayscale" />
            <div class="relative z-20 text-center px-4 mt-16">
                <p class="text-xs md:text-sm font-bold uppercase tracking-widest mb-3 text-[#e94e4e]">Our Pastors & Leaders</p>
                <h1 class="text-5xl sm:text-6xl md:text-7xl font-impact uppercase leading-none text-white drop-shadow-lg">
                    >{{ page?.heroHeadline || 'Leadership' }}</h1>
            </div>
        </section>

        <!-- Main Content Container -->
        <main class="w-full bg-[#f3f4f7] py-20 md:py-32">
            <div class="max-w-7xl mx-auto px-4 md:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-impact uppercase tracking-tight text-gray-900 mb-4">Meet The Team</h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto font-light">Dedicated men and women committed to shepherding the flock and advancing the kingdom of God.</p>
                </div>

                <div class="space-y-20">
                    <section>
                        <div class="mb-10 text-center md:text-left">
                            <h3 class="text-3xl md:text-4xl font-impact uppercase text-black">Chaplaincy</h3>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                                <img src="~/assets/images/pastor.webp" alt="Rev. Ibiwunmi Alo" class="w-40 h-40 rounded-full object-cover mb-6 shadow-md" />
                                <h3 class="text-2xl font-impact uppercase text-black mb-1">Rev. Ibiwunmi Alo</h3>
                                <p class="text-[#e25858] font-medium text-sm uppercase tracking-wider mb-4">Senior Pastor</p>
                                <p class="text-gray-600 font-light text-sm leading-relaxed">Guiding the spiritual vision and teaching profound scriptural truths to the congregation.</p>
                            </div>

                            <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                                <img src="~/assets/images/connect.webp" alt="Apostle Iren" class="w-40 h-40 rounded-full object-cover mb-6 shadow-md" />
                                <h3 class="text-2xl font-impact uppercase text-black mb-1">Apostle Iren</h3>
                                <p class="text-[#e25858] font-medium text-sm uppercase tracking-wider mb-4">Apostolic Leader</p>
                                <p class="text-gray-600 font-light text-sm leading-relaxed">Expanding the gospel light globally and equipping believers for societal impact.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div class="mb-10 text-center md:text-left">
                            <h3 class="text-3xl md:text-4xl font-impact uppercase text-black">Students Executives</h3>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                                <img src="~/assets/images/connect.webp" alt="Student Executive President" class="w-40 h-40 rounded-full object-cover mb-6 shadow-md" />
                                <h3 class="text-2xl font-impact uppercase text-black mb-1">Name Here</h3>
                                <p class="text-[#e25858] font-medium text-sm uppercase tracking-wider mb-4">President</p>
                                <p class="text-gray-600 font-light text-sm leading-relaxed">Provides direction for student-led initiatives and community development.</p>
                            </div>

                            <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                                <img src="~/assets/images/connect.webp" alt="Student Executive Vice President" class="w-40 h-40 rounded-full object-cover mb-6 shadow-md" />
                                <h3 class="text-2xl font-impact uppercase text-black mb-1">Name Here</h3>
                                <p class="text-[#e25858] font-medium text-sm uppercase tracking-wider mb-4">Vice President</p>
                                <p class="text-gray-600 font-light text-sm leading-relaxed">Supports coordination across student teams and ministry operations.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { useRuntimeConfig, useFetch } from '#app';
const config = useRuntimeConfig();
const { data: pageData } = await useFetch(`${config.public.apiBaseUrl}/public/leadership`);
const page = pageData.value?.data || {};

useHead({ title: 'Leadership | Chapel of Praise' })
</script>