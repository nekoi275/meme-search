<template>
  <div class="result-screen">
    <SearchBlock 
      ref="searchBlockRef" 
      :initial-scaled-out="props.initialScaledOut"
      @scaled-out-change="handleScaledOutChange" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchBlock from '../components/SearchBlock.vue'

const props = defineProps<{
  initialScaledOut?: boolean
}>()

const emit = defineEmits<{
  (e: 'search-block-scaled-out', value: boolean): void
}>()

const searchBlockRef = ref<InstanceType<typeof SearchBlock> | null>(null)

const handleScaledOutChange = (scaledOut: boolean) => {
  emit('search-block-scaled-out', scaledOut)
}

defineExpose({
  searchBlockRef
})
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