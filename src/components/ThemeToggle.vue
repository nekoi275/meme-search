<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const isDarkTheme = ref(true)
const cordRef = ref<HTMLElement>()
const pullRef = ref<HTMLElement>()
const lampRef = ref<HTMLElement>()

let tl: gsap.core.Timeline | null = null

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  document.documentElement.classList.toggle('light-theme', !isDarkTheme.value)
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light')
  
  if (tl) tl.kill()
  if (!cordRef.value || !pullRef.value) return
  
  tl = gsap.timeline()
  
  tl.to(cordRef.value, {
    height: '120px',
    duration: 0.2,
    ease: 'power2.out'
  })
  .to(pullRef.value, {
    top: '160px',
    duration: 0.2,
    ease: 'power2.out'
  }, 0)
  .to(cordRef.value, {
    height: '80px',
    duration: 0.3,
    ease: 'elastic.out(1, 0.5)'
  })
  .to(pullRef.value, {
    top: '120px',
    duration: 0.3,
    ease: 'elastic.out(1, 0.5)'
  }, '-=0.3')
}

const handleMouseEnter = () => {
  if (tl) tl.kill()
  if (!cordRef.value || !pullRef.value) return
  
  gsap.to(cordRef.value, {
    height: '90px',
    duration: 0.3,
    ease: 'power2.out'
  })
  gsap.to(pullRef.value, {
    top: '130px',
    duration: 0.3,
    ease: 'power2.out'
  })
}

const handleMouseLeave = () => {
  if (tl) tl.kill()
  if (!cordRef.value || !pullRef.value) return
  
  gsap.to(cordRef.value, {
    height: '80px',
    duration: 0.3,
    ease: 'power2.out'
  })
  gsap.to(pullRef.value, {
    top: '120px',
    duration: 0.3,
    ease: 'power2.out'
  })
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkTheme.value = savedTheme === 'dark'
    document.documentElement.classList.toggle('light-theme', !isDarkTheme.value)
  } else { 
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDarkTheme.value = prefersDark
    document.documentElement.classList.toggle('light-theme', !isDarkTheme.value)
  }
})

onUnmounted(() => {
  if (tl) tl.kill()
})
</script>

<template>
  <div class="lamp-container" @click="toggleTheme" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div ref="lampRef" class="lamp">
      <div class="lamp-bulb" :class="{ 'bulb-on': !isDarkTheme }">
        <img 
          :src="isDarkTheme ? '/src/assets/full-moon.png' : '/src/assets/sun.png'" 
          :alt="isDarkTheme ? 'Темная тема' : 'Светлая тема'"
          class="theme-icon"
        />
      </div>
    </div>
    
    <div ref="cordRef" class="cord"></div>
    
    <div ref="pullRef" class="pull-handle"></div>
  </div>
</template>

<style scoped>
.lamp-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  user-select: none;
  height: 40px;
  overflow: visible;
}

.lamp {
  position: relative;
  z-index: 3;
  width: 60px;
  height: 40px;
  background: var(--secondary-color);
  border: 1px solid var(--black);
  border-radius: 50% 50% 20% 20%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.lamp-bulb {
  position: absolute;
  top: 50%;
  left: 50%;
  padding-top: 0.5rem;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  opacity: 0.7;
}

.theme-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.bulb-on {
  opacity: 1;
}

.bulb-on .theme-icon {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
}

.cord {
  width: 4px;
  height: 80px;
  background: var(--black);
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform-origin: top;
}

.pull-handle {
  width: 20px;
  height: 20px;
  background: var(--black);
  border-radius: 6px;
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.pull-handle::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 4px;
  background: var(--black);
  border-radius: 1px;
}
</style>
