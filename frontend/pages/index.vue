<template>
	<div class="min-h-screen bg-theme-base text-theme-text pt-30 pb-10">
		<div class="max-w-6xl mx-auto px-4 md:px-8">
			<section class="mb-14 md:mb-18 animate-fade-in-up">
				<div class="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-black/70 mb-6">
					<span class="w-2 h-2 rounded-full bg-theme-primary"></span>
					Welcome to COP
				</div>

				<h1 class="church-display text-[3.2rem] sm:text-[4.6rem] md:text-[6.2rem] text-black max-w-4xl">
					WELCOME HOME!
				</h1>

				<p class="mt-7 text-lg md:text-3xl text-theme-text-muted max-w-2xl leading-snug">
					Dive into our teachings, events and community.<br class="hidden sm:block" />
					Your journey of faith begins here.
				</p>
			</section>

			<section class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3">
				<NuxtLink
					v-for="(card, index) in cards"
					:key="card.title"
					:to="card.to"
					class="group relative min-h-[24rem] md:min-h-[30rem] overflow-hidden card-reveal"
					:style="{ animationDelay: `${index * 140}ms` }"
				>
					<div
						class="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
						:style="cardBackground(card.image)"
					></div>

					<div class="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/75"></div>

					<div class="relative h-full flex flex-col justify-between p-6 md:p-7 text-white">
						<div>
							<p class="text-xs uppercase tracking-[0.2em] font-semibold text-white/90">
								{{ card.kicker }}
							</p>
							<h2 class="mt-1 text-4xl md:text-5xl font-black leading-none tracking-tight">
								{{ card.title }}
							</h2>
						</div>

						<span class="inline-flex items-center gap-2 uppercase tracking-[0.17em] text-xs font-bold text-white/95">
							{{ card.cta }}
							<Icon name="heroicons:arrow-long-right" class="w-5 h-5" />
						</span>
					</div>
				</NuxtLink>
			</section>
		</div>
	</div>
</template>

<script setup>
import aboutImage from "~/assets/images/about.webp";
import connectImage from "~/assets/images/connect.webp";
import celebrationsImage from "~/assets/images/celebrations.webp";

const cards = [
	{
		kicker: "Who We Are",
		title: "About us",
		cta: "Learn More",
		to: "/",
		image: aboutImage,
	},
	{
		kicker: "Join Our Community",
		title: "Connect with us",
		cta: "Sign Up",
		to: "/",
		image: connectImage,
	},
	{
		kicker: "Endless Celebration",
		title: "Celebrations",
		cta: "Learn More",
		to: "/",
		image: celebrationsImage,
	},
];

const cardBackground = (imagePath) => {
	const atmosphere =
		"linear-gradient(140deg, rgba(15,17,21,0.68), rgba(240,79,35,0.2), rgba(11,14,20,0.72))";
	return {
		backgroundImage: `${atmosphere}, url('${imagePath}')`,
	};
};
</script>

<style scoped>
.animate-fade-in-up {
	animation: fadeInUp 0.85s ease both;
}

.card-reveal {
	animation: fadeInUp 0.8s ease both;
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(22px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
