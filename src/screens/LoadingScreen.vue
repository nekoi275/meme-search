<template>
  <div class="loading-screen">
    <div
      v-for="(meme, index) in memes"
      :key="index"
      :ref="el => memeRefs[index] = el as HTMLElement"
      class="meme-image"
      :style="{
        width: meme.width + 'px'
      }"
    >
      <img :src="meme.src" :alt="`Meme ${index + 1}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const bgModules = import.meta.glob('../assets/bg/*.webp', { eager: true })

interface MemeData {
  src: string
  width: number
  rotation: number
  x: number
  y: number
}

const memeRefs = ref<(HTMLElement | null)[]>([])
const memes = ref<MemeData[]>([])
const animations: gsap.core.Tween[] = []

const initializeMemes = () => {
  const memeImagePaths = Object.values(bgModules).map(module => (module as any).default)
  if (memeImagePaths.length === 0) {
    console.warn('No meme images found')
    return
  }
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  
  memes.value = memeImagePaths.slice(0, 6).map((img) => ({
    src: img,
    width: Math.random() * (150 - 80) + 80,
    rotation: Math.random() * 360,
    x: Math.random() * (screenWidth - 150),
    y: Math.random() * (screenHeight - 150)
  }))
}

const animateMemes = async () => {
  await nextTick()
  
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  
  memes.value.forEach((meme, index) => {
    const memeElement = memeRefs.value[index]
    if (!memeElement) return
    
    gsap.set(memeElement, {
      x: meme.x,
      y: meme.y,
      rotation: meme.rotation
    })
    
    const animate = () => {
      const randomX = Math.random() * (screenWidth - meme.width)
      const randomY = Math.random() * (screenHeight - meme.width)
      const randomRotation = Math.random() * 360
      const duration = Math.random() * 0.8 + 0.5
      
      const tween = gsap.to(memeElement, {
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
  
  memes.value.forEach((meme) => {
    if (meme.x > screenWidth - meme.width) {
      meme.x = screenWidth - meme.width
    }
    if (meme.y > screenHeight - meme.width) {
      meme.y = screenHeight - meme.width
    }
  })
}

onMounted(() => {
  initializeMemes()
  animateMemes()
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
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  background: transparent;
  z-index: 1000;
}

.meme-image {
  position: absolute;
  pointer-events: none;
}

.meme-image img {
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}
</style>
