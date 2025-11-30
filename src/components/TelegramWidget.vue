<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";

const props = defineProps<{
  telegramUrl: string;
}>();



const widgetContainer = ref<HTMLDivElement | null>(null);
const isDarkTheme = ref<boolean>(
  window.matchMedia('(prefers-color-scheme: dark)').matches ||
  document.documentElement.classList.contains('dark-theme')
);

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
  script.setAttribute("data-userpic", "false");
  isDarkTheme.value ? script.setAttribute("data-dark", "1") : null;

  widgetContainer.value.appendChild(script);
};

watch(
  () => props.telegramUrl,
  () => {
    loadTelegramWidget();
  },
  { immediate: true }
);

watch(isDarkTheme, () => {
  loadTelegramWidget();
});

let observer: MutationObserver | null = null;

onMounted(() => {
  loadTelegramWidget();

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        isDarkTheme.value = document.documentElement.classList.contains('dark-theme');
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <div ref="widgetContainer"></div>
</template>

<style scoped></style>
