<template>
    <div class="meme-result">
        <div v-if="meme.urls.length > 1" class="tabs">
            <button v-for="(_, index) in meme.urls" :key="index" class="tab-button"
                :class="{ active: activeTabIndex === index }" @click="activeTabIndex = index"
                :aria-label="`View source ${index + 1}`">
            </button>
        </div>
        <TelegramWidget :telegram-url="meme.urls[activeTabIndex] || ''" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MemeResponse } from '../api'
import TelegramWidget from './TelegramWidget.vue'

defineProps<{
    meme: MemeResponse
}>()

const activeTabIndex = ref(0)
</script>

<style scoped>
.meme-result {
    width: 100%;
}

.tabs {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
}

.tab-button {
    width: 12px;
    height: 12px;
    padding: 0;
    border-radius: 50%;
    border: 2px solid var(--accent-color);
    background-color: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tab-button.active {
    background-color: var(--accent-color);
}

.tab-button:hover {
    background-color: var(--accent-color);
    opacity: 0.7;
}

.tab-button::after {
    display: none;
}
</style>
