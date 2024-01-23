import { ref, onMounted, onUnmounted } from 'vue'

const width = ref(0)

export function useWindowWidth(needEvent = false) {

  width.value = document.documentElement.clientWidth

  function update() {
    width.value = document.documentElement.clientWidth
  }

  if (needEvent) {
    onMounted(() => window.addEventListener('resize', update))
    onUnmounted(() => window.removeEventListener('resize', update))
  }

  return width
}