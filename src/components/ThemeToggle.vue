<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'
import { gsap } from 'gsap'
import sunIcon from '../assets/sun.svg'
import moonIcon from '../assets/full-moon.svg'

const isDarkTheme = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
const cordRef = ref<HTMLElement>()
const pullRef = ref<HTMLElement>()
const lampRef = ref<HTMLElement>()

let tl: gsap.core.Timeline | null = null
const startY = ref(0)
const isDragging = ref(false)

onMounted(() => {
  const preloadSun = new Image()
  preloadSun.src = sunIcon
  const preloadMoon = new Image()
  preloadMoon.src = moonIcon
})

const switchThemeState = () => {
  isDarkTheme.value = !isDarkTheme.value
  if (isDarkTheme.value) {
    document.documentElement.classList.remove('light-theme')
    document.documentElement.classList.add('dark-theme')
  } else {
    document.documentElement.classList.remove('dark-theme')
    document.documentElement.classList.add('light-theme')
  }
}

const playThemeToggleAnimation = () => {
  if (tl) tl.kill()
  if (!cordRef.value || !pullRef.value) return

  tl = gsap.timeline()

  tl.to(cordRef.value, {
    height: '100px',
    duration: 0.2,
    ease: 'power2.out'
  })
    .to(pullRef.value, {
      top: '140px',
      duration: 0.2,
      ease: 'power2.out'
    }, 0)
    .to(cordRef.value, {
      height: '60px',
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)'
    })
    .to(pullRef.value, {
      top: '100px',
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)'
    }, '-=0.4')
}

const toggleTheme = () => {
  switchThemeState()
  playThemeToggleAnimation()
}

const startDrag = (event: MouseEvent | TouchEvent) => {
  // Disable dragging on mobile devices (touch events)
  if (event instanceof TouchEvent) {
    return
  }

  if (tl) tl.kill()

  const clientY = (event as MouseEvent).clientY
  if (!clientY) return

  startY.value = clientY
  isDragging.value = false

  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', endDrag)
}

const onDrag = (event: MouseEvent | TouchEvent) => {
  // Only handle mouse events, not touch events
  if (event instanceof TouchEvent) {
    return
  }

  const clientY = (event as MouseEvent).clientY
  if (!clientY) return

  const deltaY = clientY - startY.value

  if (Math.abs(deltaY) > 5) {
    isDragging.value = true
  }

  if (isDragging.value) {
    const pullDistance = Math.max(0, Math.min(deltaY, 100))

    if (cordRef.value && pullRef.value) {
      gsap.set(cordRef.value, { height: 60 + pullDistance })
      gsap.set(pullRef.value, { top: 100 + pullDistance })
    }
  }
}

const endDrag = () => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', endDrag)

  if (isDragging.value) {
    if (cordRef.value) {
      const currentHeight = parseFloat(cordRef.value.style.height || '60')
      if (currentHeight > 90) {
        switchThemeState()
      }
    }

    if (cordRef.value && pullRef.value) {
      gsap.to(cordRef.value, {
        height: 60,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      })
      gsap.to(pullRef.value, {
        top: 100,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      })
    }
  } else {
    toggleTheme()
  }

  isDragging.value = false
}

onUnmounted(() => {
  if (tl) tl.kill()
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
})
</script>

<template>
  <div class="lamp-container">
    <div ref="lampRef" class="lamp" @click="toggleTheme">
      <div class="lamp-bulb" :class="{ 'bulb-on': !isDarkTheme }">
        <img 
          width="24"
          height="24"
          :src="isDarkTheme ? moonIcon : sunIcon"
          :alt="isDarkTheme ? 'Темная тема' : 'Светлая тема'" class="theme-icon" />
      </div>
    </div>

    <div ref="cordRef" class="cord" @mousedown="startDrag"></div>

    <div ref="pullRef" class="pull-handle" @mousedown="startDrag"></div>
  </div>
</template>

<style scoped>
.lamp-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  cursor: pointer;
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
  height: 60px;
  background: var(--black);
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform-origin: top;
  cursor: grab;
}

.cord:active {
  cursor: grabbing;
}

.pull-handle {
  width: 10px;
  height: 20px;
  background: var(--black);
  border-radius: 6px;
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  cursor: grab;
}

.pull-handle:active {
  cursor: grabbing;
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

/* Disable dragging on mobile devices */
@media (hover: none) and (pointer: coarse) {
  .cord,
  .pull-handle {
    pointer-events: none;
    cursor: default;
  }
}
</style>
