<script setup lang="ts">
import { ref } from 'vue'
import InitialScreen from './screens/InitialScreen.vue'
import ResultScreen from './screens/ResultScreen.vue'
import Header from './components/Header.vue'

const currentScreen = ref<'initial' | 'result'>('initial')
const resultUrl = ref<string>('')

const handleRandomMeme = async () => {
  try {
    const response = await fetch('https://b7ywm2txkojn4qe4wtb6ivlo3e0wejwr.lambda-url.eu-west-1.on.aws/random', {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch random meme')
    }
    
    const data = await response.json()
    resultUrl.value = data.url
    currentScreen.value = 'result'
  } catch (error) {
    console.error('Error fetching random meme:', error)
  }
}

const handleReturnToInitialScreen = () => {
  currentScreen.value = 'initial'
  resultUrl.value = ''
}
</script>

<template>
  <Header 
    :current-screen="currentScreen"
    @random-meme="handleRandomMeme"
    @return-to-initial="handleReturnToInitialScreen"
  />
  <InitialScreen v-if="currentScreen === 'initial'" />
  <ResultScreen 
    v-else 
    :telegram-url="resultUrl" 
  />
</template>

<style scoped>
</style>
