<template>
  <section class="reference-page">
    <div class="card">
      <h1>Reference Page</h1>
      <p>This page was converted to a valid Vue component to restore app stability.</p>
      <NuxtLink to="/home" class="link">Go to Home</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main',
})
</script>

<style scoped>
.reference-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--ec-page-bg, #0b0e14);
}

.card {
  width: min(560px, 100%);
  border-radius: 16px;
  padding: 24px;
  background: rgba(16, 19, 26, 0.75);
  border: 1px solid rgba(69, 72, 79, 0.45);
  color: #ecedf6;
}

h1 {
  margin: 0 0 10px;
  font-size: 28px;
}

p {
  margin: 0 0 16px;
  color: rgba(236, 237, 246, 0.78);
}

.link {
  color: #81ecff;
  text-decoration: none;
  font-weight: 700;
}
</style>
