import { ref, onMounted, onUnmounted, computed } from 'vue'

const hierarchy = ref([])

export function useHierarchy() {
  return hierarchy.value
}

export function useHistory(key) {
  if (hierarchy.value.length) return hierarchy.value.find(item => item.key == key)?.history
  return []
}

export function useSetModalItem(key) {
  hierarchy.value.unshift({
    key: key,
    history: [],
    hasChildFooter: false
  })
}

export function useAddItem({current= '', parent= 'root', clearAll= false, key= ''}) {
  const idx = hierarchy.value.findIndex(item => item.key == key)
  if (idx > -1) { 
    if (clearAll) { 
      hierarchy.value[idx].history.splice(0)
    }
    if (parent && current) hierarchy.value[idx].history.unshift({
      current: current,
      parent: parent
    })
  }
}

export function useShift(key) {
  const idx = hierarchy.value.findIndex(item => item.key == key)
  if (idx > -1) hierarchy.value[idx].history.shift()
}

export function useClear(key) {
  const idx = hierarchy.value.findIndex(item => item.key == key)
  if (idx > -1) hierarchy.value.splice(idx, 1)
}

export function useCurrent() {
  return hierarchy.value[0]
}

export function useHaveChildFooter(key) {
  const idx = hierarchy.value.findIndex(item => item.key == key)
  if (idx > -1) {
    return hierarchy.value[idx].hasChildFooter || false
  }

}

export function useSetCurrentTitle(title, key) {
  const idx = hierarchy.value.findIndex(item => item.key == key)
  if (idx > -1) {
    return hierarchy.value[idx].history[0].title = title
  }

}

export function useSetHaveChildFooter(value, key) {
  const idx = hierarchy.value.findIndex(item => item.key == key)
  if (idx > -1) {
    hierarchy.value[idx].hasChildFooter = value
  }
}

export function useWindowWidth(needEvent = false) {
  const width = ref(0)

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