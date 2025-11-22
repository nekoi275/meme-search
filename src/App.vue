<script setup lang="ts">
import { ref, nextTick } from 'vue'
import InitialScreen from './screens/InitialScreen.vue'
import RandomMemeScreen from './screens/RandomMemeScreen.vue'
import ResultScreen from './screens/ResultScreen.vue'
import LoadingScreen from './screens/LoadingScreen.vue'
import Header from './components/Header.vue'
import { fetchRandomMemes, type MemeResponse } from './api'

const currentScreen = ref<'initial' | 'result' | 'search'>('initial')
const resultUrl = ref<string>('')
const isLoading = ref<boolean>(false)
const resultScreenRef = ref<InstanceType<typeof ResultScreen> | null>(null)

const handleRandomResponse = (response: MemeResponse[]): string | null => {
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

const handleSearchButtonClick = async () => {
  currentScreen.value = 'search'
  await nextTick()
  if (resultScreenRef.value?.searchBlockRef) {
    resultScreenRef.value.searchBlockRef.animateInIfScaledOut()
  }
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
    @search="handleSearchButtonClick"
  />
  <InitialScreen v-if="currentScreen === 'initial'" @search="handleSearchButtonClick" />
  <RandomMemeScreen 
    v-if="currentScreen === 'result'"
    :telegram-url="resultUrl" 
  />
  <ResultScreen 
    v-if="currentScreen === 'search'" 
    ref="resultScreenRef" 
  />
</template>

<style scoped>
</style>
