<template>
  <div class="search-screen">
    <SearchBlock class="search-block" ref="searchBlockRef" @search-results="handleSearchResults"
      @is-loading="$emit('is-loading', $event)" />
    <div v-show="displayResults.length > 0" class="results-container">
      <MemeResult v-for="meme in displayResults" :key="meme.id" :meme="meme" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchBlock from '../components/SearchBlock.vue'
import MemeResult from '../components/MemeResult.vue'
import type { MemeResponse } from '../api'

const emit = defineEmits<{
  (e: 'is-loading', value: boolean): void
}>()

const searchBlockRef = ref<InstanceType<typeof SearchBlock> | null>(null)
const searchResults = ref<MemeResponse[]>([])

const displayResults = computed(() => {
  return searchResults.value.filter(meme => meme.urls && meme.urls.length > 0)
})

const handleSearchResults = (results: MemeResponse[]) => {
  searchResults.value = results
}

defineExpose({
  searchBlockRef,
  searchResults
})
</script>

<style scoped>
.search-screen {
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

.results-container>* {
  break-inside: avoid;
  margin-bottom: 2rem;
  display: inline-block;
  width: 100%;
}

.search-block {
  position: absolute;
  top: 8rem;
  left: 50%;
  transform: translateX(-50%);
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

  .results-container>* {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .results-container {
    column-count: 1;
    padding: 0.5rem;
    column-gap: 1rem;
  }

  .results-container>* {
    margin-bottom: 1rem;
  }
}
</style>
