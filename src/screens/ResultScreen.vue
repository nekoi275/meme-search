<template>
  <div class="result-screen">
    <SearchBlock 
      ref="searchBlockRef" 
      :initial-scaled-out="props.initialScaledOut"
      @scaled-out-change="handleScaledOutChange"
      @search-results="handleSearchResults"
    />
    <div v-if="displayResults.length > 0" class="results-container">
      <TelegramWidget 
        v-for="(url, index) in allUrls" 
        :key="`url-${index}`"
        :telegram-url="url"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchBlock from '../components/SearchBlock.vue'
import TelegramWidget from '../components/TelegramWidget.vue'
import type { RandomMemeResponse } from '../api'

const props = defineProps<{
  initialScaledOut?: boolean
  searchResults?: RandomMemeResponse[]
}>()

const emit = defineEmits<{
  (e: 'search-block-scaled-out', value: boolean): void
  (e: 'search-results', results: RandomMemeResponse[]): void
}>()

const searchBlockRef = ref<InstanceType<typeof SearchBlock> | null>(null)
const localSearchResults = ref<RandomMemeResponse[]>([])

const displayResults = computed(() => {
  return props.searchResults && props.searchResults.length > 0 
    ? props.searchResults 
    : localSearchResults.value
})

const allUrls = computed(() => {
  const urls: string[] = []
  displayResults.value.forEach(result => {
    if (result.urls && result.urls.length > 0) {
      urls.push(...result.urls)
    }
  })
  return urls
})

const handleScaledOutChange = (scaledOut: boolean) => {
  emit('search-block-scaled-out', scaledOut)
}

const handleSearchResults = (results: RandomMemeResponse[]) => {
  localSearchResults.value = results
  emit('search-results', results)
}

defineExpose({
  searchBlockRef
})
</script>

<style scoped>
.result-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: var(--background-color);
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 7rem;
  padding-bottom: 2rem;
  min-height: 100vh;
}

.results-container {
  column-count: 3;
  column-gap: 2rem;
  margin-top: 2rem;
  padding: 1rem;
  width: 90%;
  max-width: 1200px;
}

.results-container > * {
  break-inside: avoid;
  margin-bottom: 2rem;
  display: inline-block;
  width: 100%;
}

@media (max-width: 1024px) {
  .results-container {
    column-count: 2;
  }
}

@media (max-width: 768px) {
  .results-container {
    width: 95%;
    column-count: 2;
    column-gap: 1.5rem;
  }
  
  .results-container > * {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .results-container {
    column-count: 1;
    padding: 0.5rem;
    column-gap: 1rem;
  }
  
  .results-container > * {
    margin-bottom: 1rem;
  }
}
</style>