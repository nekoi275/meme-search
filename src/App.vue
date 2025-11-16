<script setup lang="ts">
import { ref } from 'vue'
import InitialScreen from './screens/InitialScreen.vue'
import RandomMemeScreen from './screens/RandomMemeScreen.vue'
import ResultScreen from './screens/ResultScreen.vue'
import LoadingScreen from './screens/LoadingScreen.vue'
import Header from './components/Header.vue'
import { fetchRandomMeme } from './api'

const currentScreen = ref<'initial' | 'result' | 'search'>('initial')
const resultUrl = ref<string>('')
const isLoading = ref<boolean>(false)

const handleRandomMeme = async () => {
  isLoading.value = true
  currentScreen.value = 'result'
  try {
    const url = await fetchRandomMeme(1)
    resultUrl.value = url
  } catch (error) {
    console.error('Error fetching random meme:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  currentScreen.value = 'search'
}

const handleReturnToInitialScreen = () => {
  currentScreen.value = 'initial'
  resultUrl.value = ''
}
</script>

<template>
  <LoadingScreen v-if="isLoading" />
  <Header 
    :current-screen="currentScreen"
    @random-meme="handleRandomMeme"
    @return-to-initial="handleReturnToInitialScreen"
    @search="handleSearch"
  />
  <InitialScreen v-if="currentScreen === 'initial'" @search="handleSearch" />
  <RandomMemeScreen 
    v-if="currentScreen === 'result'"
    :telegram-url="resultUrl" 
  />
  <ResultScreen v-if="currentScreen === 'search'" />
</template>

<style scoped>
</style>
