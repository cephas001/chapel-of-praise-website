<template>
    <div class="bg-white text-black w-full font-sans">
        <section class="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black text-white">
            <div class="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>
            <img src="~/assets/images/chapel.webp" alt="Hero Background" class="absolute inset-0 w-full h-full object-cover z-0" />
            
            <div class="relative z-20 text-center px-4 max-w-6xl mx-auto flex flex-col items-center justify-center mt-20">
                <p class="text-xs md:text-sm font-bold uppercase tracking-widest mb-4 text-white/90">
                    Shining the Gospel light
                </p>
                <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-impact uppercase leading-none md:leading-[1.1] mb-8 text-white max-w-3xl mx-auto">
                    McPherson<br />
                    <span class="text-[#e94e4e]">University</span>
                    Chapel
                </h1>
                
                <div class="flex gap-4 mt-4">
                    <NuxtLink to="/" class="bg-white hover:bg-gray-200 text-black font-bold py-3 px-7 rounded-full transition-colors uppercase tracking-wider text-xs md:text-sm">
                        Watch Us
                    </NuxtLink>
                    <NuxtLink to="/" class="border-2 border-white/80 hover:bg-white hover:text-black text-white font-bold py-3 px-7 rounded-full transition-colors uppercase tracking-wider text-xs md:text-sm relative z-20">
                        About Us
                    </NuxtLink>
                </div>
            </div>
        </section>

        <div class="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-16">
            <section class="mb-10 md:mb-14 animate-fade-in-up text-center md:text-left flex flex-col items-center md:items-start">
                <div class="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black/60 mb-6">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#e94e4e]"></span>
                    Welcome to COP
                </div>

                <h1 class="text-4xl sm:text-5xl md:text-6xl font-impact uppercase text-black max-w-4xl leading-none">
                    {{ page?.heroHeadline || 'Welcome Home!' }}
                </h1>

                <p class="mt-4 text-base md:text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">
                    Dive into our teachings, events and community.<br class="hidden sm:block" />
                    Your journey of faith begins here.
                </p>
            </section>

            <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NuxtLink
                    v-for="(card, index) in cards"
                    :key="card.title"
                    :to="card.to"
                    class="group relative min-h-[22rem] md:min-h-[28rem] overflow-hidden card-reveal rounded-lg"
                    :style="{ animationDelay: `${index * 150}ms` }"
                >
                    <div
                        class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                        :style="cardBackground(card.image)"
                    ></div>

                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>

                    <div class="relative h-full flex flex-col justify-between p-6 text-white">
                        <div class="mb-2 transition-transform duration-500 transform group-hover:-translate-y-2">
                            <p class="text-[10px] uppercase tracking-widest font-semibold text-white/90">
                                {{ card.kicker }}
                            </p>
                            <h2 class="mt-2 text-3xl md:text-4xl font-black leading-none tracking-tight">
                                {{ card.title }}
                            </h2>
                        </div>

                        <span class="inline-flex items-center gap-2 uppercase tracking-wider text-xs font-bold text-white/95">
                            {{ card.cta }}
                            <Icon name="heroicons:arrow-long-right" class="w-5 h-5" />
                        </span>
                    </div>
                </NuxtLink>
            </section>
        </div>

        <section class="relative w-full py-32 flex items-center bg-black overflow-hidden">
            <img src="~/assets/images/celebrations.webp" alt="Building a People of Excellence and Integrity for Service" class="absolute inset-0 w-full h-full object-cover z-0 opacity-20 grayscale" />
            
            <div class="relative z-20 container mx-auto px-4 md:px-12 flex items-center h-full">
                <div class="max-w-3xl text-left">
                    <h2 class="text-4xl md:text-5xl lg:text-6xl font-impact uppercase mb-6 leading-none text-white">
                        Great <br /> Champions
                    </h2>
                    <p class="text-base md:text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed font-light">
                        We are a vibrant family of young believers, passionate about God's Word. We are committed to rising as the next generation of champions, who always shine the gospel light.
                    </p>
                    <NuxtLink to="/" class="bg-[#e94e4e] hover:bg-white hover:text-black text-white font-bold py-3 px-7 rounded-full transition-colors inline-block uppercase tracking-wider text-xs md:text-sm">
                        Learn More
                    </NuxtLink>
                </div>
            </div>
        </section>

        <div class="relative w-full bg-black text-white" id="editorial-sticky-container">
            <section 
                v-for="(section, index) in editorialSections" 
                :key="section.id"
                class="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden border-t border-white/10"
                :class="[
                    index === 0 ? 'bg-zinc-950 z-10' : '',
                    index === 1 ? 'bg-zinc-900 z-20' : '',
                    index === 2 ? 'bg-black z-30' : ''
                ]"
            >
                <div class="absolute inset-0 z-0 pointer-events-none opacity-60">
                    <img 
                        v-for="(img, imgIndex) in section.images" 
                        :key="imgIndex" 
                        :src="img" 
                        alt="Scattered Imagery" 
                        class="editorial-scattered-image absolute w-40 h-56 md:w-64 md:h-80 object-cover rounded-sm shadow-2xl transition-transform duration-100 ease-out"
                    />
                </div>

                <div class="relative z-10 text-center max-w-3xl px-4 pointer-events-none">
                    <p class="text-xs md:text-sm font-bold uppercase tracking-widest mb-4 text-[#e94e4e]">
                        {{ section.kicker }}
                    </p>
                    <h2 class="text-5xl sm:text-6xl md:text-7xl font-impact uppercase leading-none mb-6 drop-shadow-xl">
                        {{ section.title }}
                    </h2>
                    <p class="text-base md:text-lg lg:text-xl font-light text-white/90 drop-shadow-md">
                        {{ section.description }}
                    </p>
                </div>
            </section>
        </div>

        <section class="relative w-full bg-white text-black py-20 md:py-24 flex items-center relative z-40">
            <div class="container mx-auto px-4 md:px-12 max-w-6xl">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <div class="relative w-full aspect-[4/5] md:aspect-[3/4] flex justify-center overflow-hidden rounded-xl">
                        <img src="~/assets/images/pastor.webp" alt="Our Lead Pastor" class="w-full h-full object-cover grayscale contrast-125" />
                    </div>
                    <div class="text-left flex flex-col justify-center">
                        <div class="flex items-center gap-3 mb-6">
                            <Icon name="heroicons:globe-alt" class="w-6 h-6 text-[#e94e4e]" />
                            <span class="text-[10px] font-bold tracking-widest uppercase text-gray-500">Chapel Leadership</span>
                        </div>
                        <h2 class="text-3xl md:text-4xl lg:text-5xl font-impact uppercase mb-6 leading-none">
                            Our Lead Pastor
                        </h2>
                        <p class="text-gray-600 mb-8 leading-relaxed text-base md:text-lg font-light">
                            Reverend Ibiwunmi Alo is the lead pastor of Chapel of Praise, a dynamic teaching ministry dedicated to spreading the gospel and helping people discover their purpose in Christ. With a passion for the Word of God and a heart for missions, Apostle Iren has led the church to establish Over 30 campuses across Nigeria, North America, and the UK.
                        </p>
                        <div>
                            <NuxtLink to="/" class="border-2 border-black hover:bg-black hover:text-white text-black font-bold py-3 px-7 rounded-full transition-colors inline-block uppercase tracking-wider text-xs">
                                Read More
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRuntimeConfig, useFetch } from '#app';

const config = useRuntimeConfig();
const { data: pageData } = await useFetch(`${config.public.apiBaseUrl}/public/homepage`);
const page = pageData.value?.data || {};

// Existing Image Imports
import aboutImage from "~/assets/images/about.webp";
import connectImage from "~/assets/images/connect.webp";
import celebrationsImage from "~/assets/images/celebrations.webp";

// Existing Cards Data
const cards = [
    { kicker: "Who We Are", title: "About us", cta: "Learn More", to: "/", image: aboutImage },
    { kicker: "Join Our Community", title: "Connect with us", cta: "Sign Up", to: "/", image: connectImage },
    { kicker: "Endless Celebration", title: "Celebrations", cta: "Learn More", to: "/", image: celebrationsImage },
];

// Data for Sticky Editorial Sections
const editorialSections = [
    {
        id: 1,
        kicker: "The Experience",
        title: "Vibrant Worship",
        description: "Experience the transformative power of God's presence through high-energy praise and deep, intimate worship.",
        images: [aboutImage, connectImage, celebrationsImage, aboutImage, celebrationsImage] 
    },
    {
        id: 2,
        kicker: "The Foundation",
        title: "Deep Word",
        description: "Rooted in scripture. We believe in building a foundation of excellence and integrity through unadulterated teachings.",
        images: [celebrationsImage, aboutImage, connectImage, celebrationsImage, aboutImage]
    },
    {
        id: 3,
        kicker: "The People",
        title: "Strong Community",
        description: "A vibrant family of young believers. Find your tribe, grow together, and shine the gospel light in your world.",
        images: [connectImage, celebrationsImage, aboutImage, connectImage, celebrationsImage]
    }
];

// Function for card gradients
const cardBackground = (imagePath) => {
    const atmosphere =
        "linear-gradient(140deg, rgba(15,17,21,0.68), rgba(240,79,35,0.2), rgba(11,14,20,0.72))";
    return { backgroundImage: `${atmosphere}, url('${imagePath}')` };
};

// --- NEW: Floating Animation Logic ---

// Algorithmic Randomizer for Scattered Layout & Floating Initialization
onMounted(() => {
    // Layout Randomizer
    const scatteredImages = document.querySelectorAll('.editorial-scattered-image');
    scatteredImages.forEach((img) => {
        const randomLeft = Math.floor(Math.random() * 70) + 5; 
        const randomTop = Math.floor(Math.random() * 70) + 5; 
        const randomRotation = Math.floor(Math.random() * 40) - 20; 
        const randomScale = (Math.random() * 0.3 + 0.85).toFixed(2);

        // Store positions
        img.style.left = `${randomLeft}%`;
        img.style.top = `${randomTop}%`;
        
        // Pass initial state to CSS variables for the keyframe animation
        img.style.setProperty('--rot', `${randomRotation}deg`);
        img.style.setProperty('--scl', randomScale);
        
        // Add random delays and durations so they don't float sequentially
        img.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;
        img.style.animationDuration = `${(Math.random() * 3 + 5).toFixed(2)}s`; // Between 5 - 8 seconds
    });
});
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(var(--rot)) scale(var(--scl));
  }
  50% {
    transform: translateY(-20px) rotate(var(--rot)) scale(var(--scl));
  }
}

.editorial-scattered-image {
  animation: float ease-in-out infinite;
}
</style>