<script setup lang="ts">
import { ref, nextTick } from 'vue'
import InitialScreen from './screens/InitialScreen.vue'
import RandomMemeScreen from './screens/RandomMemeScreen.vue'
import SearchScreen from './screens/SearchScreen.vue'
import LoadingScreen from './screens/LoadingScreen.vue'
import Header from './components/Header.vue'
import { fetchRandomMemes, type MemeResponse } from './api'

const currentScreen = ref<'initial' | 'randomMeme' | 'search'>('initial')
const resultUrl = ref<string>('')
const isLoading = ref<boolean>(false)
const searchScreenRef = ref<InstanceType<typeof SearchScreen> | null>(null)

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

const setIsLoading = (value: boolean) => {
  isLoading.value = value
}

const handleRandomMeme = async () => {
  setIsLoading(true)
  currentScreen.value = 'randomMeme'
  try {
    const response = await fetchRandomMemes(1)
    const firstUrl = handleRandomResponse(response)
    if (firstUrl) {
      resultUrl.value = firstUrl
    }
  } catch (error) {
    console.error('Error fetching random meme:', error)
  } finally {
    setIsLoading(false)
  }
}

const handleSearchButtonClick = async () => {
  currentScreen.value = 'search'
  await nextTick()
  if (searchScreenRef.value?.searchBlockRef) {
    searchScreenRef.value.searchBlockRef.animateInIfScaledOut()
  }
}

const handleReturnToInitialScreen = () => {
  currentScreen.value = 'initial'
  resultUrl.value = ''
}
</script>

<template>
  <LoadingScreen v-show="isLoading" />
  <Header :current-screen="currentScreen" @random-meme="handleRandomMeme"
    @return-to-initial="handleReturnToInitialScreen" @search="handleSearchButtonClick" />
  <InitialScreen v-if="currentScreen === 'initial'" @search="handleSearchButtonClick" />
  <RandomMemeScreen v-if="currentScreen === 'randomMeme'" :telegram-url="resultUrl" />
  <SearchScreen @is-loading="setIsLoading" v-if="currentScreen === 'search'" ref="searchScreenRef" />
</template>

<style scoped></style>
