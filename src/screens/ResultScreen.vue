<template>
  <div class="result-screen">
    <SearchBlock />
  </div>
</template>

<script setup lang="ts">
import SearchBlock from '../components/SearchBlock.vue'
</script>

<style scoped>
.result-screen {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-color);
  overflow: hidden;
  padding-top: 7rem;
}
</style>