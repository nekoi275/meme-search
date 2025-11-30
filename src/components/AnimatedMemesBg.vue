<template>
  <div class="animated-memes-container">
    <div v-for="(meme, index) in memes" :key="index" :ref="el => memeRefs[index] = el as HTMLElement" class="meme-image"
      :style="{
        width: meme.width + 'px',
        transform: `translate3d(${meme.x}px, ${meme.y}px, 0) rotate(${meme.rotation}deg)`
      }">
      <img :src="meme.src" :alt="`Мем ${index + 1}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

const bgModules = import.meta.glob('../assets/bg/*.webp', { eager: true })

gsap.registerPlugin(Draggable)

interface MemeData {
  src: string
  width: number
  height: number
  rotation: number
  x: number
  y: number
  vx: number
  vy: number
  isDragging: boolean
  isInsideViewport: boolean
}

const memeRefs = ref<(HTMLElement | null)[]>([])
const memes = ref<MemeData[]>([])

// Physics constants
const FRICTION = 1 // Velocity multiplier per frame (simulates air resistance)
const BOUNCE_DAMPING = 0.9 // Energy loss on bounce
const MIN_SPEED = 0.1 // Minimum speed to keep moving
const MAX_SPEED = 10 // Cap max speed to prevent glitching
const LAUNCH_MULTIPLIER = 1.5 // Boost throw velocity slightly

const initializeMemes = () => {
  const memeImagePaths = Object.values(bgModules).map(module => (module as any).default)
  if (memeImagePaths.length === 0) {
    console.warn('No meme images found')
    return
  }

  for (let i = memeImagePaths.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [memeImagePaths[i], memeImagePaths[j]] = [memeImagePaths[j], memeImagePaths[i]];
  }

  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  const isMobile = screenWidth < 768
  const minSize = isMobile ? 60 : 100
  const maxSize = isMobile ? 150 : 250

  memes.value = Array.from({ length: 10 }, (_, index) => {
    const width = Math.random() * (maxSize - minSize) + minSize
    const height = width

    const side = Math.floor(Math.random() * 4)
    let startX = 0
    let startY = 0

    const spawnMargin = 300

    switch (side) {
      case 0: // top
        startX = Math.random() * screenWidth
        startY = -spawnMargin
        break
      case 1: // right
        startX = screenWidth + spawnMargin
        startY = Math.random() * screenHeight
        break
      case 2: // bottom
        startX = Math.random() * screenWidth
        startY = screenHeight + spawnMargin
        break
      case 3: // left
        startX = -spawnMargin
        startY = Math.random() * screenHeight
        break
    }

    const targetX = screenWidth * 0.2 + Math.random() * (screenWidth * 0.6)
    const targetY = screenHeight * 0.2 + Math.random() * (screenHeight * 0.6)

    const angle = Math.atan2(targetY - startY, targetX - startX)
    const initialSpeed = Math.random() * 3 + 3

    return {
      src: memeImagePaths[index % memeImagePaths.length]!,
      width,
      height,
      rotation: Math.random() * 360,
      x: startX,
      y: startY,
      vx: Math.cos(angle) * initialSpeed,
      vy: Math.sin(angle) * initialSpeed,
      isDragging: false,
      isInsideViewport: false
    }
  })
}

const updatePhysics = () => {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  memes.value.forEach((meme, index) => {
    if (meme.isDragging) return

    meme.x += meme.vx
    meme.y += meme.vy

    meme.vx *= FRICTION
    meme.vy *= FRICTION

    const el = memeRefs.value[index]
    if (!el) return

    const boxW = meme.width
    const boxH = meme.width * (el.offsetHeight / el.offsetWidth || 1)

    if (!meme.isInsideViewport) {
      if (
        meme.x > 0 &&
        meme.x + boxW < screenWidth &&
        meme.y > 0 &&
        meme.y + boxH < screenHeight
      ) {
        meme.isInsideViewport = true
      }
    }

    if (meme.isInsideViewport) {
      let bounced = false

      if (meme.x < 0) {
        meme.x = 0
        meme.vx = -meme.vx * BOUNCE_DAMPING
        bounced = true
      }
      else if (meme.x + boxW > screenWidth) {
        meme.x = screenWidth - boxW
        meme.vx = -meme.vx * BOUNCE_DAMPING
        bounced = true
      }

      if (meme.y < 0) {
        meme.y = 0
        meme.vy = -meme.vy * BOUNCE_DAMPING
        bounced = true
      }
      else if (meme.y + boxH > screenHeight) {
        meme.y = screenHeight - boxH
        meme.vy = -meme.vy * BOUNCE_DAMPING
        bounced = true
      }

      if (bounced) {
        gsap.to(meme, {
          rotation: meme.rotation + (Math.random() * 60 - 30),
          duration: 0.5
        })
      }
    }

    gsap.set(el, {
      x: meme.x,
      y: meme.y,
      rotation: meme.rotation
    })
  })
}

const setupDraggable = () => {
  memeRefs.value.forEach((el, index) => {
    if (!el) return

    Draggable.create(el, {
      type: "x,y",
      onPress: () => {
        const meme = memes.value[index]
        if (meme) {
          meme.isDragging = true
          gsap.killTweensOf(meme, "rotation")
        }
      },
      onDrag: function () {
        const meme = memes.value[index]
        if (!meme) return

        meme.x = this.x
        meme.y = this.y

        meme.vx = this.deltaX * LAUNCH_MULTIPLIER
        meme.vy = this.deltaY * LAUNCH_MULTIPLIER
      },
      onDragEnd: function () {
        const meme = memes.value[index]
        if (!meme) return

        meme.isDragging = false
        meme.x = this.x
        meme.y = this.y

        const speed = Math.sqrt(meme.vx * meme.vx + meme.vy * meme.vy)
        if (speed > MAX_SPEED) {
          const ratio = MAX_SPEED / speed
          meme.vx *= ratio
          meme.vy *= ratio
        }

        if (Math.abs(meme.vx) < MIN_SPEED && Math.abs(meme.vy) < MIN_SPEED) {
        }
      }
    })
  })
}

onMounted(async () => {
  initializeMemes()
  await nextTick()
  setupDraggable()
  gsap.ticker.add(updatePhysics)
})

onUnmounted(() => {
  gsap.ticker.remove(updatePhysics)
  memeRefs.value.forEach(el => {
    if (el && (el as any)._gsap) {
      const draggable = Draggable.get(el)
      if (draggable) draggable.kill()
    }
  })
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
  pointer-events: none;
}

.meme-image {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
  cursor: grab;
  will-change: transform;
}

.meme-image:active {
  cursor: grabbing;
  z-index: 100;
}

.meme-image img {
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}
</style>
