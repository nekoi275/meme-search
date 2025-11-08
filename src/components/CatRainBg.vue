<template>
  <div class="cat-rain-container">
    <div
      v-for="(cat, index) in cats"
      :key="index"
      :ref="el => catRefs[index] = el as HTMLElement"
      class="cat-image"
      :style="{
        width: cat.width + 'px',
        transform: `rotate(${cat.rotation}deg)`,
        left: cat.startX + 'px',
        top: cat.startY + 'px'
      }"
    >
      <img :src="cat.src" :alt="`Мем с котом ${index + 1}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

const bgModules = import.meta.glob('../assets/bg/*.webp', { eager: true })

gsap.registerPlugin(Draggable)

interface CatData {
  src: string
  width: number
  rotation: number
  startX: number
  startY: number
  isAnimating: boolean
}

const catRefs = ref<(HTMLElement | null)[]>([])
const cats = ref<CatData[]>([])

const initializeCats = () => {
  const catImagePaths = Object.values(bgModules).map(module => (module as any).default)
  if (catImagePaths.length === 0) {
    console.warn('No cat images found')
    return
  }
  const screenWidth = window.innerWidth
  
  cats.value = Array.from({ length: 10 }, () => ({
    src: catImagePaths[Math.floor(Math.random() * catImagePaths.length)]!,
    width: Math.random() * (250 - 100) + 100,
    rotation: Math.random() * 360,
    startX: Math.random() * screenWidth,
    startY: -200,
    isAnimating: true
  }))
}

const animateCats = async () => {
  await nextTick()
  
  cats.value.forEach((cat, index) => {
    const catElement = catRefs.value[index]
    if (!catElement) return
    
    const screenHeight = window.innerHeight + 100
    const fallDuration = Math.random() * 1.5 + 2.5
    
    const tl = gsap.timeline({
      onComplete: () => {
        cat.isAnimating = false
        makeDraggable(catElement)
      }
    })
    
    tl.to(catElement, {
      y: screenHeight,
      duration: fallDuration,
      ease: "power2.in"
    })
  })
}

const makeDraggable = (element: HTMLElement) => {
  gsap.set(element, { clearProps: "transform" })
  
  Draggable.create(element, {
    type: "x,y",
    bounds: "body",
    inertia: true,
    liveSnap: false,
    onDrag: function() {
      gsap.to(element, {
        rotation: `+=${Math.random() * 10 - 5}`,
        duration: 0.1
      })
    }
  })
}

onMounted(() => {
  initializeCats()
  animateCats()
})
</script>

<style scoped>
.cat-rain-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  pointer-events: none;
  z-index: 0;
}

.cat-image {
  position: absolute;
  pointer-events: auto;
  cursor: grab;
  transition: transform 0.1s ease;
}

.cat-image:active {
  cursor: grabbing;
}

.cat-image img {
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.cat-image:hover {
  z-index: 10;
}
</style>
