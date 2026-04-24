<template>
	<footer class="w-full bg-[#991111] text-white pt-20 pb-12 px-4 md:px-12">
            <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                
                <div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Connect</h3>
                    <ul class="space-y-4 text-sm font-medium text-white/80">
                        <li><NuxtLink to="/" class="hover:text-white hover:translate-x-1 inline-block transition-transform">Become a worker</NuxtLink></li>
                        <li><NuxtLink to="/" class="hover:text-white hover:translate-x-1 inline-block transition-transform">Prayer Request</NuxtLink></li>
                        <li><NuxtLink to="/" class="hover:text-white hover:translate-x-1 inline-block transition-transform">Testimonies</NuxtLink></li>
                        <li><NuxtLink to="/" class="hover:text-white hover:translate-x-1 inline-block transition-transform">Online Community</NuxtLink></li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Ministries</h3>
                    <ul class="space-y-4 text-sm font-medium text-white/80">
                        <li><NuxtLink to="/" class="hover:text-white hover:translate-x-1 inline-block transition-transform">Champions Choir</NuxtLink></li>
                        <li><NuxtLink to="/" class="hover:text-white hover:translate-x-1 inline-block transition-transform">PK Tribe</NuxtLink></li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Resources</h3>
                    <ul class="space-y-4 text-sm font-medium text-white/80">
                        <li><NuxtLink to="/" class="hover:text-white hover:translate-x-1 inline-block transition-transform">Chapel Library</NuxtLink></li>
                        <li><NuxtLink to="/" class="hover:text-white hover:translate-x-1 inline-block transition-transform">Vineyard's Voice Blog</NuxtLink></li>
                        <li><NuxtLink to="/" class="hover:text-white hover:translate-x-1 inline-block transition-transform">Welfare Request</NuxtLink></li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Media</h3>
                    <ul class="space-y-4 text-sm font-medium text-white/80">
                        <li><NuxtLink to="https://www.youtube.com/@mcucop" class="hover:text-white hover:translate-x-1 inline-block transition-transform">Watch Online</NuxtLink></li>
                        <li><NuxtLink to="/" class="hover:text-white hover:translate-x-1 inline-block transition-transform">Sermons</NuxtLink></li>
                    </ul>
                </div>
            </div>

            <div class="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center border-t border-white/10 pt-10 gap-8">
                
                

                <div class="text-[10px] uppercase tracking-widest text-white/40 text-center font-bold">
                    &copy; 2026 Chapel Of Praise. All Rights Reserved.
                </div>

                <div class="flex gap-6 text-white/60">
                    <NuxtLink to="/" class="hover:text-white hover:-translate-y-1 transition-all">
                        <Icon name="mdi:instagram" class="w-6 h-6" />
                    </NuxtLink>
                    <NuxtLink to="/" class="hover:text-white hover:-translate-y-1 transition-all">
                        <Icon name="mdi:twitter" class="w-6 h-6" />
                    </NuxtLink>
                    <NuxtLink to="https://www.youtube.com/@mcucop" class="hover:text-white hover:-translate-y-1 transition-all">
                        <Icon name="mdi:youtube" class="w-6 h-6" />
                    </NuxtLink>
                    <NuxtLink to="/" class="hover:text-white hover:-translate-y-1 transition-all">
                        <Icon name="mdi:linkedin" class="w-6 h-6" />
                    </NuxtLink>
                </div>
            </div>
        </footer>
</template>

<script setup></script>
