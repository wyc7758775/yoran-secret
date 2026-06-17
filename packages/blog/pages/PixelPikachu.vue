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
    '...............................',
    '...............................',
    '...............................',
    '...............................',
    '........BB.....................',
    '........BBB....................',
    '........BBYB...................',
    '.........BYYB.BBBBB............',
    '.........BYYBBYYYYYBBBBBBB.....',
    '..........BBYYYYYYYYYYYYBBB....',
    '..........BYYYYYYYYYYYYYBB.....',
    '....BBBBB.BYYYYYYYYYYYBB.......',
    '....BYYYYBYYBBYYYYYBBYYB.......',
    '....BYYYYBYYBBYYBYYBBYYB.......',
    '....BYYYYBYRRYYBRBYYRRYB.......',
    '....BYYYYBYRRYYBRBYYRRYB.......',
    '....BBBBYYYYYYYYBYYBBYB........',
    '........BYYYYYYYYYYBYB.........',
    '........BBYYYYYYYYYBYYB........',
    '.......BYBBBYYYYYYYYBYB........',
    '........BYYBYYYYYYYYYYYB.......',
    '.........BBYYYYYYYYYYYYB.......',
    '.........BBYYBYYYYYYYYYB.......',
    '..........BYBYBYYYYYYYB........',
    '...........BBYBYYBBBYB.........',
    '.............BBBB..BYB.........',
    '....................B..........',
    '...............................',
    '...............................',
    '...............................',
    '...............................',
  ]
  const colors = {
    B: '#111111',
    Y: '#F4D95F',
    R: '#C84233',
  }
  const pixels = []
  grid.forEach((row, y) => {
    row.split('').forEach((cell, x) => {
      if (cell !== '.') {
        pixels.push({
          x,
          y,
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
    viewBox="0 0 31 31"
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
      width="1"
      height="1"
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
