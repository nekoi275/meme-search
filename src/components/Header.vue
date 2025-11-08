<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
import ThemeToggle from "./ThemeToggle.vue";

const props = defineProps<{
  currentScreen?: "initial" | "result";
}>();

const emit = defineEmits<{
  (e: "random-meme"): void;
  (e: "return-to-initial"): void;
}>();

const randomIconRef = ref<HTMLImageElement | null>(null);
let spinAnimation: gsap.core.Tween | null = null;

const handleRandomMeme = () => {
  emit("random-meme");
};

const handleReturnToInitialScreen = () => {
  emit("return-to-initial");
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

onMounted(() => {
  if (typeof gsap !== "undefined") {
    console.log("GSAP loaded successfully");
  }
});
</script>

<template>
  <header class="header">
    <div class="header-content">
      <img
        src="/src/assets/logo.webp"
        width="100"
        height="100"
        alt="Логотип"
        class="logo"
        @click="handleReturnToInitialScreen"
      />
      <button
        @click="handleRandomMeme"
        @mouseenter="startSpin"
        @mouseleave="stopSpin"
        class="random-meme-btn"
      >
        <img
          ref="randomIconRef"
          src="/src/assets/random.png"
          alt="Случайный мем"
          class="random-icon"
        />
        <span>Случайный мем</span>
      </button>
      <button v-if="props.currentScreen === 'result'">
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
  border-bottom: 4px solid var(--black);
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
  width: 50px;
  height: 50px;
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
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  button {
    padding: 0.5rem 1rem;
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
</style>

<style>
:root:not(.light-theme) .random-icon {
  filter: invert(1);
}

.light-theme .random-icon {
  filter: invert(0);
}
</style>
