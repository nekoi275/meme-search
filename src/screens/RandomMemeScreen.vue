<script setup lang="ts">
import TelegramWidget from "../components/TelegramWidget.vue";

defineProps<{
  telegramUrl: string;
}>();
</script>

<template>
  <div class="random-meme-screen">
    <TelegramWidget :telegram-url="telegramUrl" />
  </div>
</template>

<style scoped>
.random-meme-screen {
  background-color: var(--background-color);
  padding-top: 8rem;
}
</style>

