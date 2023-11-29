import { ref, watchEffect, toValue } from 'vue'

const hierarchy = ref([])

export function useHierarchy() {
  return hierarchy.value
}

export function useAddItem({current= '', parent= 'root', clearAll= false}) {
  if (clearAll) hierarchy.value.splice(0)
  if (parent && current) hierarchy.value.unshift({
    current: current,
    parent: parent
  })
}

export function useShift() {
  hierarchy.value.shift()
}

export function useClear() {
  hierarchy.value.splice(0)
}

export function useCurrent() {
  console.log("osdfdsf")
  return hierarchy.value[0]
}