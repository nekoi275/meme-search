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
  <div ref="widgetContainer"></div>
</template>

<style scoped></style>
