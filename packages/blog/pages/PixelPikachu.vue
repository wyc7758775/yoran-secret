<script setup>
import { computed } from 'vue'

defineProps({
  size: {
    type: [Number, String],
    default: 100,
  },
})

const pikachuPixels = computed(() => {
  const grid = [
    '.......BB..BB.......',
    '......BBB..BBB......',
    '.....BBBYBBYBBB.....',
    '....BBYYYYYYYYBB....',
    '...BYYYYYYYYYYYYB...',
    '...YYYYBBYYBBYYYY...',
    '..YYYYYBBYYBBYYYYY..',
    '..YYYYYYYYYYYYYYYY..',
    '..YYYYRRYYYYRRYYYY..',
    '...YYYYYYYYYYYYYY...',
    '...YYYYYYYYYYYYYY...',
    '....YYYYYYYYYYYY....',
    '....YYYYYYYYYYYY....',
    '...OYYYYYYYYYYYYO...',
    '..OOOYYYYYYYYOOO....',
    '..OOOYYYYYYYYOOO....',
    '...YYYYYYYYYYYYYY...',
    '....YYYYYYYYYYYY....',
    '....YY........YY....',
    '...OO..........OO...',
  ]
  const colors = {
    B: '#221F20',
    Y: '#FFE21A',
    R: '#F04438',
    O: '#F2AE36',
  }
  const pixels = []
  grid.forEach((row, y) => {
    row.split('').forEach((cell, x) => {
      if (cell !== '.') {
        pixels.push({
          x: x * 5,
          y: y * 5,
          fill: colors[cell],
        })
      }
    })
  })
  return pixels
})
</script>

<template>
  <svg
    class="pixel-pikachu"
    viewBox="0 0 100 100"
    :width="size"
    :height="size"
    role="img"
    aria-label="Pixel Pikachu"
  >
    <rect
      v-for="p in pikachuPixels"
      :key="`${p.x}-${p.y}`"
      :x="p.x"
      :y="p.y"
      width="5"
      height="5"
      :fill="p.fill"
    />
  </svg>
</template>

<style scoped>
.pixel-pikachu {
  display: block;
  image-rendering: pixelated;
  shape-rendering: crispEdges;
}
</style>
