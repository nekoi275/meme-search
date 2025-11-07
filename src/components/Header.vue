<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
import ThemeToggle from "./ThemeToggle.vue";

const randomIconRef = ref<HTMLImageElement | null>(null);
let spinAnimation: gsap.core.Tween | null = null;

const handleRandomMeme = () => {
  // TODO: Implement random meme functionality
  console.log("Random meme clicked");
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
        <span class="btn-label">Случайный мем</span>
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
  background-color: var(--secondary-color);
  z-index: 1000;
  border-bottom: 4px solid var(--black);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
}

.random-meme-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  color: var(--text-color);
  border: 3px dotted var(--accent-color);
  padding: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0px;
}

.random-meme-btn:hover {
  border: 3px solid var(--accent-color);
}

.random-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
  filter: invert(1);
  transition: filter 0.3s ease;
}

.btn-label {
  font-family: "Kurland", serif;
  font-weight: 500;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0.75rem 1rem;
  }

  .random-meme-btn {
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
