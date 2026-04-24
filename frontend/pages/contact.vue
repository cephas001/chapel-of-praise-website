<template>
    <div class="bg-white text-black w-full font-sans">
        <!-- Static Hero Banner -->
        <section class="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-black text-white">
            <div class="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
            <img src="~/assets/images/connect.webp" alt="Contact Us Hero" class="absolute inset-0 w-full h-full object-cover z-0 opacity-40 grayscale" />
            <div class="relative z-20 text-center px-4 mt-16">
                <p class="text-xs md:text-sm font-bold uppercase tracking-widest mb-3 text-[#e94e4e]">Reach Out</p>
                <h1 class="text-5xl sm:text-6xl md:text-7xl font-impact uppercase leading-none text-white drop-shadow-lg">
                    Contact Us
                </h1>
            </div>
        </section>

        <!-- Main Content Container -->
        <main class="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                
                <!-- Left: Professional Contact Form -->
                <div>
                    <div class="mb-10">
                        <h2 class="text-3xl md:text-4xl font-impact uppercase mb-4 leading-none text-black">Send a Message</h2>
                        <p class="text-gray-600 text-base md:text-lg font-light leading-relaxed">
                            Have questions about our ministries, services, or events? Send us a message, and our team will get back to you as soon as possible.
                        </p>
                    </div>

                    <form class="space-y-6" @submit.prevent>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label for="firstName" class="block text-xs font-bold uppercase tracking-wider text-black/70">First Name</label>
                                <input type="text" id="firstName" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all" placeholder="John" required />
                            </div>
                            <div class="space-y-2">
                                <label for="lastName" class="block text-xs font-bold uppercase tracking-wider text-black/70">Last Name</label>
                                <input type="text" id="lastName" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all" placeholder="Doe" required />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label for="email" class="block text-xs font-bold uppercase tracking-wider text-black/70">Email Address</label>
                            <input type="email" id="email" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all" placeholder="john@example.com" required />
                        </div>

                        <div class="space-y-2">
                            <label for="message" class="block text-xs font-bold uppercase tracking-wider text-black/70">Message</label>
                            <textarea id="message" rows="5" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all resize-y" placeholder="How can we help you?" required></textarea>
                        </div>

                        <button type="submit" class="bg-black hover:bg-[#e94e4e] text-white font-bold py-4 px-10 rounded-full transition-colors uppercase tracking-wider text-sm w-full md:w-auto">
                            Send Message
                        </button>
                    </form>
                </div>

                <!-- Right: Information Grid -->
                <div class="flex flex-col justify-center">
                    <div class="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100">
                        <h3 class="text-2xl font-impact uppercase mb-8 text-black">Visit Us</h3>
                        
                        <div class="space-y-8">
                            <!-- Location -->
                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 shrink-0 bg-white rounded-full border border-gray-200 flex items-center justify-center text-black">
                                    <Icon name="heroicons:map-pin" class="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold uppercase tracking-widest mb-1 text-black">Main Campus</h4>
                                    <p class="text-gray-600 font-light leading-relaxed">
                                        123 Gospel Light Avenue,<br />
                                        Excellence District, Lagos, Nigeria
                                    </p>
                                </div>
                            </div>

                            <!-- Service Times -->
                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 shrink-0 bg-white rounded-full border border-gray-200 flex items-center justify-center text-black">
                                    <Icon name="heroicons:clock" class="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold uppercase tracking-widest mb-1 text-black">Service Times</h4>
                                    <p class="text-gray-600 font-light leading-relaxed">
                                        Sundays: 8:00 AM & 10:30 AM<br />
                                        Wednesdays (Mid-week): 6:00 PM
                                    </p>
                                </div>
                            </div>

                            <!-- Contact Info -->
                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 shrink-0 bg-white rounded-full border border-gray-200 flex items-center justify-center text-black">
                                    <Icon name="heroicons:envelope" class="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold uppercase tracking-widest mb-1 text-black">Contact Details</h4>
                                    <p class="text-gray-600 font-light leading-relaxed">
                                        Email: info@chapelofpraise.org<br />
                                        Phone: +234 123 456 7890
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Social Proof/Follow -->
                        <div class="mt-10 pt-8 border-t border-gray-200">
                            <h4 class="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">Follow Our Journey</h4>
                            <div class="flex gap-4">
                                <a href="#" class="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#e94e4e] hover:-translate-y-1 transition-all"><Icon name="mdi:instagram" class="w-5 h-5" /></a>
                                <a href="#" class="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#e94e4e] hover:-translate-y-1 transition-all"><Icon name="mdi:twitter" class="w-5 h-5" /></a>
                                <a href="#" class="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#e94e4e] hover:-translate-y-1 transition-all"><Icon name="mdi:youtube" class="w-5 h-5" /></a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>
</template>

<script setup>
useHead({
  title: 'Contact Us | Chapel of Praise'
})
</script>