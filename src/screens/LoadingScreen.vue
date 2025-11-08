<template>
  <div class="loading-screen">
    <div
      v-for="(cat, index) in cats"
      :key="index"
      :ref="el => catRefs[index] = el as HTMLElement"
      class="cat-image"
      :style="{
        width: cat.width + 'px'
      }"
    >
      <img :src="cat.src" :alt="`Cat ${index + 1}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const bgModules = import.meta.glob('../assets/bg/*.webp', { eager: true })

interface CatData {
  src: string
  width: number
  rotation: number
  x: number
  y: number
}

const catRefs = ref<(HTMLElement | null)[]>([])
const cats = ref<CatData[]>([])
const animations: gsap.core.Tween[] = []

const initializeCats = () => {
  const catImagePaths = Object.values(bgModules).map(module => (module as any).default)
  if (catImagePaths.length === 0) {
    console.warn('No cat images found')
    return
  }
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  
  cats.value = Array.from({ length: 10 }, () => ({
    src: catImagePaths[Math.floor(Math.random() * catImagePaths.length)]!,
    width: Math.random() * (150 - 80) + 80,
    rotation: Math.random() * 360,
    x: Math.random() * (screenWidth - 150),
    y: Math.random() * (screenHeight - 150)
  }))
}

const animateCats = async () => {
  await nextTick()
  
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  
  cats.value.forEach((cat, index) => {
    const catElement = catRefs.value[index]
    if (!catElement) return
    
    gsap.set(catElement, {
      x: cat.x,
      y: cat.y,
      rotation: cat.rotation
    })
    
    const animate = () => {
      const randomX = Math.random() * (screenWidth - cat.width)
      const randomY = Math.random() * (screenHeight - cat.width)
      const randomRotation = Math.random() * 360
      const duration = Math.random() * 0.8 + 0.5
      
      const tween = gsap.to(catElement, {
        x: randomX,
        y: randomY,
        rotation: randomRotation,
        duration: duration,
        ease: "power1.inOut",
        onComplete: animate
      })
      
      animations.push(tween)
    }
    
    animate()
  })
}

const handleResize = () => {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  
  cats.value.forEach((cat) => {
    if (cat.x > screenWidth - cat.width) {
      cat.x = screenWidth - cat.width
    }
    if (cat.y > screenHeight - cat.width) {
      cat.y = screenHeight - cat.width
    }
  })
}

onMounted(() => {
  initializeCats()
  animateCats()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  animations.forEach(anim => anim.kill())
  animations.length = 0
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.loading-screen {
  height: 100vh;
}

.cat-image {
  position: absolute;
  pointer-events: none;
}

.cat-image img {
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}
</style>
