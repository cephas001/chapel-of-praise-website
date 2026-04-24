<template>
    <div class="bg-white text-black w-full font-sans">
        <section class="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-black text-white">
            <div class="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
            <img src="~/assets/images/chapel.webp" alt="Ministries Hero" class="absolute inset-0 w-full h-full object-cover z-0 opacity-40 grayscale" />
            <div class="relative z-20 text-center px-4 mt-16">
                <p class="text-xs md:text-sm font-bold uppercase tracking-widest mb-3 text-[#e94e4e]">Get Involved</p>
                <h1 class="text-5xl sm:text-6xl md:text-7xl font-impact uppercase leading-none text-white drop-shadow-lg">
                    Ministries
                </h1>
            </div>
        </section>

        <main class="w-full bg-[#f3f4f7] py-20 md:py-32">
            <div class="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                <!-- Ministry Row -->
                <div class="bg-white p-8 md:p-12 border border-gray-100 rounded-2xl flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
                    <div class="w-full md:w-1/3">
                        <h3 class="text-3xl font-impact uppercase text-black mb-2">Music Ministry</h3>
                        <p class="text-[#e25858] text-sm uppercase font-bold tracking-widest">The Praise Chorale</p>
                    </div>
                    <div class="w-full md:w-2/3">
                        <p class="text-gray-600 font-light leading-relaxed">
                            Leading the congregation in transformative worship and spiritual songs. If you have a gift for singing or playing instruments, join us in creating an atmosphere of untainted scriptural truth flowing with the Spirit.
                        </p>
                    </div>
                </div>

                <!-- Ministry Row -->
                <div class="bg-white p-8 md:p-12 border border-gray-100 rounded-2xl flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
                    <div class="w-full md:w-1/3">
                        <h3 class="text-3xl font-impact uppercase text-black mb-2">Youth & Campus</h3>
                        <p class="text-[#e25858] text-sm uppercase font-bold tracking-widest">Next Gen</p>
                    </div>
                    <div class="w-full md:w-2/3">
                        <p class="text-gray-600 font-light leading-relaxed">
                            Equipping young believers and university students for leadership, purpose, and societal impact. We build a vibrant family of young believers passionate about God's Word.
                        </p>
                    </div>
                </div>

                <!-- Ministry Row -->
                <div class="bg-white p-8 md:p-12 border border-gray-100 rounded-2xl flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
                    <div class="w-full md:w-1/3">
                        <h3 class="text-3xl font-impact uppercase text-black mb-2">Media & Tech</h3>
                        <p class="text-[#e25858] text-sm uppercase font-bold tracking-widest">Creative Team</p>
                    </div>
                    <div class="w-full md:w-2/3">
                        <p class="text-gray-600 font-light leading-relaxed">
                            Shining the gospel light globally through photography, videography, live streaming, and sound engineering. Perfect for creatives wanting to serve behind the scenes.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
useHead({ title: 'Ministries | Chapel of Praise' })
</script>