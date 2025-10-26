<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<template>
  <div>
    <Header />
    <main class="main-content">
      <h1>Поисковик мемов</h1>
    </main>
  </div>
</template>

<style scoped>
.main-content {
  padding-top: 80px; /* Account for fixed header */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  margin-top: 2rem;
}
</style>
