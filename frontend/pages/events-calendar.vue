<template>
    <div class="bg-white text-black w-full font-sans">
        <section class="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-black text-white">
            <div class="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
            <img src="~/assets/images/celebrations.webp" alt="Events Hero" class="absolute inset-0 w-full h-full object-cover z-0 opacity-40 grayscale" />
            <div class="relative z-20 text-center px-4 mt-16">
                <p class="text-xs md:text-sm font-bold uppercase tracking-widest mb-3 text-[#e94e4e]">What's happening</p>
                <h1 class="text-5xl sm:text-6xl md:text-7xl font-impact uppercase leading-none text-white drop-shadow-lg">
                    Events Calendar
                </h1>
            </div>
        </section>

        <main class="max-w-5xl mx-auto px-4 md:px-8 py-20 md:py-28">
            <div class="space-y-6">
                
                <!-- Event Item -->
                <div class="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 hover:shadow-md transition-shadow">
                    <!-- Date Block -->
                    <div class="shrink-0 text-center bg-white border border-gray-200 rounded-xl px-6 py-4 w-28">
                        <p class="text-sm font-bold uppercase text-[#e94e4e] mb-1">SEP</p>
                        <p class="text-4xl font-impact text-black">15</p>
                    </div>
                    <!-- Details Block -->
                    <div class="flex-1">
                        <h3 class="text-2xl font-impact uppercase text-black mb-2">Midweek Communion Service</h3>
                        <p class="text-gray-600 font-light mb-3">Join us for a powerful evening of the Word, prayer, and breaking of bread together as a family.</p>
                        <div class="flex items-center gap-4 text-xs font-bold uppercase text-gray-500 tracking-wider">
                            <span><Icon name="heroicons:clock" class="w-4 h-4 inline mr-1 -mt-1" /> 6:00 PM</span>
                            <span><Icon name="heroicons:map-pin" class="w-4 h-4 inline mr-1 -mt-1" /> Main Auditorium</span>
                        </div>
                    </div>
                </div>

                <!-- Event Item -->
                <div class="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 hover:shadow-md transition-shadow">
                    <div class="shrink-0 text-center bg-white border border-gray-200 rounded-xl px-6 py-4 w-28">
                        <p class="text-sm font-bold uppercase text-[#e94e4e] mb-1">SEP</p>
                        <p class="text-4xl font-impact text-black">22</p>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-2xl font-impact uppercase text-black mb-2">Campus Worship Night</h3>
                        <p class="text-gray-600 font-light mb-3">An intense night of worship, prophecies, and spiritual songs flowing freely in the Spirit.</p>
                        <div class="flex items-center gap-4 text-xs font-bold uppercase text-gray-500 tracking-wider">
                            <span><Icon name="heroicons:clock" class="w-4 h-4 inline mr-1 -mt-1" /> 5:00 PM</span>
                            <span><Icon name="heroicons:map-pin" class="w-4 h-4 inline mr-1 -mt-1" /> Campus Chapel</span>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>
</template>

<script setup>
useHead({ title: 'Events Calendar | Chapel of Praise' })
</script>