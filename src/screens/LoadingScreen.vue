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

import cat1 from '../assets/cats/cat1.png'
import cat2 from '../assets/cats/cat2.png'
import cat3 from '../assets/cats/cat3.png'
import cat4 from '../assets/cats/cat4.png'
import cat5 from '../assets/cats/cat5.png'
import cat6 from '../assets/cats/cat6.png'

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
  const catImages = [cat1, cat2, cat3, cat4, cat5, cat6]
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  
  cats.value = catImages.map((img) => ({
    src: img,
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
