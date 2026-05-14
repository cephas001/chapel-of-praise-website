<template>
  <LoadingScreen :isLoading="pending" />
  <main v-if="pageData">
    <h1>{{ pageData.title }}</h1>
    
    <div class="page-content" v-html="pageData.content"></div>
  </main>
</template>

<script setup>
import { computed } from 'vue';
const route = useRoute()

// 1. Get the slug from the URL. 
// If the URL is /services/marketing, route.params.slug will be an array: ['services', 'marketing']
// We join it back into a string to query the database.
const slugPath = route.params.slug ? route.params.slug.join('/') : ''

// 2. Fetch the page data from your backend API
const { data: pageData, pending, error } = useFetch(`/api/pages/${slugPath}`, {
  baseURL: 'https://your-backend-api.com' // Replace with your actual API URL
})

// 3. Handle 404s if the admin hasn't created a page for this URL
if (error.value || !pageData.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

// Optional: Set SEO meta tags dynamically based on the admin's input
useHead({
  title: pageData.value.title,
  meta: [
    { name: 'description', content: pageData.value.excerpt || 'Default description' }
  ]
})
</script>