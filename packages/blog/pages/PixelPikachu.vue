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
    '.........................',
    '......BBB................',
    '......BYYB...............',
    '.....BBYYYB..............',
    '.....BYYYYBB......BBB....',
    '....BBYYYYYB....BBBBB....',
    '....BYYYYYYBBBBBBYYYBB...',
    '...BBYYYYYYYYYYYYYYYYB...',
    '..BBBBB..BYYYYYYYYYYYBB..',
    '.BBYYYB.BYYYYYYYYYYYYYB..',
    '.BYYYYBBYYYYBBYYYYBBYYB..',
    '.BYYYYYYYYYB..BYYB..YYB..',
    '.BYYYYBYYYYBBYYYYBBYYYB..',
    '.BBYYYBYYYYYYRRYYYYYYB...',
    '..BBBBYYYYYRRBBYYRRYYB...',
    '....BYYYYYYYBBYYRRYYB....',
    '....BBYYYYYYYYYYYYYBB....',
    '.....BYYYYYYYYYYYYB......',
    '....BBYYYYYYYYYYYB.......',
    '....BYYYYYYYYYYYYBB......',
    '.....BYYYYYYYYYYYYB......',
    '......BYYYBYYYBYYB.......',
    '......BYYB.BYYB.BB.......',
    '......BBB..BBB...........',
    '.........................',
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
          x: x * 4,
          y: y * 4,
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
      width="4"
      height="4"
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
