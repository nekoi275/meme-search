<script setup lang="ts">
import { ref } from "vue";
import { gsap } from "gsap";
import ThemeToggle from "./ThemeToggle.vue";

const props = defineProps<{
  currentScreen?: "initial" | "randomMeme" | "search";
}>();

const emit = defineEmits<{
  (e: "random-meme"): void;
  (e: "return-to-initial"): void;
  (e: "search"): void;
}>();

const randomIconRef = ref<HTMLImageElement | null>(null);
let spinAnimation: gsap.core.Tween | null = null;

const handleRandomMeme = () => {
  emit("random-meme");
};

const handleReturnToInitialScreen = () => {
  emit("return-to-initial");
};

const handleSearch = () => {
  emit("search");
};

const startSpin = () => {
  if (randomIconRef.value) {
    if (spinAnimation) {
      spinAnimation.kill();
    }
    gsap.set(randomIconRef.value, { rotation: 0 });

    spinAnimation = gsap.to(randomIconRef.value, {
      rotation: 360,
      duration: 1,
      ease: "none",
      repeat: -1,
    });
  }
};

const stopSpin = () => {
  if (spinAnimation) {
    spinAnimation.kill();
    spinAnimation = null;
  }
};
</script>

<template>
  <header class="header">
    <div class="header-content">
      <img srcset="/src/assets/logo_S.webp 1x, /src/assets/logo_M.webp 2x, /src/assets/logo_L.webp 3x"
        src="/src/assets/logo_M.webp" width="100" height="100" alt="Логотип поисковика мемов" class="logo"
        @click="handleReturnToInitialScreen" />
      <button @click="handleRandomMeme" @mouseenter="startSpin" @mouseleave="stopSpin" class="random-meme-btn">
        <img ref="randomIconRef"
          srcset="/src/assets/random_S.png 1x, /src/assets/random_M.png 2x, /src/assets/random_L.png 3x"
          src="/src/assets/random_M.png" alt="Случайный мем" class="random-icon" />
        <span class="btn-label">Случайный мем</span>
      </button>
      <button v-if="props.currentScreen === 'randomMeme' || props.currentScreen === 'search'" @click="handleSearch">
        Начать поиск
      </button>
      <ThemeToggle />
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 7rem;
  background-color: var(--secondary-color);
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.random-meme-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.random-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: invert(1);
  transition: filter 0.3s ease;
}

.logo {
  width: 100px;
  height: 100px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0.75rem 1rem;
  }

  .random-meme-btn {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  button {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .btn-label {
    display: none;
  }

  .random-icon {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0.5rem 0.75rem;
  }

  .random-meme-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  button {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .random-icon {
    width: 20px;
    height: 20px;
  }
}

@media (prefers-color-scheme: light) {
  .random-icon {
    filter: invert(0);
  }
}

@media (prefers-color-scheme: dark) {
  .random-icon {
    filter: invert(1);
  }
}
</style>

<style>
.dark-theme .random-icon {
  filter: invert(1);
}

.light-theme .random-icon {
  filter: invert(0);
}
</style>
