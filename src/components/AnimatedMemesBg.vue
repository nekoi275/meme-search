<template>
  <div class="animated-memes-container">
    <div
      v-for="(meme, index) in memes"
      :key="index"
      :ref="el => memeRefs[index] = el as HTMLElement"
      class="meme-image"
      :style="{
        width: meme.width + 'px',
        transform: `rotate(${meme.rotation}deg)`,
        left: meme.startX + 'px',
        top: meme.startY + 'px'
      }"
    >
      <img :src="meme.src" :alt="`Мем ${index + 1}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { Physics2DPlugin } from 'gsap/Physics2DPlugin'

const bgModules = import.meta.glob('../assets/bg/*.webp', { eager: true })

gsap.registerPlugin(Draggable, Physics2DPlugin)

type Side = 'top' | 'bottom' | 'left' | 'right'

interface MemeData {
  src: string
  width: number
  rotation: number
  startX: number
  startY: number
  isAnimating: boolean
  side: Side
  velocity: number
  angle: number
  isInsideViewport: boolean
}

const memeRefs = ref<(HTMLElement | null)[]>([])
const memes = ref<MemeData[]>([])

// Friction value - balanced with velocity to allow long movement
const FRICTION = 0.001

// Velocity range - slightly different for each meme
const MIN_VELOCITY = 450
const MAX_VELOCITY = 500

const initializeMemes = () => {
  const memeImagePaths = Object.values(bgModules).map(module => (module as any).default)
  if (memeImagePaths.length === 0) {
    console.warn('No meme images found')
    return
  }
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const sides: Side[] = ['top', 'bottom', 'left', 'right']
  
  memes.value = Array.from({ length: 10 }, () => {
    const side = sides[Math.floor(Math.random() * sides.length)]!
    let startX = 0
    let startY = 0
    let angle = 0
    
    // Calculate initial angle based on side and random direction
    // Physics2D angle: 0° = right, 90° = down, 180° = left, 270° = up
    switch (side) {
      case 'top':
        startX = Math.random() * screenWidth
        startY = -200
        // Coming from top, going down: angle between 90° (down) and 180° (down-left)
        angle = Math.random() * 90 + 90 // 90° to 180°
        break
      case 'bottom':
        startX = Math.random() * screenWidth
        startY = screenHeight + 200
        // Coming from bottom, going up: angle between 270° (up) and 360°/0° (up-right)
        angle = Math.random() * 90 + 270 // 270° to 360°
        break
      case 'left':
        startX = -200
        startY = Math.random() * screenHeight
        // Coming from left, going right: angle between -45° (315°) and 45°
        angle = Math.random() * 90 - 45 // -45° to 45°
        if (angle < 0) angle += 360 // Normalize to 0-360
        break
      case 'right':
        startX = screenWidth + 200
        startY = Math.random() * screenHeight
        // Coming from right, going left: angle between 135° (down-left) and 225° (up-left)
        angle = Math.random() * 90 + 135 // 135° to 225°
        break
    }
    
    // Random velocity for each meme
    const velocity = Math.random() * (MAX_VELOCITY - MIN_VELOCITY) + MIN_VELOCITY
    
    return {
      src: memeImagePaths[Math.floor(Math.random() * memeImagePaths.length)]!,
      width: Math.random() * (250 - 100) + 100,
      rotation: Math.random() * 360,
      startX,
      startY,
      isAnimating: true,
      side,
      velocity,
      angle,
      isInsideViewport: false
    }
  })
}

const checkBoundsAndBounce = (meme: MemeData, element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  
  // Проверяем, попал ли мем внутрь viewport
  if (!meme.isInsideViewport) {
    const isInside = rect.left >= 0 && 
                     rect.right <= screenWidth && 
                     rect.top >= 0 && 
                     rect.bottom <= screenHeight
    
    if (isInside) {
      meme.isInsideViewport = true
    } else {
      // Если еще не внутри, не проверяем границы - пусть продолжает движение внутрь
      return
    }
  }
  
  // Теперь проверяем выход за границы только если мем уже был внутри viewport
  let shouldBounce = false
  let newAngle = meme.angle
  
  // Проверяем левую стенку
  if (rect.left < 0) {
    // Отражаем горизонтально: 180 - angle
    newAngle = 180 - meme.angle
    shouldBounce = true
  }
  // Проверяем правую стенку
  else if (rect.right > screenWidth) {
    // Отражаем горизонтально: 180 - angle
    newAngle = 180 - meme.angle
    shouldBounce = true
  }
  
  // Проверяем верхнюю стенку
  if (rect.top < 0) {
    // Отражаем вертикально: 360 - angle
    newAngle = 360 - meme.angle
    shouldBounce = true
  }
  // Проверяем нижнюю стенку
  else if (rect.bottom > screenHeight) {
    // Отражаем вертикально: 360 - angle
    newAngle = 360 - meme.angle
    shouldBounce = true
  }
  
  if (shouldBounce) {
    // Normalize angle to 0-360 range
    while (newAngle < 0) newAngle += 360
    while (newAngle >= 360) newAngle -= 360
    
    meme.angle = newAngle
    
    // Kill existing tween and create new one with updated angle
    const existingTween = gsap.getTweensOf(element)[0] as gsap.core.Tween | undefined
    if (existingTween) {
      existingTween.kill()
    }
    
    // Restart physics animation with new angle
    gsap.to(element, {
      duration: 20,
      physics2D: {
        velocity: meme.velocity,
        angle: meme.angle,
        friction: FRICTION
      },
      onUpdate: () => checkBoundsAndBounce(meme, element)
    })
  }
}

const animateMemes = async () => {
  await nextTick()
  
  memes.value.forEach((meme, index) => {
    const memeElement = memeRefs.value[index]
    if (!memeElement) return
    
    // Start physics animation
    gsap.to(memeElement, {
      duration: 20,
      physics2D: {
        velocity: meme.velocity,
        angle: meme.angle,
        friction: FRICTION
      },
      onUpdate: () => checkBoundsAndBounce(meme, memeElement)
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
  initializeMemes()
  animateMemes()
})
</script>

<style scoped>
.animated-memes-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  z-index: 0;
  overflow: hidden;
}

.meme-image {
  position: absolute;
  pointer-events: auto;
  cursor: grab;
  transition: transform 0.1s ease;
}

.meme-image:active {
  cursor: grabbing;
}

.meme-image img {
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.meme-image:hover {
  z-index: 10;
}
</style>
