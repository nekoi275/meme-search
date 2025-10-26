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
      <img :src="cat.src" :alt="`Cat ${index + 1}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

// Import all cat images
import cat1 from '../assets/cats/cat1.png'
import cat2 from '../assets/cats/cat2.png'
import cat3 from '../assets/cats/cat3.png'
import cat4 from '../assets/cats/cat4.png'
import cat5 from '../assets/cats/cat5.png'
import cat6 from '../assets/cats/cat6.png'

// Register Draggable plugin
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

// Initialize cats with random properties
const initializeCats = () => {
  const catImages = [cat1, cat2, cat3, cat4, cat5, cat6]
  const screenWidth = window.innerWidth
  
  cats.value = catImages.map(() => ({
    src: catImages[Math.floor(Math.random() * catImages.length)]!,
    width: Math.random() * (250 - 100) + 100, // Random width between 100-250px
    rotation: Math.random() * 360, // Random rotation 0-360 degrees
    startX: Math.random() * screenWidth, // Random horizontal position
    startY: -200, // Start above screen
    isAnimating: true
  }))
}

// Create falling animation for each cat
const animateCats = async () => {
  await nextTick()
  
  cats.value.forEach((cat, index) => {
    const catElement = catRefs.value[index]
    if (!catElement) return
    
    const screenHeight = window.innerHeight + 100
    const bounceHeight = 100
    const fallDuration = Math.random() * 1.5 + 2.5 // Random duration 2.5-4 seconds
    
    // Create timeline for falling animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Make cat draggable when animation completes
        cat.isAnimating = false
        // Small delay to ensure final position is stable
        setTimeout(() => {
          makeDraggable(catElement)
        }, 100)
      }
    })
    
    // Fall from top to bottom with bounce
    tl.to(catElement, {
      y: screenHeight,
      duration: fallDuration,
      ease: "power2.in" // Start slower, end faster (accelerate)
    })
    .to(catElement, {
      y: screenHeight - bounceHeight,
      duration: 0.3,
      ease: "power2.out" // Start faster, end slower
    })
    .to(catElement, {
      y: screenHeight,
      duration: 0.15,
      ease: "power2.out"
    })
    .to(catElement, {
      y: screenHeight - bounceHeight * 0.3, // Smaller second bounce
      duration: 0.2,
      ease: "power2.out"
    })
    .to(catElement, {
      y: screenHeight,
      duration: 0.15,
      ease: "power2.out"
    })
  })
}

// Make individual cat draggable
const makeDraggable = (element: HTMLElement) => {
  // Clear any existing transforms to ensure clean starting position
  gsap.set(element, { clearProps: "transform" })
  
  Draggable.create(element, {
    type: "x,y",
    bounds: "body",
    inertia: true,
    liveSnap: false, // Prevent automatic position snapping
    onDrag: function() {
      // Optional: Add some rotation while dragging
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

/* Ensure cats don't interfere with other UI elements */
.cat-image:hover {
  z-index: 10;
}
</style>
