<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const props = defineProps<{
  telegramUrl: string;
}>();

const widgetContainer = ref<HTMLDivElement | null>(null);

const extractPostId = (url: string): string => {
  const match = url.match(/t\.me\/(.+)$/);
  return match && match[1] ? match[1] : "";
};

const loadTelegramWidget = () => {
  if (!widgetContainer.value || !props.telegramUrl) return;

  widgetContainer.value.innerHTML = "";

  const postId = extractPostId(props.telegramUrl);
  if (!postId) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.setAttribute("data-telegram-post", postId);
  script.setAttribute("data-width", "100%");

  widgetContainer.value.appendChild(script);
};

watch(
  () => props.telegramUrl,
  () => {
    loadTelegramWidget();
  },
  { immediate: true }
);

onMounted(() => {
  loadTelegramWidget();
});
</script>

<template>
  <div class="result-screen">
    <div class="widget-container" ref="widgetContainer"></div>
  </div>
</template>

<style scoped>
.result-screen {
  height: 100vh;
  background-color: var(--background-color);
  padding-top: 8rem;
}

.widget-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
