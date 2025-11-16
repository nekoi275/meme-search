<script setup lang="ts">
import { ref } from 'vue'
import InitialScreen from './screens/InitialScreen.vue'
import RandomMemeScreen from './screens/RandomMemeScreen.vue'
import ResultScreen from './screens/ResultScreen.vue'
import LoadingScreen from './screens/LoadingScreen.vue'
import Header from './components/Header.vue'
import { fetchRandomMemes, type RandomMemeResponse } from './api'

const currentScreen = ref<'initial' | 'result' | 'search'>('initial')
const resultUrl = ref<string>('')
const isLoading = ref<boolean>(false)

const handleRandomResponse = (response: RandomMemeResponse[]): string | null => {
  if (response.length > 0) {
    const firstItem = response[0]
    if (firstItem && firstItem.urls && firstItem.urls.length > 0) {
      const firstUrl = firstItem.urls[0]
      if (firstUrl) {
        return firstUrl
      }
    }
  }
  return null
}

const handleRandomMeme = async () => {
  isLoading.value = true
  currentScreen.value = 'result'
  try {
    const response = await fetchRandomMemes(1)
    const firstUrl = handleRandomResponse(response)
    if (firstUrl) {
      resultUrl.value = firstUrl
    }
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
