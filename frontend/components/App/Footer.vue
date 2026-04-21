<template>
	<footer class="bg-black text-white/75 border-t border-white/10 mt-24">
		<div class="max-w-6xl mx-auto px-4 md:px-8 py-12">
			<div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
				<div>
					<p class="font-black text-2xl text-white">McPherson Chapel of Praise</p>
					<p class="uppercase tracking-[0.22em] text-[11px] mt-1 text-white/60">
						Welcome Home
					</p>
				</div>

				<div class="text-xs uppercase tracking-[0.18em] flex items-center gap-4">
					<NuxtLink to="/" class="hover:text-white transition-colors">About</NuxtLink>
					<NuxtLink to="/merch" class="hover:text-white transition-colors">Merch</NuxtLink>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup></script>
