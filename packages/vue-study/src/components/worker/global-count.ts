import { createGlobalState } from '../../hooks/globalScope'
import { ref } from 'vue'
export const useGlobalCount = createGlobalState(() => {
  const count = ref<number>(222)
  const increment = () => count.value++
  return { count, increment }
})