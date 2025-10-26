<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDarkTheme = ref(true)

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  document.documentElement.classList.toggle('light-theme', !isDarkTheme.value)
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkTheme.value = savedTheme === 'dark'
    document.documentElement.classList.toggle('light-theme', !isDarkTheme.value)
  } else { 
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDarkTheme.value = prefersDark
    document.documentElement.classList.toggle('light-theme', !isDarkTheme.value)
  }
})
</script>

<template>
  <button @click="toggleTheme" class="theme-toggle">
    {{ isDarkTheme ? '☀️' : '🌙' }}
  </button>
</template>

<style scoped>
.theme-toggle {
  background-color: transparent;
  border: 2px solid var(--accent-color);
  font-size: 1.5em;
  padding: 0.5em;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background-color: var(--accent-color);
  transform: scale(1.1);
}
</style>
